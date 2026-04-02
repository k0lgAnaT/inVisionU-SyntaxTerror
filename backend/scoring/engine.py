"""
inVision U — Advanced Scoring Engine (Python / NLP)
=====================================================
Multi-dimensional candidate scoring with full explainability.

Dimensions:
  1. Leadership Potential     (28% default)
  2. Motivation & Authenticity (22%)
  3. Growth Trajectory        (20%)
  4. Communication Clarity    (15%)
  5. Growth Velocity          (15%)
  + AI Usage Penalty          (adaptive)

All features are NLP-derived — no demographic/socioeconomic inputs.
"""

import math
import re
from typing import Dict, Any, List, Optional

from scoring.heuristics import (
    extract_all_features,
    get_matched_keywords,
    LEADERSHIP_KEYWORDS,
    MOTIVATION_KEYWORDS,
    GROWTH_KEYWORDS,
)
from scoring.baseline import score_baseline


# ─── Weight Profiles ──────────────────────────────────────────────────────────

WEIGHT_PROFILES = {
    "default":       {"leadership": 0.28, "motivation": 0.22, "growth": 0.20, "communication": 0.15, "velocity": 0.15},
    "leadership":    {"leadership": 0.40, "motivation": 0.18, "growth": 0.15, "communication": 0.12, "velocity": 0.15},
    "authenticity":  {"leadership": 0.18, "motivation": 0.38, "growth": 0.20, "communication": 0.14, "velocity": 0.10},
    "potential":     {"leadership": 0.18, "motivation": 0.18, "growth": 0.22, "communication": 0.12, "velocity": 0.30},
}


# ─── Dimension Scorers ────────────────────────────────────────────────────────

def score_leadership(features: dict, candidate: dict) -> Dict[str, Any]:
    """
    Score: Leadership Potential
    Signals: keyword density, action verbs, initiative evidence, reference count.
    """
    kw_density = features["leadership_keyword_density"]
    hits = features["leadership_matched"]
    exp_count = features["experience_count"]
    references = features["references_count"]

    raw = min(100,
        kw_density * 300          # keyword density bonus
        + len(hits) * 9           # matched keyword count
        + exp_count * 7           # experience diversity
        + (references >= 2) * 10  # corroborated by references
        + (exp_count >= 3) * 8    # breadth bonus
        + 15                      # base floor
    )

    score = round(min(100, raw))
    level = "high" if score >= 70 else "moderate" if score >= 45 else "low"

    return {
        "score": score,
        "label": "Leadership Potential",
        "level": level,
        "explanation": (
            f"Strong leadership signals: {', '.join(hits[:3])}." if len(hits) >= 3 else
            f"Moderate leadership signals: {', '.join(hits[:2])}." if hits else
            "Limited direct leadership language detected."
        ),
        "evidence": [f'Signal: "{k}"' for k in hits[:4]] + [f"{exp_count} experience entries"],
    }


def score_motivation(features: dict, candidate: dict) -> Dict[str, Any]:
    """
    Score: Motivation & Authenticity
    Signals: mission language, specific goals, vision statements, video.
    """
    essay = candidate.get("essay", "")
    kw_density = features["motivation_keyword_density"]
    hits = features["motivation_matched"]
    specificity = features["specificity"]["score"]
    has_video = features["has_video"]

    # Penalty for AI-generated content (reduces authenticity)
    ai_penalty = 0.85 if features["ai_detection"]["suspicion_score"] >= 60 else 1.0

    # Specificity is key for authenticity: vague text = low motivation score
    raw = min(100,
        kw_density * 280
        + len(hits) * 8
        + specificity * 0.25      # concrete goals/numbers boost authenticity
        + (has_video) * 8
        + 18
    ) * ai_penalty

    score = round(min(100, raw))

    return {
        "score": score,
        "label": "Motivation & Authenticity",
        "level": "high" if score >= 70 else "moderate" if score >= 45 else "low",
        "explanation": (
            f"Clear mission-driven motivation with specific goals. Key signals: {', '.join(hits[:2])}." if score >= 70 else
            f"Some motivation visible but vague on goals." if score >= 45 else
            "Essay lacks clear purpose or concrete vision."
        ),
        "evidence": [f'Motivation signal: "{k}"' for k in hits[:3]] + [
            f"Specificity score: {specificity}/100",
            "Video statement submitted" if has_video else "No video statement",
        ],
    }


