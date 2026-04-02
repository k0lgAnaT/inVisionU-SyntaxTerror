"""
inVision U — Baseline Scoring Model
=====================================
A deliberately simple rule-based baseline for comparison.

Rules:
  - GPA score: GPA / 5.0 * 100
  - Experience score: min(100, experience_count * 12)
  - Achievement score: min(100, achievement_count * 18)
  - Essay length: min(100, word_count / 3)

Final: average of above 4 components, no NLP processing.

This baseline is used to show improvement from our advanced model.
"""

from typing import Dict, Any


def score_baseline(candidate: dict) -> Dict[str, Any]:
    """
    Simple rule-based baseline — no NLP, no semantic analysis.
    Represents what a basic heuristic filter would do.
    """
    gpa = float(candidate.get("gpa", 3.0))
    experience = candidate.get("experience", [])
    achievements = candidate.get("achievements", [])
    essay = candidate.get("essay", "")
    word_count = len(essay.split())

    # Component scores (0–100)
    gpa_score = round((gpa / 5.0) * 100)
    exp_score = min(100, len(experience) * 12 if isinstance(experience, list) else 0)
    ach_score = min(100, len(achievements) * 18 if isinstance(achievements, list) else 0)
    essay_len_score = min(100, word_count // 3)

    total = round((gpa_score + exp_score + ach_score + essay_len_score) / 4)

    return {
        "total_score": total,
        "components": {
            "gpa_score": {"score": gpa_score, "weight": 0.25, "explanation": f"GPA {gpa}/5.0 scaled to 100"},
            "experience_score": {"score": exp_score, "weight": 0.25, "explanation": f"{len(experience) if isinstance(experience, list) else 0} experience entries × 12"},
            "achievement_score": {"score": ach_score, "weight": 0.25, "explanation": f"{len(achievements) if isinstance(achievements, list) else 0} achievements × 18"},
            "essay_length_score": {"score": essay_len_score, "weight": 0.25, "explanation": f"{word_count} words ÷ 3"},
        },
        "method": "baseline_rule_based",
        "explanation": "Simple rule-based scoring: GPA + experience count + achievement count + essay length. No NLP or semantic analysis."
    }
