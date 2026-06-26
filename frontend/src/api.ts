/**
 * api.ts — AgriTrust frontend API client
 *
 * Masumi payment flow
 *   1. fetchServiceRequest(farmerId)  → creates escrow intent, returns job_id
 *   2. fetchRecommendations(farmerId) → calls service-request internally,
 *      then passes the job_id as X-Masumi-Escrow-Tx to /api/recommendations
 *
 * All other calls are simple GET requests to the Flask backend.
 */

import {
  Farmer,
  FarmerDetails,
  Scorecard,
  RecommendationResponse,
  ServiceRequest,
  AgentInfo,
  AuditLog,
} from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000/api'

// ---------------------------------------------------------------------------
// Shared fetch helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
      ...(options.headers as Record<string, string> | undefined),
    },
  })

  if (!response.ok) {
    // Surface the backend error message when available
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      if (body?.message) message = body.message
      else if (body?.error) message = body.error
    } catch {
      // ignore JSON parse error; keep the default message
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Agent discovery
// ---------------------------------------------------------------------------

/** Returns Masumi agent metadata: capabilities, limits, pricing, identity. */
export async function fetchAgentInfo(): Promise<AgentInfo> {
  return apiFetch<AgentInfo>('/agent')
}

// ---------------------------------------------------------------------------
// Farmers
// ---------------------------------------------------------------------------

/** Returns the summary list used in the farmer card grid. */
export async function fetchFarmers(): Promise<Farmer[]> {
  return apiFetch<Farmer[]>('/farmers')
}

/** Returns full detail for a single farmer, including score breakdown. */
export async function fetchFarmerDetails(id: number): Promise<FarmerDetails> {
  return apiFetch<FarmerDetails>(`/farmers/${id}`)
}

// ---------------------------------------------------------------------------
// Scorecard
// ---------------------------------------------------------------------------

/** Returns portfolio-level stats: avg trust score, loan counts, climate alerts. */
export async function fetchScorecard(): Promise<Scorecard> {
  return apiFetch<Scorecard>('/scorecard')
}

// ---------------------------------------------------------------------------
// Climate
// ---------------------------------------------------------------------------

/** Returns regional climate events and weather alerts. */
export async function fetchClimate() {
  return apiFetch('/climate')
}

// ---------------------------------------------------------------------------
// Masumi — Step 1: service request (escrow intent)
// ---------------------------------------------------------------------------

/**
 * Initiates the Masumi payment flow for a farmer assessment.
 * Returns a job_id that acts as the escrow reference for step 2.
 *
 * Note: on preprod the escrow is mocked. In production this triggers
 * an on-chain ADA escrow contract via the Masumi node.
 */
export async function fetchServiceRequest(farmerId: number): Promise<ServiceRequest> {
  return apiFetch<ServiceRequest>('/service-request', {
    method: 'POST',
    body: JSON.stringify({ farmer_id: farmerId }),
  })
}

// ---------------------------------------------------------------------------
// Masumi — Step 2: paid recommendation
// ---------------------------------------------------------------------------

/**
 * Runs the full Masumi-gated recommendation flow:
 *   1. Creates a service request (escrow intent) for the farmer.
 *   2. Passes the returned job_id as X-Masumi-Escrow-Tx to /api/recommendations.
 *   3. Returns the scored recommendation memo with Masumi audit trail.
 *
 * The backend requires the escrow header; without it the endpoint returns 402.
 */
export async function fetchRecommendations(farmerId: number): Promise<RecommendationResponse> {
  // Step 1 — initiate Masumi service request
  const serviceRequest = await fetchServiceRequest(farmerId)

  // Step 2 — call the payment-gated endpoint with the escrow reference
  return apiFetch<RecommendationResponse>(
    '/recommendations',
    {
      method: 'POST',
      body: JSON.stringify({ farmer_id: farmerId }),
    },
    {
      'X-Masumi-Escrow-Tx': serviceRequest.job_id,
    }
  )
}

// ---------------------------------------------------------------------------
// Masumi — Audit trail
// ---------------------------------------------------------------------------

/**
 * Returns the full audit log of paid recommendation calls.
 * In production, scope this to authenticated loan officers only.
 */
export async function fetchAuditLog(): Promise<AuditLog> {
  return apiFetch<AuditLog>('/audit')
}