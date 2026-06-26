export interface TrustFactor {
  label: string
  value: number
  weight: number
}

export interface Explainability {
  narrative: string
  drivers: string[]
  evidence: string[]
}

export interface Farmer {
  id: number
  name: string
  location: string
  primary_crop: string
  cooperative: string
  loan_status: string
  credit_readiness: string
  trust_score: number
  climate_risk: string
  profile: string
}

export interface FarmerDetails extends Farmer {
  trust_category: string
  mobile_money_trend: string
  repayment_history: Array<{ year: number; status: string; amount: number }>
  climate_exposure: string[]
  graph_insights: string[]
  recommendations: string[]
  next_steps: string[]
  explainability: Explainability
  score_breakdown: TrustFactor[]
}

export interface Scorecard {
  farmer_count: number
  average_trust_score: number
  trust_distribution: {
    strong: number
    developing: number
    needs_improvement: number
  }
  approved_loans: number
  pending_loans: number
  declined_loans: number
  climate_events: Array<{ type: string; season: string; severity: string }>
  weather_alerts: number
  regional_risk: string
  recommended_actions: string[]
  loan_flow_change: string
}

export interface RecommendationResponse {
  farmerId: number
  recommendations: string[]
  next_steps: string[]
  explainability: Explainability
}
