
import uuid
from datetime import datetime, timezone
 
from flask import Flask, jsonify, request
from flask_cors import CORS
 
from data.mock_data import farmers, applications, climate_data
 

app = Flask(__name__)
CORS(app)
 

AGENT_ID = "urn:masumi:agent:agritrust-scoring-v1"
AGENT_VERSION = "1.0.0"
 
audit_log = []
 

SCORE_WEIGHTS = {
    "mobile_money": 0.25,
    "coop_trust":   0.25,
    "repayment":    0.35,
    "farm_data":    0.15,
}
 
CLIMATE_PENALTY = {"Low": 0, "Moderate": -3, "High": -6}
 
 
def compute_trust_score(farmer: dict) -> int:
    """
    Weighted trust score (0–100) with a climate-risk penalty applied.
    Clamped to [40, 98] so no farmer scores impossibly low or high.
    """
    raw = sum(
        farmer["scores"][key] * weight
        for key, weight in SCORE_WEIGHTS.items()
    )
    penalty = CLIMATE_PENALTY.get(farmer["climate_risk"], 0)
    return max(40, min(98, round(raw + penalty)))
 
 
def trust_category(score: int) -> str:
    if score >= 85:
        return "Strong"
    if score >= 70:
        return "Developing"
    return "Needs Improvement"
 
 
def human_review_required(score: int) -> bool:
    """
    Loan officers must review borderline cases (60–84).
    The agent never makes a final approve/decline decision.
    """
    return 60 <= score < 85
 
 
def score_breakdown(farmer: dict) -> list:
    return [
        {"label": "Mobile Money",     "value": farmer["scores"]["mobile_money"], "weight": 25},
        {"label": "Cooperative Trust","value": farmer["scores"]["coop_trust"],   "weight": 25},
        {"label": "Repayment",        "value": farmer["scores"]["repayment"],    "weight": 35},
        {"label": "Farm Data",        "value": farmer["scores"]["farm_data"],    "weight": 15},
    ]
 
#  serializer

def serialize_farmer_summary(farmer: dict) -> dict:
    return {
        "id":              farmer["id"],
        "name":            farmer["name"],
        "location":        farmer["location"],
        "primary_crop":    farmer["primary_crop"],
        "cooperative":     farmer["cooperative"],
        "loan_status":     farmer["loan_status"],
        "credit_readiness":farmer["credit_readiness"],
        "trust_score":     compute_trust_score(farmer),
        "climate_risk":    farmer["climate_risk"],
        "profile":         farmer["profile"],
    }
 
 
def serialize_farmer_detail(farmer: dict) -> dict:
    score = compute_trust_score(farmer)
    return {
        "id":               farmer["id"],
        "name":             farmer["name"],
        "location":         farmer["location"],
        "primary_crop":     farmer["primary_crop"],
        "cooperative":      farmer["cooperative"],
        "loan_status":      farmer["loan_status"],
        "credit_readiness": farmer["credit_readiness"],
        "trust_score":      score,
        "trust_category":   trust_category(score),
        "human_review_required": human_review_required(score),
        "climate_risk":     farmer["climate_risk"],
        "profile":          farmer["profile"],
        "mobile_money_trend":  farmer["mobile_money_trend"],
        "repayment_history":   farmer["repayment_history"],
        "climate_exposure":    farmer["climate_exposure"],
        "graph_insights":      farmer["graph_insights"],
        "recommendations":     farmer["recommendations"],
        "next_steps":          farmer["next_steps"],
        "explainability":      farmer["explainability"],
        "score_breakdown":     score_breakdown(farmer),
    }
 


