// @ts-nocheck
import { useState } from 'react';
// @ts-nocheck
import {
  TrendingUp, Users, CreditCard, AlertTriangle,
  ChevronRight, Search, Filter, Eye, CheckCircle, XCircle,
  MapPin, Phone, Sprout, Building2, Waves
} from 'lucide-react';
// @ts-nocheck
import {
  farmers, loanApplications, peerPools, systemStats,
  getFarmerById, getPoolById, getTrustColor,
  type LoanApplication
} from '../data/mockData';
// @ts-nocheck
import {
  StatCard, TrustRing, TrustBadge, RiskBadge,
  StatusBadge, TrustFactorPanel, PageHeader, ClimateRisk
} from '../components/UI';
import XAIPanel from '../components/XAIPanel';
// @ts-nocheck
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

// ── Overview ──────────────────────────────────────────────────
export function LenderOverview() {
  const pending = loanApplications.filter(l => l.status === 'pending');
  const totalPending = pending.reduce((a, l) => a + l.amountKES, 0);

  return (
    <div>
      <PageHeader
        title="Portfolio overview"
        subtitle="AgriTrust AI · Kenya AI Challenge 2026"
        action={
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="badge badge-green">● Live demo</span>
          </div>
        }
      />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard
          label="Total farmers"
          value={systemStats.totalFarmers.toLocaleString()}
          sub="in registry"
          icon={<Users size={18} />}
          accent="var(--green-mid)"
        />
        <StatCard
          label="Scored individually"
          value={systemStats.scoredFarmers}
          sub={`${systemStats.inPeerPools} in peer pools`}
          icon={<TrendingUp size={18} />}
          accent="var(--sky)"
        />
        <StatCard
          label="Disbursed (KES)"
          value={`${(systemStats.totalDisbursedKES / 1_000_000).toFixed(1)}M`}
          sub="this portfolio"
          icon={<CreditCard size={18} />}
          accent="var(--green-mid)"
        />
        <StatCard
          label="Portfolio at risk"
          value={`${systemStats.portfolioAtRiskPct}%`}
          sub="vs 12% industry avg"
          icon={<AlertTriangle size={18} />}
          accent="var(--amber)"
        />
      </div>

      {/* Pending applications */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15 }}>Pending decisions</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              KES {totalPending.toLocaleString()} total
            </span>
            <span className="badge badge-amber">{pending.length} pending</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.map(loan => {
            const farmer = getFarmerById(loan.farmerId);
            if (!farmer) return null;
            return (
              <div key={loan.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px', borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
              }}>
                <TrustRing score={farmer.trustScore} tier={farmer.trustTier} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{farmer.name}</span>
                    <TrustBadge tier={farmer.trustTier} />
                    {loan.isPoolBacked && <span className="badge badge-sky">Pool backed</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {farmer.county} · {farmer.cropTypes.join(', ')} · {loan.purpose}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--green-deep)' }}>
                    KES {loan.amountKES.toLocaleString()}
                  </div>
                  <RiskBadge rating={loan.riskRating} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inclusion stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Inclusion breakdown</h3>
          {[
            { label: 'Women farmers', value: systemStats.womenPct, color: '#ec4899' },
            { label: 'Youth (under 35)', value: systemStats.youthPct, color: var_sky },
            { label: 'ASAL region', value: 22, color: '#f59e0b' },
            { label: 'Persons with disabilities', value: 8, color: '#8b5cf6' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{item.value}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Active peer pools</h3>
          {peerPools.map(pool => (
            <div key={pool.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'var(--green-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'var(--green-deep)',
              }}>
                {pool.memberIds.length}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{pool.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pool.region}</div>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk',
                color: getTrustColor(pool.poolScore >= 70 ? 'high' : pool.poolScore >= 50 ? 'medium' : 'low'),
              }}>
                {pool.poolScore}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const var_sky = '#0ea5e9';

// ── Applications ──────────────────────────────────────────────
export function LenderApplications() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<LoanApplication | null>(null);

  const filtered = loanApplications.filter(l => {
    const matchSearch = l.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      l.purpose.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || l.status === filter;
    return matchSearch && matchFilter;
  });

  const farmer = selected ? getFarmerById(selected.farmerId) : null;
  const pool = selected?.poolId ? getPoolById(selected.poolId) : null;

  if (selected && farmer) {
    const radarData = [
      { factor: 'M-Pesa', value: farmer.trustFactors.mobileMoneyConsistency },
      { factor: 'Co-op', value: farmer.trustFactors.cooperativeRepayment },
      { factor: 'Inputs', value: farmer.trustFactors.inputPurchasePattern },
      { factor: 'Records', value: farmer.trustFactors.productionRecords },
      { factor: 'Climate', value: farmer.trustFactors.climateAdaptation },
      { factor: 'Community', value: farmer.trustFactors.communityTrust },
    ];

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setSelected(null)}>
            ← Back
          </button>
          <h2 style={{ fontSize: 18 }}>Application {selected.id}</h2>
          <StatusBadge status={selected.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left: farmer profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                <TrustRing score={farmer.trustScore} tier={farmer.trustTier} size={72} />
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 4 }}>{farmer.name}</h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <TrustBadge tier={farmer.trustTier} />
                    <RiskBadge rating={selected.riskRating} />
                    {selected.isPoolBacked && <span className="badge badge-sky">Pool backed</span>}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 12 }}>
                    <span><MapPin size={11} style={{ verticalAlign: -1 }} /> {farmer.county}</span>
                    <span><Phone size={11} style={{ verticalAlign: -1 }} /> {farmer.phone}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[
                  ['Crops', farmer.cropTypes.join(', ')],
                  ['Land', `${farmer.landAcres} acres`],
                  ['Repayment cycles', farmer.repaymentCycles],
                  ['M-Pesa linked', farmer.mpesaLinked ? 'Yes' : 'No'],
                  ['Cooperative', farmer.cooperativeName || 'None'],
                  ['Member since', farmer.memberSince],
                ].map(([k, v]) => (
                  <div key={String(k)}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, marginTop: 1 }}>{String(v)}</div>
                  </div>
                ))}
              </div>

              {farmer.hasDisability && <span className="badge badge-sky" style={{ marginRight: 4 }}>PWD</span>}
              {farmer.isYouth && <span className="badge badge-sky">Youth</span>}
            </div>

            {/* Radar chart */}
            <div className="card">
              <h4 style={{ fontSize: 13, marginBottom: 12 }}>Trust factor breakdown</h4>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                  <Radar dataKey="value" stroke="var(--green-mid)" fill="var(--green-mid)" fillOpacity={0.15} strokeWidth={1.5} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
                    formatter={(v: number) => [`${v}/100`, '']}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <TrustFactorPanel factors={farmer.trustFactors} />
            </div>
          </div>

          {/* Right: application details + XAI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h4 style={{ fontSize: 13, marginBottom: 12 }}>Loan request</h4>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--green-deep)' }}>
                  KES {selected.amountKES.toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{selected.purpose}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Applied {selected.appliedAt}</div>
              </div>

              {pool && (
                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'var(--sky-light)',
                  border: '1px solid #bae6fd',
                  marginBottom: 12,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>
                    Peer pool backing: {pool.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#0369a1' }}>
                    {pool.memberIds.length} members · {pool.repaymentRate}% repayment rate · Pool score: {pool.poolScore}
                  </div>
                  <div style={{ fontSize: 11, color: '#0369a1', marginTop: 3 }}>
                    Match basis: {pool.matchBasis.join(' · ')}
                  </div>
                </div>
              )}

              {selected.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                    <XCircle size={14} />
                    Decline
                  </button>
                </div>
              )}

              {selected.lenderNote && (
                <div style={{
                  marginTop: 12, padding: '10px 12px', borderRadius: 8,
                  background: 'var(--surface)', fontSize: 12, color: 'var(--text-secondary)',
                  borderLeft: '3px solid var(--green-mid)',
                }}>
                  {selected.lenderNote}
                </div>
              )}
            </div>

            {/* Climate risk card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Waves size={14} color="var(--sky)" />
                <h4 style={{ fontSize: 13 }}>Climate risk context</h4>
              </div>
              <ClimateRisk value={farmer.county === 'Garissa' || farmer.county === 'Wajir' ? 68 : farmer.county === 'Kisumu' ? 55 : 22} />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                Based on CHIRPS rainfall data and NDVI analysis for {farmer.county} county, {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.
              </p>
            </div>

            {/* XAI Panel */}
            <XAIPanel farmer={farmer} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Loan applications" subtitle={`${loanApplications.length} total applications`} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by farmer name or purpose…"
            style={{
              width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8,
              border: '1px solid var(--border)', fontSize: 12, outline: 'none',
              background: 'white',
            }}
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
            fontSize: 12, background: 'white', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="disbursed">Disbursed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['Farmer', 'Amount (KES)', 'Purpose', 'Risk', 'Backing', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((loan, i) => {
              const farmer = getFarmerById(loan.farmerId);
              return (
                <tr key={loan.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <TrustRing score={farmer?.trustScore ?? null} tier={farmer?.trustTier ?? 'unscored'} size={32} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{loan.farmerName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{farmer?.county}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk' }}>
                    {loan.amountKES.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', maxWidth: 180 }}>
                    {loan.purpose}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <RiskBadge rating={loan.riskRating} />
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {loan.isPoolBacked
                      ? <span className="badge badge-sky">Pool</span>
                      : <span className="badge" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>Individual</span>
                    }
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <StatusBadge status={loan.status} />
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: 11, padding: '5px 10px' }}
                      onClick={() => setSelected(loan)}
                    >
                      <Eye size={12} />
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Farmers list ──────────────────────────────────────────────
export function LenderFarmers() {
  const [search, setSearch] = useState('');
  const [selected, setSelectedFarmer] = useState<string | null>(null);

  const filtered = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.county.toLowerCase().includes(search.toLowerCase())
  );

  const farmer = selected ? getFarmerById(selected) : null;

  if (farmer) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setSelectedFarmer(null)}>
            ← Back
          </button>
          <h2 style={{ fontSize: 18 }}>{farmer.name}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                <TrustRing score={farmer.trustScore} tier={farmer.trustTier} size={80} />
                <div>
                  <h3 style={{ fontSize: 17 }}>{farmer.name}</h3>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <TrustBadge tier={farmer.trustTier} />
                    {farmer.isYouth && <span className="badge badge-sky">Youth</span>}
                    {farmer.hasDisability && <span className="badge badge-sky">PWD</span>}
                    {farmer.gender === 'F' && <span className="badge" style={{ background: '#fce7f3', color: '#9d174d' }}>Women</span>}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <MapPin size={11} style={{ verticalAlign: -1 }} /> {farmer.subcounty}, {farmer.county}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['Crops', farmer.cropTypes.join(', ')],
                  ['Land size', `${farmer.landAcres} acres`],
                  ['Phone', farmer.phone],
                  ['M-Pesa', farmer.mpesaLinked ? 'Linked' : 'Not linked'],
                  ['Cooperative', farmer.cooperativeName || 'None'],
                  ['Repayment cycles', farmer.repaymentCycles],
                  ['Member since', farmer.memberSince],
                  ['Peer pool', farmer.peerPoolId || 'None'],
                ].map(([k, v]) => (
                  <div key={String(k)}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, marginTop: 1 }}>{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 style={{ fontSize: 13, marginBottom: 12 }}>Trust factors</h4>
              <TrustFactorPanel factors={farmer.trustFactors} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <XAIPanel farmer={farmer} />

            <div className="card">
              <h4 style={{ fontSize: 13, marginBottom: 12 }}>Loan history</h4>
              {loanApplications.filter(l => l.farmerId === farmer.id).map(loan => (
                <div key={loan.id} style={{
                  padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', marginBottom: 8,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{loan.purpose}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{loan.appliedAt}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk' }}>
                      KES {loan.amountKES.toLocaleString()}
                    </div>
                    <StatusBadge status={loan.status} />
                  </div>
                </div>
              ))}
              {loanApplications.filter(l => l.farmerId === farmer.id).length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No loan history.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Farmer profiles" subtitle={`${farmers.length} registered farmers`} />
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or county…"
          style={{
            width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8,
            border: '1px solid var(--border)', fontSize: 12, outline: 'none', background: 'white',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {filtered.map(farmer => (
          <div
            key={farmer.id}
            className="card"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onClick={() => setSelectedFarmer(farmer.id)}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <TrustRing score={farmer.trustScore} tier={farmer.trustTier} size={52} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{farmer.name}</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 4 }}>
                  <TrustBadge tier={farmer.trustTier} />
                  {farmer.isYouth && <span className="badge badge-sky">Youth</span>}
                  {farmer.gender === 'F' && <span className="badge" style={{ background: '#fce7f3', color: '#9d174d' }}>Women</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  <MapPin size={10} style={{ verticalAlign: -1 }} /> {farmer.county} · {farmer.cropTypes[0]}
                </div>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Peer pools ────────────────────────────────────────────────
export function LenderPools() {
  return (
    <div>
      <PageHeader title="Peer trust pools" subtitle="AI-matched groups for thin-file farmers" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {peerPools.map(pool => (
          <div key={pool.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>{pool.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <MapPin size={11} style={{ verticalAlign: -1 }} /> {pool.region}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Space Grotesk', color: getTrustColor(pool.poolScore >= 70 ? 'high' : pool.poolScore >= 50 ? 'medium' : 'low') }}>
                  {pool.poolScore}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>pool score</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
              {[
                ['Members', pool.memberIds.length],
                ['Repayment', `${pool.repaymentRate}%`],
                ['Total loans', `KES ${(pool.totalLoanKES / 1000).toFixed(0)}K`],
                ['Status', pool.status],
              ].map(([k, v]) => (
                <div key={String(k)} style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Space Grotesk', marginTop: 2 }}>{String(v)}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>AI MATCH BASIS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {pool.matchBasis.map(b => (
                  <span key={b} className="badge badge-green" style={{ fontSize: 10 }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
