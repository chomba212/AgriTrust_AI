
export interface Farmer {
  id: number
  name: string
  location: string
  primary_crop: string
  cooperative: string
  loan_status: string
  credit_readiness: string
  trust_score: number
  climate_risk: 'Low' | 'Moderate' | 'High'
  profile: string
}

export interface ScoreBreakdown {
  label: string
  value: number
  weight: number
}

export interface Explainability {
  narrative: string
  drivers: string[]
  evidence: string[]
}

export interface FarmerDetails extends Farmer {
  trust_category: 'Strong' | 'Developing' | 'Needs Improvement'
  human_review_required: boolean
  mobile_money_trend: string
  repayment_history: string[]
  climate_exposure: string[]
  graph_insights: string[]
  recommendations: string[]
  next_steps: string[]
  explainability: Explainability
  score_breakdown: ScoreBreakdown[]
}


// Scorecard


export interface ClimateEvent {
  type: string
  season: string
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
  loan_flow_change: string
  climate_events: ClimateEvent[]
  weather_alerts: number
  regional_risk: string
  recommended_actions: string[]
}


// Masumi — service request


export interface ServiceRequest {
  job_id: string
  agent_id: string
  farmer_id: number
  status: 'awaiting_payment'
  escrow: {
    note: string
    amount: string
    network: string
    instructions: string
  }
  masumi_explorer: string
}


// Masumi — recommendation response


export interface MasumiAudit {
  status: 'verified'
  audit_id: string
  escrow_tx: string
  agent_id: string
  timestamp: string
  explorer: string
}

export interface RecommendationResponse {
  farmer_id: number
  trust_score: number
  trust_category: 'Strong' | 'Developing' | 'Needs Improvement'
  human_review_required: boolean
  score_breakdown: ScoreBreakdown[]
  recommendations: string[]
  next_steps: string[]
  explainability: Explainability
  agent_limits: string[]
  masumi_audit: MasumiAudit
}


// Masumi — agent info


export interface AgentInfo {
  agent_id: string
  version: string
  name: string
  description: string
  capabilities: string[]
  inputs: string[]
  outputs: string[]
  limits: string[]
  payment: {
    network: string
    token: string
    per_call: string
  }
  masumi_docs: string
}


// Masumi — audit log


export interface AuditEntry {
  audit_id: string
  timestamp: string
  agent_id: string
  farmer_id: number
  escrow_tx: string
  trust_score: number
  trust_category: string
  human_review_required: boolean
}

export interface AuditLog {
  agent_id: string
  total_calls: number
  entries: AuditEntry[]
}