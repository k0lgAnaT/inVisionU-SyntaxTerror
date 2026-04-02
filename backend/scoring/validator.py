"""
inVision U — Model Validation & Metrics
=========================================
Cross-validation and statistical comparison between:
  - Advanced NLP Model (our system)
  - Baseline Rule-Based Model

Metrics:
  - Spearman rank correlation (between models)
  - Score distribution statistics
  - Per-dimension reliability
  - Error analysis (cases where models disagree most)
  
No ground truth labels are available (unsupervised setting).
We validate internal consistency and rank stability instead.
"""

import math
from typing import List, Dict, Any


def spearman_correlation(ranks_a: List[float], ranks_b: List[float]) -> float:
    """Compute Spearman rank correlation coefficient."""
    n = len(ranks_a)
    if n < 3:
        return 0.0
    d_sq_sum = sum((a - b) ** 2 for a, b in zip(ranks_a, ranks_b))
    rho = 1 - (6 * d_sq_sum) / (n * (n ** 2 - 1))
    return round(rho, 4)


def compute_score_statistics(scores: List[float]) -> Dict[str, float]:
    """Descriptive statistics for a score distribution."""
    n = len(scores)
    if n == 0:
        return {}
    mean = sum(scores) / n
    variance = sum((s - mean) ** 2 for s in scores) / n
    std = math.sqrt(variance)
    sorted_s = sorted(scores)
    median = sorted_s[n // 2] if n % 2 == 1 else (sorted_s[n // 2 - 1] + sorted_s[n // 2]) / 2
    return {
        "mean": round(mean, 2),
        "median": round(median, 2),
        "std": round(std, 2),
        "min": round(min(scores), 2),
        "max": round(max(scores), 2),
        "range": round(max(scores) - min(scores), 2),
    }


def rank_scores(scores: List[float]) -> List[float]:
    """Convert scores to ranks (1 = highest)."""
    indexed = sorted(enumerate(scores), key=lambda x: -x[1])
    ranks = [0.0] * len(scores)
    for rank, (orig_idx, _) in enumerate(indexed, 1):
        ranks[orig_idx] = float(rank)
    return ranks


def compute_agreement_rate(
    advanced_recs: List[str],
    baseline_scores: List[float],
    threshold: float = 50.0
) -> float:
    """
    What fraction of the time do advanced and baseline agree
    on accept/reject (above/below threshold)?
    """
    if not advanced_recs:
        return 0.0
    advanced_accept = [r in ("STRONG_YES", "YES") for r in advanced_recs]
    baseline_accept = [s >= threshold for s in baseline_scores]
    matches = sum(a == b for a, b in zip(advanced_accept, baseline_accept))
    return round(matches / len(advanced_recs), 4)


def identify_edge_cases(scored_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Find candidates where advanced model disagrees most with baseline.
    These are the most interesting cases for review.
    """
    edge_cases = []
    for r in scored_results:
        adv = r.get("totalScore", 50)
        base = r.get("baseline", {}).get("total_score", 50)
        diff = abs(adv - base)
        if diff >= 18:
            edge_cases.append({
                "candidate_name": r.get("candidate", {}).get("name", "Unknown"),
                "advanced_score": adv,
                "baseline_score": base,
                "difference": diff,
                "advanced_rec": r.get("shortlistRecommendation", "?"),
                "direction": "advanced_higher" if adv > base else "baseline_higher",
                "likely_reason": (
                    "Strong NLP signals (leadership/growth language) not reflected in simple rules"
                    if adv > base else
                    "High GPA/achievement count not matching essay quality"
                ),
            })
    return sorted(edge_cases, key=lambda x: x["difference"], reverse=True)


def run_validation(scored_results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Full validation report comparing advanced vs baseline.
    """
    advanced_scores = [r["totalScore"] for r in scored_results]
    baseline_scores = [r.get("baseline", {}).get("total_score", 50) for r in scored_results]
    advanced_recs   = [r.get("shortlistRecommendation", "MAYBE") for r in scored_results]

    # Rankings
    adv_ranks  = rank_scores(advanced_scores)
    base_ranks = rank_scores(baseline_scores)
    rho = spearman_correlation(adv_ranks, base_ranks)

    # Agreement
    agreement = compute_agreement_rate(advanced_recs, baseline_scores)

    # Per-dimension stats
    dim_stats = {}
    for dim in ["leadership", "motivation", "growth", "communication", "growthVelocity"]:
        dim_scores = [r["scores"][dim]["score"] for r in scored_results if dim in r.get("scores", {})]
        dim_stats[dim] = compute_score_statistics(dim_scores)

    # Score distribution
    adv_stats  = compute_score_statistics(advanced_scores)
    base_stats = compute_score_statistics(baseline_scores)

    # Edge cases
    edge_cases = identify_edge_cases(scored_results)

    # Recommendation distribution
    rec_distribution = {}
    for r in advanced_recs:
        rec_distribution[r] = rec_distribution.get(r, 0) + 1

    return {
        "model_comparison": {
            "spearman_correlation": rho,
            "interpretation": (
                "Strong rank agreement" if rho >= 0.7 else
                "Moderate rank agreement" if rho >= 0.4 else
                "Low rank agreement — models diverge significantly"
            ),
            "accept_reject_agreement": agreement,
            "advanced_stats": adv_stats,
            "baseline_stats": base_stats,
        },
        "dimension_statistics": dim_stats,
        "recommendation_distribution": rec_distribution,
        "edge_cases": edge_cases[:5],
        "total_candidates": len(scored_results),
        "shortlisted_count": sum(1 for r in advanced_recs if r in ("STRONG_YES", "YES")),
        "ai_flagged_count": sum(
            1 for r in scored_results
            if r.get("scores", {}).get("aiSuspicion", {}).get("score", 0) >= 40
        ),
    }
