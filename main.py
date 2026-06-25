import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from database import db

app = FastAPI(
    title="AgriTrust AI Engine API",
    description="Live Microservice powering Graph Feature Extraction and Explainable AI Decisioning.",
    version="1.2.0"
)

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your exact frontend URL
    allow_credentials=True,
    allow_methods=["*"], # Allows all standard methods like POST, GET, OPTIONS
    allow_headers=["*"],
)

# Initialize the Gemini Client
ai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class ScoringRequest(BaseModel):
    farmer_id: str


def calculate_graph_trust_score(metrics: dict) -> float:
    mm_factor = metrics.get("mm_consistency", 0.5)
    coop_repayment = metrics.get("coop_repayment", 0.5) or 0.5
    coop_compliance = metrics.get("coop_compliance", 0.5) or 0.5
    climate_risk = metrics.get("climate_risk", "MEDIUM")
    
    # New supplier metrics
    supplier_rating = metrics.get("avg_supplier_rating") or 3.0
    normalized_supplier_score = supplier_rating / 5.0 # Convert 5-star rating to a 0.0-1.0 scale
    
    climate_weights = {"LOW": 1.0, "MEDIUM": 0.6, "HIGH": 0.2}
    climate_factor = climate_weights.get(climate_risk, 0.6)
    
    # Upgraded Mathematical Framework
    # $Trust\ Score = (MM \times 300) + (Coop \times 200) + (Supplier \times 150) + (Climate \times 50) + 150$
    score = (mm_factor * 300) + (coop_compliance * 200) + (normalized_supplier_score * 150) + (climate_factor * 50) + 150
    return min(max(int(score), 300), 850)
def fetch_farmer_graph_profile(farmer_id: str) -> dict:
    """Queries the live cloud graph with robust local exception handling."""
    cypher_query = """
    MATCH (f:Farmer {id: $farmer_id})
    OPTIONAL MATCH (f)-[m:MEMBER_OF]->(c:Cooperative)
    OPTIONAL MATCH (f)-[:EXPOSED_TO]->(w:WeatherRisk)
    OPTIONAL MATCH (f)-[p:PURCHASED_FROM]->(s:Supplier)
    RETURN f.name AS name, f.status AS status, f.mobileMoneyConsistency AS mm_consistency,
           c.name AS coop_name, c.repaymentRate AS coop_repayment, m.complianceScore AS coop_compliance,
           w.riskLevel AS climate_risk,
           avg(s.rating) AS avg_supplier_rating, count(p) AS total_purchases
    """
    try:
        records = db.query(cypher_query, {"farmer_id": farmer_id})
    except Exception as db_error:
        raise HTTPException(
            status_code=500, 
            detail=f"Database Connectivity Error: {str(db_error)}. Verify your credentials and cloud instance status."
        )

    if not records or not records[0].get("name"):
        raise HTTPException(
            status_code=404, 
            detail=f"Farmer profile '{farmer_id}' could not be resolved in the seeded graph database."
        )
    return records[0]

@app.post("/api/v1/score")
def generate_trust_score(request: ScoringRequest):
    profile = fetch_farmer_graph_profile(request.farmer_id)
    score = calculate_graph_trust_score(profile)
    risk_category = "HIGH_RISK" if score < 550 else "MEDIUM_RISK" if score < 700 else "LOW_RISK"
    
    return {
        "farmer_id": request.farmer_id,
        "farmer_name": profile["name"],
        "calculated_trust_score": score,
        "risk_classification": risk_category,
        "graph_telemetry": {
            "mobile_money_consistency": profile["mm_consistency"],
            "cooperative_standing": profile["coop_compliance"],
            "regional_climate_vulnerability": profile["climate_risk"]
        }
    }

@app.post("/api/v1/explain")
def explain_decision(request: ScoringRequest):
    profile = fetch_farmer_graph_profile(request.farmer_id)
    score = calculate_graph_trust_score(profile)
    
    prompt = f"""
    You are the Explainable AI underwriting component of AgriTrust AI. 
    Analyze this alternative data profile from our Neo4j graph database and formulate a structured credit assessment.
    
    FARMER PROFILE DETAILS:
    - Name: {profile['name']}
    - Status Tier: {profile['status']}
    - Trust Score Assigned: {score}/850
    - Mobile Money Financial Consistency: {profile['mm_consistency'] * 100}%
    - Connected Cooperative Sacco: {profile['coop_name']}
    - Personal Sacco Compliance Level: {profile['coop_compliance'] * 100}%
    - Regional Climate Vulnerability Level: {profile['climate_risk']}
    
    REQUIRED OUTPUT FORMAT:
    Provide a clear, brief, professional paragraph explaining why this score was assigned. Finish with a practical, one-sentence "Improvement Pathway" suggestion. Do not use markdown styling tags or formatting blocks.
    """
    try:
        response = ai_client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        return {
            "farmer_id": request.farmer_id,
            "farmer_name": profile["name"],
            "score": score,
            "explainable_ai_report": response.text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Explanation Engine experienced a generation error: {str(e)}")