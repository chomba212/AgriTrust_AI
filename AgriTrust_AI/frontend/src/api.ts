import { Farmer, FarmerDetails, Scorecard, RecommendationResponse } from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000/api'

export async function fetchFarmers(): Promise<Farmer[]> {
  const response = await fetch(`${API_BASE}/farmers`)
  if (!response.ok) {
    throw new Error('Unable to load farmers')
  }
  return response.json()
}

export async function fetchScorecard(): Promise<Scorecard> {
  const response = await fetch(`${API_BASE}/scorecard`)
  if (!response.ok) {
    throw new Error('Unable to load scorecard')
  }
  return response.json()
}

export async function fetchFarmerDetails(id: number): Promise<FarmerDetails> {
  const response = await fetch(`${API_BASE}/farmers/${id}`)
  if (!response.ok) {
    throw new Error('Farmer not found')
  }
  return response.json()
}

export async function fetchRecommendations(farmerId: number): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ farmerId })
  })
  if (!response.ok) {
    throw new Error('Unable to load recommendations')
  }
  return response.json()
}
