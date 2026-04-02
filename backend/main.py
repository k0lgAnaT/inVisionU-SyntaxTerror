"""
inVision U — FastAPI Backend
============================
Python NLP scoring engine served as REST API.

Endpoints:
  GET  /health                      - Health check
  POST /score                       - Score single candidate
  POST /score/batch                 - Score multiple candidates
  GET  /candidates                  - Get all demo candidates (pre-scored)
  GET  /candidates/{id}             - Get single demo candidate (pre-scored)
  GET  /validation                  - Model validation report (advanced vs baseline)
  GET  /baseline/{id}               - Baseline score for a candidate
"""

import json
import os
import sys
from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add current dir to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from scoring.engine import score_candidate_advanced, score_all_candidates
from scoring.baseline import score_baseline
from scoring.validator import run_validation

# ─── Load Demo Candidates ──────────────────────────────────────────────────────

DATA_PATH = Path(__file__).parent.parent / "src" / "data" / "candidates.json"

def load_candidates():
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

DEMO_CANDIDATES = load_candidates()

# ─── FastAPI App ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="inVision U — AI Scoring Engine",
    description="Python NLP backend for candidate scoring. Explainable, fair, human-in-the-loop.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In prod: restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Pydantic Models ───────────────────────────────────────────────────────────

class CandidateInput(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., min_length=1)
    age: int = Field(default=18, ge=14, le=35)
    city: str = Field(default="Unknown")
    school: str = Field(default="Unknown")
    gpa: float = Field(default=3.0, ge=0.0, le=5.0)
    submittedAt: str = Field(default="2024-12-01")
    essay: str = Field(..., min_length=10)
    experience: List[str] = Field(default=[])
    achievements: List[str] = Field(default=[])
    languages: List[str] = Field(default=[])
    socialLinks: dict = Field(default={})
    videoStatement: bool = Field(default=False)
    references: int = Field(default=1, ge=0, le=10)
    extracurricular: str = Field(default="")

    model_config = {"extra": "allow"}


class BatchScoreRequest(BaseModel):
    candidates: List[CandidateInput]
    profile: str = "default"


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "inVision U AI Scoring Engine",
        "version": "1.0.0",
        "candidates_loaded": len(DEMO_CANDIDATES),
        "textstat_available": _check_textstat(),
    }


def _check_textstat():
    try:
        import textstat
        return True
    except ImportError:
        return False


@app.get("/candidates")
def get_all_candidates(profile: str = Query(default="default")):
    """Return all demo candidates scored with the advanced model."""
    if not DEMO_CANDIDATES:
        raise HTTPException(status_code=500, detail="Demo data not found")
    results = score_all_candidates(DEMO_CANDIDATES, profile)
    return {"success": True, "data": results, "count": len(results)}


@app.get("/candidates/{candidate_id}")
def get_candidate(candidate_id: str, profile: str = Query(default="default")):
    """Return a single demo candidate scored."""
    candidate = next((c for c in DEMO_CANDIDATES if c.get("id") == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Candidate '{candidate_id}' not found")
    result = score_candidate_advanced(candidate, profile)
    return {"success": True, "data": result}


@app.post("/score")
def score_single(candidate: CandidateInput, profile: str = Query(default="default")):
    """Score a single candidate with the advanced NLP model."""
    cand_dict = candidate.model_dump()
    if not cand_dict.get("id"):
        import time, random, string
        cand_dict["id"] = f"live-{int(time.time())}-{''.join(random.choices(string.ascii_lowercase, k=5))}"
    result = score_candidate_advanced(cand_dict, profile)
    return {"success": True, "data": result}


@app.post("/score/batch")
def score_batch(req: BatchScoreRequest):
    """Score multiple candidates and return ranked results."""
    candidates = [c.model_dump() for c in req.candidates]
    import time, random, string
    for c in candidates:
        if not c.get("id"):
            c["id"] = f"batch-{int(time.time())}-{''.join(random.choices(string.ascii_lowercase, k=4))}"
    results = score_all_candidates(candidates, req.profile)
    return {"success": True, "data": results, "count": len(results)}


@app.get("/validation")
def get_validation(profile: str = Query(default="default")):
    """
    Model validation report — compare advanced NLP vs baseline rule-based.
    Returns Spearman correlation, edge cases, score distributions.
    """
    if not DEMO_CANDIDATES:
        raise HTTPException(status_code=500, detail="Demo data not found")
    scored = score_all_candidates(DEMO_CANDIDATES, profile)
    report = run_validation(scored)
    return {"success": True, "data": report}


@app.get("/baseline/{candidate_id}")
def get_baseline(candidate_id: str):
    """Get baseline (simple rule-based) score for a demo candidate."""
    candidate = next((c for c in DEMO_CANDIDATES if c.get("id") == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    result = score_baseline(candidate)
    return {"success": True, "data": result, "candidate_id": candidate_id}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
