import { useEffect, useState } from 'react'
import { fetchFarmers, fetchFarmerDetails, fetchRecommendations, fetchScorecard } from './api'
import { Farmer, FarmerDetails, RecommendationResponse, Scorecard } from './types'

function ScorecardPanel({ scorecard }: { scorecard: Scorecard | null }) {
  if (!scorecard) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading scorecard...</div>
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Trust Score</h3>
        <p className="mt-4 text-4xl font-semibold text-slate-900">{scorecard.average_trust_score}</p>
        <p className="mt-3 text-sm text-slate-600">Average score across active farmer profiles.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Loan Decisions</h3>
        <div className="mt-4 space-y-3 text-slate-700">
          <div className="flex items-center justify-between">Approved <span className="font-semibold text-emerald-600">{scorecard.approved_loans}</span></div>
          <div className="flex items-center justify-between">Pending <span className="font-semibold text-amber-600">{scorecard.pending_loans}</span></div>
          <div className="flex items-center justify-between">Declined <span className="font-semibold text-rose-600">{scorecard.declined_loans}</span></div>
        </div>
        <p className="mt-4 text-sm text-slate-600">Loan approvals grew {scorecard.loan_flow_change} in the last month.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Climate Intelligence</h3>
        <p className="mt-4 text-3xl font-semibold text-slate-900">{scorecard.weather_alerts}</p>
        <p className="mt-2 text-sm text-slate-600">Active alerts across the lending region.</p>
        <div className="mt-4 space-y-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <div><span className="font-semibold">Regional risk:</span> {scorecard.regional_risk}</div>
          <div>{scorecard.recommended_actions[0]}</div>
        </div>
      </div>
    </div>
  )
}

function TrustBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
      {label}: {value}
    </div>
  )
}

function FarmerCard({ farmer, onSelect }: { farmer: Farmer; onSelect: (id: number) => void }) {
  return (
    <article className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Farmer</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{farmer.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{farmer.location}</p>
          </div>
          <div className="space-y-2 text-right">
            <TrustBadge label="Crop" value={farmer.primary_crop} />
            <TrustBadge label="Risk" value={farmer.climate_risk} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">Trust score</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{farmer.trust_score}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">Cooperative</p>
            <p className="mt-3 font-semibold text-slate-900">{farmer.cooperative}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">{farmer.profile}</p>

        <button
          onClick={() => onSelect(farmer.id)}
          className="mt-5 inline-flex items-center justify-center rounded-3xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          View trust profile
        </button>
      </div>
    </article>
  )
}

function FarmerDetailSidepanel({
  farmer,
  recommendation,
  loading,
  onClose,
}: {
  farmer: FarmerDetails | null
  recommendation: RecommendationResponse | null
  loading: boolean
  onClose: () => void
}) {
  if (!farmer) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Loan officer briefing</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Select a farmer to see explainable trust signals, climate exposure, and recommended next steps for credit readiness.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Inspector</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{farmer.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{farmer.primary_crop} · {farmer.cooperative}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trust score</p>
          <p className="mt-3 text-5xl font-semibold text-slate-900">{farmer.trust_score}</p>
          <p className="mt-2 text-sm font-medium text-emerald-700">{farmer.trust_category}</p>
        </div>
        <div className="space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
          <div><span className="font-semibold">Loan status:</span> {farmer.loan_status}</div>
          <div><span className="font-semibold">Credit readiness:</span> {farmer.credit_readiness}</div>
          <div><span className="font-semibold">Climate risk:</span> {farmer.climate_risk}</div>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Explainable AI</p>
        <p className="text-sm leading-6 text-slate-600">{farmer.explainability.narrative}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Drivers</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {farmer.explainability.drivers.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 p-3">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Evidence</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {farmer.explainability.evidence.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 p-3">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Trends</p>
          <div className="mt-4 space-y-3">
            <div><span className="font-semibold">Mobile money:</span> {farmer.mobile_money_trend}</div>
            <div><span className="font-semibold">Climate exposure:</span></div>
            <ul className="ml-4 list-disc space-y-2 text-slate-700">
              {farmer.climate_exposure.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Graph AI insights</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {farmer.graph_insights.map((item) => (
              <li key={item} className="rounded-2xl bg-white p-3 shadow-sm">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recommendations</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {recommendation?.recommendations.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 p-3">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Next steps</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {recommendation?.next_steps.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 p-3">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {loading && (
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
          Loading detailed trust signals...
        </div>
      )}
    </div>
  )
}

function App() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerDetails | null>(null)
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)
  const [scorecard, setScorecard] = useState<Scorecard | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [farmerData, scoreData] = await Promise.all([fetchFarmers(), fetchScorecard()])
        setFarmers(farmerData)
        setScorecard(scoreData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleSelectFarmer(id: number) {
    setDetailsLoading(true)
    setError(null)

    try {
      const [detail, recommendationResult] = await Promise.all([
        fetchFarmerDetails(id),
        fetchRecommendations(id)
      ])
      setSelectedFarmer(detail)
      setRecommendation(recommendationResult)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setDetailsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-[2rem] bg-gradient-to-r from-emerald-700 via-emerald-600 to-slate-900 p-10 text-white shadow-2xl shadow-emerald-500/10 sm:p-12">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.36em] text-emerald-200">AgriTrust AI</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Explainable farmer trust intelligence for inclusive agricultural finance.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-emerald-100">
              Explore trust signals, climate risk context, and fair lending recommendations for smallholder farmers using graph AI and alternative data.
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Credit & Climate Insights</h2>
            </div>
            <div className="rounded-3xl bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
              {loading ? 'Loading latest insights…' : `${farmers.length} farmers loaded`}
            </div>
          </div>

          <div className="mt-6">
            <ScorecardPanel scorecard={scorecard} />
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Loan officer dashboard</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Explainable AI, trust signals, and field intelligence</h2>
            </div>
            {scorecard && (
              <div className="rounded-3xl bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-900">Top climate event</p>
                <p className="mt-2 text-sm">{scorecard.climate_events[0].type} risk during {scorecard.climate_events[0].season}</p>
              </div>
            )}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="grid gap-6">
              {farmers.map((farmer) => (
                <FarmerCard key={farmer.id} farmer={farmer} onSelect={handleSelectFarmer} />
              ))}
            </div>
            <FarmerDetailSidepanel
              farmer={selectedFarmer}
              recommendation={recommendation}
              loading={detailsLoading}
              onClose={() => setSelectedFarmer(null)}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Operational intelligence</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">How AgriTrust AI helps lenders make faster, fairer decisions</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Graph AI credit scoring</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Combines relationship, repayment, and cooperative signals to rank trustworthiness without collateral bias.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Explainable recommendations</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Every decision is backed by transparent factors and evidence, so loan officers can justify lending recommendations.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Climate-aware risk assessment</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Integrates weather alerts and exposure data to adjust credit risk for agricultural borrowers.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