def score_growth(features: dict, candidate: dict) -> Dict[str, Any]:
    """
    Score: Growth Trajectory
    Signals: resilience language, adversity arc, progress markers.
    """
    essay = candidate.get("essay", "")
    hits = features["growth_matched"]
    kw_density = features["growth_keyword_density"]

    adversity_patterns = ["lost", "failed", "failure", "difficult", "despite",
                          "потерял", "потеряла", "провал", "трудность", "несмотря"]
    has_adversity = any(p in essay.lower() for p in adversity_patterns)

    raw = min(100,
        kw_density * 260
        + len(hits) * 8
        + (has_adversity) * 22    # adversity narrative = resilience signal
        + features["experience_count"] * 5
        + 15
    )
    score = round(min(100, raw))

    return {
        "score": score,
        "label": "Growth Trajectory",
        "level": "high" if score >= 70 else "moderate" if score >= 45 else "low",
        "explanation": (
            f"Strong growth narrative with resilience arc." if has_adversity and score >= 65 else
            f"Growth signals present but limited adversity narrative." if score >= 45 else
            "Essay lacks a compelling transformation arc."
        ),
        "evidence": [f'Growth signal: "{k}"' for k in hits[:3]] + [
            "Adversity arc present" if has_adversity else "No adversity narrative detected",
        ],
    }


