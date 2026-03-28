# aggregator.py

import numpy as np
from scipy.spatial.distance import cosine
from typing import List, Dict

# HACKATHON-GRADE FORMULA WEIGHTS
W_FINAL_SEMANTIC = 0.4
W_FINAL_KEYWORD = 0.2
W_FINAL_FEATURE = 0.2
W_FINAL_CONSISTENCY = 0.2

def calculate_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    if not vec1 or not vec2: return 0.0
    try:
        return 1.0 - float(cosine(vec1, vec2))
    except:
        return 0.0

def get_consistency_status(sim: float) -> str:
    if sim > 0.82: return "aligned"
    if sim > 0.60: return "partial"
    return "inconsistent"

def get_unique_evidence(evidence_list: List[str], max_items: int = 5) -> List[str]:
    seen = set()
    unique = []
    for item in evidence_list:
        if item not in seen:
            unique.append(item)
            seen.add(item)
        if len(unique) >= max_items:
            break
    return unique

def aggregate_production_results(reports: List[Dict]) -> Dict:
    """Final calibrated aggregate analysis."""
    if not reports:
        return {"final_score": 30.0, "recommendation": "Data missing", "human_review_required": True}

    candidate_id = reports[0].get("candidate_id", "Unknown")
    
    # 1. Data Collection
    semantic_map = {}
    keyword_map = {}
    feature_map = {}
    all_evidence = []
    centroids = {}
    
    for report in reports:
        stype = report.get("source_type")
        centroids[stype] = report.get("semantic_centroid", [])
        
        for dim, res in report.get("dimensions", {}).items():
            if dim not in semantic_map:
                semantic_map[dim] = []
                keyword_map[dim] = []
                feature_map[dim] = []
            
            semantic_map[dim].append(res["semantic"])
            keyword_map[dim].append(res["keyword"])
            feature_map[dim].append(res["feature"])
            all_evidence.extend(res["evidence"])

    # 2. Consistency Module (Neutral Missing Data)
    pairs = [("essay_letter", "video_interview"), ("essay_letter", "interview_document"), ("video_interview", "interview_document")]
    sim_scores = []
    pair_labels = {
        "essay_letter_vs_video_interview": "essay_vs_video",
        "essay_letter_vs_interview_document": "essay_vs_interview",
        "video_interview_vs_interview_document": "video_vs_interview"
    }
    
    consistency_block = {}
    available_pairs = 0
    for s1, s2 in pairs:
        label = pair_labels.get(f"{s1}_vs_{s2}")
        if s1 in centroids and s2 in centroids and len(centroids[s1]) > 0 and len(centroids[s2]) > 0:
            sim = calculate_cosine_similarity(centroids[s1], centroids[s2])
            sim_scores.append(sim)
            consistency_block[label] = get_consistency_status(sim)
            available_pairs += 1
        else:
            consistency_block[label] = "data_missing"
            
    # NEUTRAL CALIBRATION
    if available_pairs == 0:
        avg_cons = 0.85
        consistency_block["flag"] = False
        consistency_block["reason"] = "Standard baseline applied (Single source)."
    elif available_pairs == 1:
        # If only one pair, don't drop consistency too low (min 0.55)
        raw_sim = float(np.mean(sim_scores))
        avg_cons = max(0.55, raw_sim)
        consistency_block["flag"] = bool(raw_sim < 0.6)
        consistency_block["reason"] = "Possible source contradiction." if consistency_block["flag"] else "Available source alignment."
    else:
        avg_cons = float(np.mean(sim_scores))
        consistency_block["flag"] = bool(avg_cons < 0.6)
        consistency_block["reason"] = "Multiple source contradictions detected." if consistency_block["flag"] else "Strong cross-source alignment."

    consistency_block["score"] = round(avg_cons, 2)

    # 3. Authenticity Module (Softer & Boosted)
    avg_specificity = float(np.mean([r["features"]["specificity_index"] for r in reports]))
    has_action_verbs = any(len(r["features"].get("action_verbs", [])) > 2 for r in reports)
    
    auth_score = (avg_cons * 100 * 0.4) + (avg_specificity * 100 * 0.5)
    if has_action_verbs: auth_score += 10 
    
    auth_score = max(35.0, min(98.0, auth_score)) 
    
    auth_flag = "low risk"
    if auth_score < 45: auth_flag = "high risk"
    elif auth_score < 65: auth_flag = "medium risk"
    
    authenticity_block = {
        "score": round(auth_score, 1),
        "flag": auth_flag,
        "reason": "Authentic content detected." if auth_score >= 65 else "Moderate use of generic patterns."
    }

    # 4. Balanced Scoring (40/20/20/20)
    avg_sem = float(np.mean([s for scores in semantic_map.values() for s in scores]))
    avg_kw = max(float(np.mean([s for scores in keyword_map.values() for s in scores])), 40)
    avg_feat = float(np.mean([s for scores in feature_map.values() for s in scores]))
    
    base_score = (avg_sem * W_FINAL_SEMANTIC + 
                  avg_kw * W_FINAL_KEYWORD + 
                  avg_feat * W_FINAL_FEATURE + 
                  avg_cons * 100 * W_FINAL_CONSISTENCY)
    
    # Softer Penalties
    auth_penalty = (100 - auth_score) * 0.08
    cons_penalty = (100 - avg_cons * 100) * 0.1 if available_pairs > 0 else 0.0
    
    total_score = base_score - (auth_penalty + cons_penalty)
    # Ensure reasonable candidates stay above 50
    final_score = float(max(50.0, min(100.0, total_score))) if not consistency_block["flag"] and auth_flag != "high risk" else float(max(30.0, min(100.0, total_score)))

    # 5. Dimension Breakdown
    dim_scores = {}
    for dim in semantic_map.keys():
        s = float(np.mean(semantic_map[dim]))
        k = max(float(np.mean(keyword_map[dim])), 40)
        f = float(np.mean(feature_map[dim]))
        d_raw = (s * W_FINAL_SEMANTIC + k * W_FINAL_KEYWORD + f * W_FINAL_FEATURE + avg_cons * 100 * W_FINAL_CONSISTENCY)
        dim_scores[dim] = round(d_raw - (auth_penalty + cons_penalty)/len(semantic_map), 1)

    ranked_dimensions = sorted(dim_scores.items(), key=lambda x: x[1], reverse=True)
    strengths = [d for d, s in ranked_dimensions[:2]]
    weaknesses = [d for d, s in ranked_dimensions[-2:]]

    # 6. Recommendation
    recommendation = "Strong shortlist" if final_score >= 75 else "Consider" if final_score >= 54 else "Needs review"

    # 7. JSON Assembly
    return {
        "candidate_id": candidate_id,
        "final_score": round(final_score, 1),
        "recommendation": recommendation,
        "dimension_scores": dim_scores,
        "semantic_scores": {d: round(float(np.mean(v)), 1) for d, v in semantic_map.items()},
        "consistency": consistency_block,
        "authenticity": authenticity_block,
        "keyword_score": round(avg_kw, 1),
        "semantic_score": round(avg_sem, 1),
        "feature_score": round(avg_feat, 1),
        "consistency_score": round(avg_cons * 100, 1),
        "key_strengths": strengths,
        "key_weaknesses": weaknesses,
        "risk_flags": [f for f, v in [("SOURCE_CONFLICT", consistency_block["flag"]), ("AUTHENTICITY_WARNING", auth_flag == "high risk")] if v],
        "human_review_required": bool(final_score < 54 or consistency_block["flag"]),
        "review_reason": f"Review required: {'Contradiction detected' if consistency_block['flag'] else 'Borderline score'}.",
        "evidence": get_unique_evidence(all_evidence, max_items=5),
        "explanation": (
            f"Candidate evaluation yielded a composite score of {round(final_score, 1)}. "
            f"Strongest area is {strengths[0]}, while {weaknesses[0]} is the primary growth opportunity. "
            f"{'Note: Discrepancies between sources were found.' if consistency_block['flag'] else 'Source data is consistent.'} "
            f"Human review recommended for final sign-off."
        ),
        "validation_note": "The system is evaluated on a synthetic dataset with manually defined rubric scores."
    }
