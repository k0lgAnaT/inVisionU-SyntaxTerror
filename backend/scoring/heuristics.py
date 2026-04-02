"""
inVision U — NLP Feature Extraction Module
==========================================
Uses textstat for readability metrics and custom Python NLP
for vocabulary analysis, sentence structure, and linguistic signals.

No demographic or socioeconomic features are used.
"""

import re
import math
import string
from typing import Dict, List, Any

try:
    import textstat
    TEXTSTAT_AVAILABLE = True
except ImportError:
    TEXTSTAT_AVAILABLE = False


# ─── Bilingual Keyword Banks (EN + RU/KZ) ─────────────────────────────────────

LEADERSHIP_KEYWORDS = {
    # English — direct action words
    "founded", "created", "built", "launched", "led", "organized", "initiated",
    "established", "pioneered", "developed", "designed", "managed", "mentored",
    "taught", "trained", "recruited", "scaled", "grew", "expanded", "transformed",
    "coordinated", "directed", "headed", "chaired", "spearheaded", "drove",
    "captain", "president", "director", "founder", "leader", "coordinator",
    # Russian — action verbs (perfective & imperfective)
    "основал", "создал", "построил", "запустил", "возглавил", "организовал",
    "инициировал", "разработал", "управлял", "наставлял", "обучал",
    "масштабировал", "координировал", "руководил", "основала", "создала",
    "организовала", "запустила", "разработала", "возглавила",
    # Kazakh
    "құрды", "басқарды", "ұйымдастырды",
}

MOTIVATION_KEYWORDS = {
    "mission", "vision", "purpose", "impact", "change", "believe", "passion",
    "dream", "aspire", "inspire", "transform", "society", "future", "goal",
    "determined", "committed", "driven", "мечта", "цель", "миссия",
    "верю", "хочу изменить", "мотивация", "вдохновение", "страсть",
    "будущее", "общество", "убеждён", "убеждена", "стремлюсь",
}

GROWTH_KEYWORDS = {
    "learned", "grew", "improved", "overcame", "despite", "challenge",
    "failure", "resilience", "adapted", "evolved", "journey", "progress",
    "developed", "realized", "understood", "reflected",
    "научился", "научилась", "выросла", "вырос", "преодолел", "преодолела",
    "несмотря на", "трудность", "неудача", "провал", "развитие",
    "прогресс", "путь", "изменился", "изменилась", "осознал", "осознала",
}

SPECIFICITY_SIGNALS = {
    # Signals the candidate has concrete numbers/evidence
    r'\d+\s*(человек|студент|уч[её]ник|участник|users?|students?|people|members?)',
    r'\d+\s*(проект|project|startup|business)',
    r'\d+\s*(тыс|thousand|million|млн)',
    r'\d{4}',  # year references
    r'\$\d+|\d+\s*(тенге|KZT|usd)',
    r'\d+\s*(место|place|prize|award)',
}

AI_CLICHE_PHRASES = [
    # English AI-generation fingerprints
    "multifaceted", "encompasses", "tapestry of", "leverage", "synergies",
    "holistic approach", "paradigm", "cutting-edge", "robust framework",
    "comprehensive understanding", "rapidly evolving", "optimal framework",
    "competitive environment", "meaningful contribution", "proactive approach",
    "consistently demonstrated", "equipped me with", "necessary skills",
    "full potential", "organizational objectives", "dynamic landscape",
    "pivotal role", "culmination of", "invaluable experience",
    "embark on", "fostering", "harnessing", "catalyzing",
    "in today's fast-paced", "in the ever-changing",
    # Russian AI fingerprints
    "многогранный", "ключевую роль", "неотъемлемой частью",
    "в современном мире", "в условиях глобализации",
    "комплексный подход", "эффективное взаимодействие",
]


# ─── Readability Features ──────────────────────────────────────────────────────

