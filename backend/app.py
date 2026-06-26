
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
 
@app.route("/api/agent", methods=["GET"])
def agent_info():
        """
    Masumi discovery endpoint.
    Describes what this agent does, its pricing, and input/output contract.
    Register the URL of this endpoint when listing the agent on the network.
    """
    return jsonify({
        "agent_id":      AGENT_ID,
        "version":       AGENT_VERSION,
        "name":          "AgriTrust Scoring Agent",
        "description":   (
            "Assesses smallholder farmer creditworthiness for Kenyan "
            "agricultural lenders. Produces a trust score, risk flags, "
            "and a recommendation memo for human loan-officer review."
        ),
        "capabilities": [
            "trust_scoring",
            "climate_risk_overlay",
            "repayment_analysis",
            "cooperative_verification",
            "recommendation_memo",
        ],
        "inputs":  ["farmer_id"],
        "outputs": ["trust_score", "trust_category", "score_breakdown",
                    "recommendations", "next_steps", "explainability",
                    "human_review_required"],
        "limits": [
            "Does not make final loan approval or denial decisions.",
            "Requires human loan-officer review for scores 60–84.",
            "Cannot access live bank records; uses mobile-money proxy data.",
            "Climate data is regional, not field-level.",
        ],
        "payment": {
            "network": "Masumi",
            "token":   "ADA",
            "per_call": "0.5 ADA",
        },
        "masumi_docs": "https://docs.masumi.network/",
    })


@app.route("/api/service-request", methods=["POST"])
def service_request():
    """
    Step 1 of the Masumi payment flow.
    Buyer calls this to declare intent; receives a job_id and escrow
    instructions to submit on-chain before the agent does any work.
 
    In a full Masumi integration this endpoint would:
      1. Call the Masumi node to create an escrow contract.
      2. Return the contract address and amount for the buyer to fund.
      3. Watch for on-chain confirmation before releasing the result.
 
    Marked as MOCKED — replace with real Masumi SDK call for testnet.
    """
    payload = request.get_json(silent=True) or {}
    farmer_id = payload.get("farmer_id")
 
    if not farmer_id:
        return jsonify({"error": "farmer_id is required"}), 400
 
    farmer = next((f for f in farmers if f["id"] == farmer_id), None)
    if not farmer:
        return jsonify({"error": f"Farmer {farmer_id} not found"}), 404
 
    job_id = str(uuid.uuid4())
 
    return jsonify({
        "job_id":       job_id,
        "agent_id":     AGENT_ID,
        "farmer_id":    farmer_id,
        "status":       "awaiting_payment",
        "escrow": {
            "note":    "MOCKED — replace with live Masumi escrow call",
            "amount":  "0.5 ADA",
            "network": "preprod",
            "instructions": (
                "Fund the escrow contract on-chain, then call "
                "POST /api/recommendations with the transaction ID "
                "in the X-Masumi-Escrow-Tx header."
            ),
        },
        "masumi_explorer": "https://www.masumi.network/explorer",
    }), 202