def score_communication(features: dict, candidate: dict) -> Dict[str, Any]:
    """
    Score: Communication Clarity
    Signals: readability (Flesch), vocabulary richness (TTR), essay length.
    """
    readability = features["readability"]
    vocab = features["vocabulary"]

    flesch = readability.get("flesch_reading_ease", 50)
    ttr = vocab.get("type_token_ratio", 1.0)
    word_count = vocab.get("total_words", 0)

    # Normalize Flesch: ideal range is 30-70 for academic writing
    flesch_score = max(0, min(100, 100 - abs(flesch - 50) * 1.5))

    # TTR normalized (higher = richer vocabulary)
    ttr_score = min(100, ttr * 100)

    # Length score: sweet spot 200-400 words
    if word_count >= 200:
        length_score = min(100, 60 + (word_count - 200) // 10)
    else:
        length_score = max(0, word_count // 2)

    raw = flesch_score * 0.35 + ttr_score * 0.35 + length_score * 0.30
    score = round(min(100, raw))

    return {
        "score": score,
        "label": "Communication Clarity",
        "level": "high" if score >= 68 else "moderate" if score >= 45 else "low",
        "explanation": (
            f"Well-structured essay ({word_count} words, rich vocabulary)." if score >= 68 else
            f"Adequate communication ({word_count} words), could be improved." if score >= 45 else
            f"Essay is weak — too short or low vocabulary variety ({word_count} words)."
        ),
        "evidence": [
            f"Word count: {word_count}",
            f"Flesch reading ease: {round(flesch, 1)}",
            f"Vocabulary richness (RTTR): {round(ttr, 3)}",
        ],
    }


def score_growth_velocity(features: dict, candidate: dict) -> Dict[str, Any]:
    """
    Score: Growth Velocity — how fast is this candidate growing relative to age?
    Age-adjusted achievement rate: younger + more = higher velocity.
    """
    age = int(candidate.get("age", 18))
    exp_count = features["experience_count"]
    ach_count = features["achievement_count"]

    age_multiplier = 1.4 if age <= 16 else 1.3 if age <= 17 else 1.1 if age <= 18 else 1.0

    raw = min(100, (
        exp_count * 9
        + ach_count * 12
        + features["references_count"] * 5
        + (features["has_video"]) * 6
        + 20
    ) * age_multiplier)

    score = round(min(100, raw))

    evidence = []
    if ach_count > 0: evidence.append(f"{ach_count} achievements")
    if exp_count > 0: evidence.append(f"{exp_count} experience entries")
    if age <= 17: evidence.append(f"Exceptional for age {age} (×{age_multiplier} multiplier)")

    return {
        "score": score,
        "label": "Growth Velocity",
        "level": "high" if score >= 70 else "moderate" if score >= 45 else "low",
        "explanation": (
            f"Exceptional achievement velocity for age {age}." if score >= 75 and age <= 17 else
            f"Solid trajectory — above average output for age group." if score >= 55 else
            "Modest output — trajectory evidence is limited."
        ),
        "evidence": evidence,
    }


# ─── Smart Interview Question Generator ──────────────────────────────────────

def generate_smart_questions(candidate: dict, dim_scores: dict) -> List[str]:
    """Generate targeted interview questions for weak dimensions."""
    questions = []
    sorted_dims = sorted(dim_scores.items(), key=lambda x: x[1]["score"])

    for dim, data in sorted_dims[:3]:
        if dim == "leadership" and data["score"] < 60:
            questions.append(
                "Describe a specific moment when you chose to act when no one asked you to — "
                "what was the risk and what happened?"
            )
        elif dim == "motivation" and data["score"] < 58:
            questions.append(
                "What problem in Kazakhstan keeps you up at night? "
                "Tell us about one concrete thing you tried to do about it, even if it failed."
            )
        elif dim == "growth" and data["score"] < 55:
            questions.append(
                "Walk me through your biggest failure or setback. "
                "What did it force you to change about yourself?"
            )
        elif dim == "communication" and data["score"] < 50:
            questions.append(
                "If you had 90 seconds to explain your biggest project to a skeptical investor — what would you say?"
            )
        elif dim == "velocity" and data["score"] < 50:
            questions.append(
                "What is the most ambitious thing you started that isn't on your resume yet?"
            )

    if not candidate.get("videoStatement"):
        questions.append("You didn't submit a video statement — tell us something that wouldn't fit in a written essay.")

    return questions[:3]


# ─── Main Scoring Function ────────────────────────────────────────────────────

def score_candidate_advanced(candidate: dict, profile: str = "default") -> Dict[str, Any]:
    """
    Full advanced scoring pipeline:
    1. Extract NLP features
    2. Score each dimension
    3. Compute weighted total
    4. Apply AI penalty
    5. Generate recommendation + questions
    """
    weights = WEIGHT_PROFILES.get(profile, WEIGHT_PROFILES["default"])

    # Feature extraction
    features = extract_all_features(candidate)

    # Dimension scores
    leadership   = score_leadership(features, candidate)
    motivation   = score_motivation(features, candidate)
    growth       = score_growth(features, candidate)
    communication = score_communication(features, candidate)
    velocity     = score_growth_velocity(features, candidate)

    ai_raw = features["ai_detection"]
    ai_suspicion = {
        "score": ai_raw["suspicion_score"],
        "label": "AI Usage Suspicion",
        "level": "high" if ai_raw["suspicion_score"] >= 60 else "moderate" if ai_raw["suspicion_score"] >= 30 else "low",
        "explanation": ai_raw.get("matched_phrases", []),
        "is_suspicious": ai_raw["is_suspicious"],
        "evidence": [f'AI phrase: "{p}"' for p in ai_raw.get("matched_phrases", [])[:4]] or ["No AI clichés detected"],
    }

    dim_scores = {
        "leadership": leadership,
        "motivation": motivation,
        "growth": growth,
        "communication": communication,
        "velocity": velocity,
    }

    # Weighted composite
    raw_total = (
        leadership["score"]    * weights["leadership"]
        + motivation["score"]   * weights["motivation"]
        + growth["score"]       * weights["growth"]
        + communication["score"]* weights["communication"]
        + velocity["score"]     * weights["velocity"]
    )

    # AI penalty
    ai_score = ai_suspicion["score"]
    if ai_score >= 60:
        raw_total *= 0.88
    elif ai_score >= 35:
        raw_total *= 0.95

    total_score = round(min(100, max(0, raw_total)))

    # Flags
    flags = []
    if ai_score >= 60:   flags.append("⚠️ High AI-usage suspicion")
    elif ai_score >= 35: flags.append("🔍 Moderate AI signals")
    if not candidate.get("videoStatement"): flags.append("📹 No video statement")
    if features["references_count"] <= 1:  flags.append("👤 Single reference only")
    if features["vocabulary"]["total_words"] < 80: flags.append("📝 Essay too short")
    if leadership["score"] >= 75:  flags.append("🌟 Strong leader profile")
    if velocity["score"] >= 78:    flags.append("🚀 High growth velocity")

    # Recommendation
    if total_score >= 75 and ai_score < 50:
        recommendation = "STRONG_YES"
    elif total_score >= 62:
        recommendation = "YES"
    elif total_score >= 47:
        recommendation = "MAYBE"
    else:
        recommendation = "NO"

    # Baseline comparison
    baseline = score_baseline(candidate)
    improvement = total_score - baseline["total_score"]

    # Smart questions
    smart_questions = generate_smart_questions(candidate, dim_scores)

    return {
        "candidate": candidate,
        "scores": {
            "leadership": leadership,
            "motivation": motivation,
            "growth": growth,
            "communication": communication,
            "growthVelocity": velocity,
            "aiSuspicion": ai_suspicion,
        },
        "totalScore": total_score,
        "shortlistRecommendation": recommendation,
        "flags": flags,
        "smartQuestions": smart_questions,
        "baseline": baseline,
        "improvementOverBaseline": improvement,
        "features": {
            "ai_detection": ai_raw,
            "readability": features["readability"],
            "vocabulary": features["vocabulary"],
            "burstiness": features["burstiness"],
            "specificity": features["specificity"],
        },
        "scoringProfile": profile,
        "scoringMethod": "advanced_nlp",
    }


def score_all_candidates(candidates: List[dict], profile: str = "default") -> List[Dict[str, Any]]:
    """Score a list of candidates, rank, and compute cohort percentiles."""
    results = [score_candidate_advanced(c, profile) for c in candidates]
    results.sort(key=lambda x: x["totalScore"], reverse=True)
    for i, r in enumerate(results):
        r["rank"] = i + 1
        r["cohortPercentile"] = round(100 - (i / max(len(results), 1)) * 100)
    return results