def get_readability_features(text: str) -> Dict[str, float]:
    """Extract readability metrics using textstat (if available) with fallback."""
    if TEXTSTAT_AVAILABLE:
        try:
            return {
                "flesch_reading_ease": textstat.flesch_reading_ease(text),
                "flesch_kincaid_grade": textstat.flesch_kincaid_grade(text),
                "automated_readability_index": textstat.automated_readability_index(text),
                "sentence_count": textstat.sentence_count(text),
                "avg_syllables_per_word": textstat.avg_syllables_per_word(text),
                "lexicon_count": textstat.lexicon_count(text, removepunct=True),
            }
        except Exception:
            pass

    # Manual fallback
    sentences = [s for s in re.split(r'[.!?]+', text) if s.strip()]
    words = text.split()
    return {
        "flesch_reading_ease": 50.0,  # neutral
        "flesch_kincaid_grade": 10.0,
        "automated_readability_index": 10.0,
        "sentence_count": len(sentences),
        "avg_syllables_per_word": 1.5,
        "lexicon_count": len(words),
    }


# ─── Vocabulary & Linguistic Features ────────────────────────────────────────

def get_vocabulary_features(text: str) -> Dict[str, float]:
    """Vocabulary richness and linguistic diversity metrics."""
    words = re.findall(r'\b[a-zA-Zа-яА-ЯёЁ]+\b', text.lower())
    if not words:
        return {"type_token_ratio": 0, "vocab_size": 0, "avg_word_length": 0}

    unique = set(words)
    avg_word_len = sum(len(w) for w in words) / len(words)

    # Type-Token Ratio (normalized for length)
    ttr = len(unique) / math.sqrt(2 * len(words)) if len(words) > 0 else 0

    return {
        "type_token_ratio": round(ttr, 4),
        "vocab_size": len(unique),
        "total_words": len(words),
        "avg_word_length": round(avg_word_len, 2),
    }


# ─── Burstiness / AI Detection Features ──────────────────────────────────────

def get_burstiness_features(text: str) -> Dict[str, float]:
    """
    Burstiness = variance in sentence lengths.
    Human text tends to have HIGH variance (burstiness).
    AI text tends to have LOW variance (uniform sentences).
    
    Reference: Gehrmann et al. (2019), Ippolito et al. (2020)
    """
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    if len(sentences) < 3:
        return {"burstiness_cv": 0.5, "burstiness_score": 50, "sentence_count": len(sentences)}

    lengths = [len(s.split()) for s in sentences]
    mean_len = sum(lengths) / len(lengths)
    variance = sum((l - mean_len) ** 2 for l in lengths) / len(lengths)
    std_dev = math.sqrt(variance)
    cv = std_dev / mean_len if mean_len > 0 else 0  # Coefficient of Variation

    # Higher CV = more human-like
    # Normalize: CV of 0.5 = perfectly average, CV < 0.2 = suspicious
    burstiness_score = min(100, max(0, int(cv * 100)))

    return {
        "burstiness_cv": round(cv, 4),
        "burstiness_score": burstiness_score,
        "sentence_count": len(sentences),
        "mean_sentence_length": round(mean_len, 1),
        "sentence_length_std": round(std_dev, 1),
    }


