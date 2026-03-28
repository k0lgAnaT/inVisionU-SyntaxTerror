# text_utils.py

import re
import textstat
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk import pos_tag
from collections import Counter
import nltk
from sentence_transformers import SentenceTransformer, util
import torch

# Ensure NLTK data is available
for res in ['tokenizers/punkt', 'tokenizers/punkt_tab', 'taggers/averaged_perceptron_tagger', 'taggers/averaged_perceptron_tagger_eng']:
    try:
        nltk.data.find(res)
    except LookupError:
        try:
            nltk.download(res.split('/')[-1])
        except:
            pass

_model = None

def get_model():
    global _model
    if _model is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        _model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2', device=device)
    return _model

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-zA-Zа-яА-ЯёЁәіңғүұқөһӘІҢҒҮҰҚӨҺ0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def split_sentences(text: str) -> list[str]:
    try:
        return sent_tokenize(text)
    except:
        raw_sentences = re.split(r"[.!?]+", text)
        return [s.strip() for s in raw_sentences if s.strip()]

def get_linguistic_features(text: str) -> dict:
    """Extracts advanced features: action verbs, complexity, length."""
    if not text:
        return {"action_verbs": [], "complexity": 0, "length": 0, "specificity": 0}
    
    words = word_tokenize(text)
    tags = pos_tag(words)
    
    # Action verbs (Eng) - VB, VBD, VBG, VBP, VBZ
    # For RU, we would need a different pos_tagger (like pymorphy2), but let's stick to Eng/Universal heuristics for now
    action_verbs = [word for word, tag in tags if tag.startswith('VB') and len(word) > 2]
    
    # Specificity Heuristic: Ratio of Nouns/Verbs to total words
    meaningful_tags = {'NN', 'NNS', 'NNP', 'NNPS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'}
    specificity = len([word for word, tag in tags if tag in meaningful_tags]) / len(words) if words else 0
    
    return {
        "action_verbs": list(set(action_verbs))[:10],
        "sentence_complexity": textstat.sentence_count(text) / (len(words)/15 + 1), # density
        "readability_score": textstat.flesch_reading_ease(text),
        "specificity_index": round(specificity, 2),
        "word_count": len(words)
    }

def get_semantic_embedding(text: str):
    model = get_model()
    return model.encode(text, convert_to_tensor=True)

def calculate_semantic_similarity(text: str, criteria: str) -> float:
    if not text or not criteria:
        return 0.0
    emb1 = get_semantic_embedding(text)
    emb2 = get_semantic_embedding(criteria)
    similarity = util.cos_sim(emb1, emb2)
    return float(similarity[0][0])

def extract_dynamic_keywords(text: str, top_n: int = 10) -> list[tuple[str, int]]:
    normalized = normalize_text(text)
    words = normalized.split()
    stop_words = {"the", "and", "to", "in", "is", "of", "it", "with", "for", "on", "a", "an", "и", "в", "не", "что", "он", "на", "я", "с", "как", "а", "то"}
    filtered_words = [w for w in words if w not in stop_words and len(w) > 3]
    return Counter(filtered_words).most_common(top_n)