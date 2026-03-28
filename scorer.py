# scorer.py

import numpy as np
from keyword_dataset import DIMENSIONS
from text_utils import (
    normalize_text, split_sentences, extract_dynamic_keywords, 
    calculate_semantic_similarity, get_semantic_embedding, get_linguistic_features
)
from sentence_transformers import util

# Weights for dimension-level hybrid calculation
W_DIM_SEMANTIC = 0.5
W_DIM_KEYWORD = 0.2
W_DIM_FEATURE = 0.3

def calculate_dimension_details(text: str, dimension_name: str, features: dict) -> dict:
    """Extracts granular scoring components for a specific dimension."""
    data = DIMENSIONS.get(dimension_name, {})
    keywords = data.get("keywords", [])
    description = data.get("description", "")
    
    # 1. Semantic Component (0-100)
    semantic_sim = calculate_semantic_similarity(text, description)
    sem_score = (max(0.0, float(semantic_sim)) ** 0.7) * 100 # Non-linear boost for demo
    sem_score = min(100.0, sem_score + 10) # Base alignment credit
    
    # 2. Keyword Component (0-100)
    normalized = normalize_text(text)
    hit_count = sum(normalized.count(normalize_text(kw)) for kw in keywords if kw)
    kw_score = max(min(hit_count / 10, 1.0) * 100, 40) # Normalized to min 40
    
    # 3. Linguistic Feature Component (0-100)
    # Heuristic: specificity + action verbs
    f_score = (features.get("specificity_index", 0) * 0.5 + 
               min(len(features.get("action_verbs", [])) / 5, 1.0) * 0.5) * 100
    
    # 4. Dimension Total Score (Internal)
    dim_total = (sem_score * W_DIM_SEMANTIC + kw_score * W_DIM_KEYWORD + f_score * W_DIM_FEATURE)
    
    # 5. Evidence Sentence Retrieval
    sentences = split_sentences(text)
    evidence = []
    desc_emb = get_semantic_embedding(description)
    for s in sentences:
        if len(s.split()) < 5: continue
        s_norm = normalize_text(s)
        # Keyword check
        contains_kw = any(normalize_text(kw) in s_norm for kw in keywords if kw)
        # Semantic check
        s_emb = get_semantic_embedding(s)
        sim = float(util.cos_sim(s_emb, desc_emb)[0][0])
        
        if contains_kw or sim > 0.45:
            evidence.append(s)
        if len(evidence) >= 2: break

    return {
        "score": round(dim_total, 1),
        "semantic": round(sem_score, 1),
        "keyword": round(kw_score, 1),
        "feature": round(f_score, 1),
        "evidence": evidence
    }

def process_source_report(candidate_id: str, source_type: str, text: str, loaded_files: list) -> dict:
    """Analyzes a source and provides granular component data."""
    features = get_linguistic_features(text)
    dimension_reports = {}
    
    for dim in DIMENSIONS.keys():
        dimension_reports[dim] = calculate_dimension_details(text, dim, features)
        
    centroid = get_semantic_embedding(text).tolist()
    
    return {
        "candidate_id": candidate_id,
        "source_type": source_type,
        "loaded_files": loaded_files,
        "dimensions": dimension_reports,
        "features": features,
        "semantic_centroid": centroid
    }