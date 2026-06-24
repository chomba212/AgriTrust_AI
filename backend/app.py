from flask import Flask, jsonify, request
from flask_cors import CORS

from data.mock_data import farmers, applications, climate_data

app = Flask(__name__)
CORS(app)


def compute_trust_score(farmer):
    weighted_score = (
        farmer["scores"]["mobile_money"] * 0.25
        + farmer["scores"]["coop_trust"] * 0.25
        + farmer["scores"]["repayment"] * 0.35
        + farmer["scores"]["farm_data"] * 0.15
    )
    climate_penalty = {"Low": 0, "Moderate": -3, "High": -6}.get(farmer["climate_risk"], 0)
    return max(40, min(98, round(weighted_score + climate_penalty)))


def trust_category(score):
    if score >= 85:
        return "Strong"
    if score >= 70:
        return "Developing"
    return "Needs Improvement"


def serialize_farmer_summary(farmer):
    return {
        "id": farmer["id"],
        "name": farmer["name"],
        "location": farmer["location"],
        "primary_crop": farmer["primary_crop"],
        "cooperative": farmer["cooperative"],
        "loan_status": farmer["loan_status"],
        "credit_readiness": farmer["credit_readiness"],
        "trust_score": compute_trust_score(farmer),
        "climate_risk": farmer["climate_risk"],
        "profile": farmer["profile"],
    }


def serialize_farmer_detail(farmer):
    score = compute_trust_score(farmer)
    return {
        "id": farmer["id"],
        "name": farmer["name"],
        "location": farmer["location"],
        "primary_crop": farmer["primary_crop"],
        "cooperative": farmer["cooperative"],
        "loan_status": farmer["loan_status"],
        "credit_readiness": farmer["credit_readiness"],
        "trust_score": score,
        "trust_category": trust_category(score),
        "climate_risk": farmer["climate_risk"],
        "profile": farmer["profile"],
        "mobile_money_trend": farmer["mobile_money_trend"],
        "repayment_history": farmer["repayment_history"],
        "climate_exposure": farmer["climate_exposure"],
        "graph_insights": farmer["graph_insights"],
        "recommendations": farmer["recommendations"],
        "next_steps": farmer["next_steps"],
        "explainability": farmer["explainability"],
        "score_breakdown": [
            {"label": "Mobile Money", "value": farmer["scores"]["mobile_money"], "weight": 25},
            {"label": "Cooperative Trust", "value": farmer["scores"]["coop_trust"], "weight": 25},
            {"label": "Repayment", "value": farmer["scores"]["repayment"], "weight": 35},
            {"label": "Farm Data", "value": farmer["scores"]["farm_data"], "weight": 15}
        ]
    }


@app.route("/api/farmers", methods=["GET"])
def get_farmers():
    return jsonify([serialize_farmer_summary(f) for f in farmers])


@app.route("/api/farmers/<int:farmer_id>", methods=["GET"])
def get_farmer(farmer_id):
    farmer = next((f for f in farmers if f["id"] == farmer_id), None)
    if not farmer:
        return jsonify({"error": "Farmer not found"}), 404
    return jsonify(serialize_farmer_detail(farmer))


@app.route("/api/scorecard", methods=["GET"])
def get_scorecard():
    total = len(farmers)
    scores = [compute_trust_score(f) for f in farmers]
    distribution = {
        "strong": sum(1 for score in scores if score >= 85),
        "developing": sum(1 for score in scores if 70 <= score < 85),
        "needs_improvement": sum(1 for score in scores if score < 70),
    }
    return jsonify(
        {
            "farmer_count": total,
            "average_trust_score": round(sum(scores) / total),
            "trust_distribution": distribution,
            "approved_loans": applications["approved"],
            "pending_loans": applications["pending"],
            "declined_loans": applications["declined"],
            "climate_events": climate_data["climate_events"],
            "weather_alerts": climate_data["weather_alerts"],
            "regional_risk": climate_data["regional_risk"],
            "recommended_actions": climate_data["recommended_actions"],
            "loan_flow_change": applications["last_month_change"]
        }
    )


@app.route("/api/recommendations", methods=["POST"])
def recommend():
    payload = request.get_json() or {}
    farmer_id = payload.get("farmerId")
    farmer = next((f for f in farmers if f["id"] == farmer_id), None)
    if not farmer:
        return jsonify({"error": "Farmer not found"}), 404
    return jsonify(
        {
            "farmerId": farmer_id,
            "recommendations": farmer["recommendations"],
            "next_steps": farmer["next_steps"],
            "explainability": farmer["explainability"]
        }
    )


@app.route("/api/climate", methods=["GET"])
def get_climate():
    return jsonify(climate_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