def get_ai_detection_features(text: str) -> Dict[str, Any]:
    """Multi-signal AI usage detection."""
    text_lower = text.lower()

    # Signal 1: Cliché phrase matching
    matched_phrases = [p for p in AI_CLICHE_PHRASES if p.lower() in text_lower]
    phrase_score = min(100, len(matched_phrases) * 15)

    # Signal 2: Burstiness
    burst = get_burstiness_features(text)
    uniformity_score = max(0, 50 - burst["burstiness_score"])  # Low burst = high uniformity

    # Signal 3: Sentence length uniformity
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    avg_len = sum(len(s.split()) for s in sentences) / max(len(sentences), 1)
    long_sentence_score = min(30, max(0, int((avg_len - 18) * 3))) if avg_len > 18 else 0

    # Signal 4: Lack of personal/specific details
    specificity_count = sum(
        1 for pattern in SPECIFICITY_SIGNALS
        if re.search(pattern, text, re.IGNORECASE)
    )
    vagueness_score = max(0, 20 - specificity_count * 5)

    total_suspicion = min(100, phrase_score * 0.4 + uniformity_score * 0.3 +
                         long_sentence_score * 0.2 + vagueness_score * 0.1)

    return {
        "suspicion_score": round(total_suspicion),
        "phrase_score": phrase_score,
        "uniformity_score": round(uniformity_score),
        "long_sentence_score": long_sentence_score,
        "vagueness_score": vagueness_score,
        "matched_phrases": matched_phrases[:5],
        "is_suspicious": total_suspicion >= 40,
    }


# ─── Keyword Scoring ──────────────────────────────────────────────────────────

def count_keyword_hits(text: str, keywords: set, normalized: bool = True) -> float:
    """Count keyword hits, optionally normalize by text length."""
    text_lower = text.lower()
    hits = sum(1 for kw in keywords if kw in text_lower)
    if normalized:
        words = len(text.split())
        return round(hits / max(words, 1) * 100, 4)
    return float(hits)


def get_matched_keywords(text: str, keywords: set) -> List[str]:
    """Return list of matched keywords (for explainability)."""
    text_lower = text.lower()
    return [kw for kw in keywords if kw in text_lower][:6]


# ─── Specificity Score ────────────────────────────────────────────────────────

def get_specificity_score(text: str) -> Dict[str, Any]:
    """How concrete/specific is the narrative? Numbers, names, dates."""
    matches = []
    for pattern in SPECIFICITY_SIGNALS:
        found = re.findall(pattern, text, re.IGNORECASE)
        matches.extend(found[:2])

    score = min(100, len(matches) * 12)
    return {
        "score": score,
        "matches": matches[:8],
        "explanation": (
            f"Found {len(matches)} specific references (numbers, scale, results)."
            if matches else "Essay lacks specific evidence — consider adding numbers or concrete outcomes."
        )
    }


# ─── Full Feature Vector ──────────────────────────────────────────────────────

def extract_all_features(candidate: dict) -> Dict[str, Any]:
    """Extract complete feature vector from a candidate dict."""
    essay = candidate.get("essay", "")
    experience = candidate.get("experience", [])
    achievements = candidate.get("achievements", [])

    experience_text = " ".join(experience) if isinstance(experience, list) else str(experience)
    combined_text = essay + " " + experience_text

    readability = get_readability_features(essay)
    vocab = get_vocabulary_features(essay)
    burstiness = get_burstiness_features(essay)
    ai_detection = get_ai_detection_features(essay)
    specificity = get_specificity_score(essay)

    return {
        "readability": readability,
        "vocabulary": vocab,
        "burstiness": burstiness,
        "ai_detection": ai_detection,
        "specificity": specificity,
        "leadership_keyword_density": count_keyword_hits(combined_text, LEADERSHIP_KEYWORDS),
        "motivation_keyword_density": count_keyword_hits(essay, MOTIVATION_KEYWORDS),
        "growth_keyword_density": count_keyword_hits(essay, GROWTH_KEYWORDS),
        "leadership_matched": get_matched_keywords(combined_text, LEADERSHIP_KEYWORDS),
        "motivation_matched": get_matched_keywords(essay, MOTIVATION_KEYWORDS),
        "growth_matched": get_matched_keywords(essay, GROWTH_KEYWORDS),
        "experience_count": len(experience) if isinstance(experience, list) else 0,
        "achievement_count": len(achievements) if isinstance(achievements, list) else 0,
        "has_video": bool(candidate.get("videoStatement", False)),
        "references_count": int(candidate.get("references", 0)),
        "language_count": len(candidate.get("languages", [])),
    }
