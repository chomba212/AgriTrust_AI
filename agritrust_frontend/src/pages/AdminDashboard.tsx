// @ts-nocheck
import { useState } from 'react';
// @ts-nocheck
import { Users, TrendingUp, Activity, Shield, Search } from 'lucide-react';
// @ts-nocheck
import { farmers, peerPools, systemStats, getTrustColor } from '../data/mockData';
// @ts-nocheck
import { StatCard, TrustRing, TrustBadge, PageHeader } from '../components/UI';
// @ts-nocheck
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminOverview() {
  const tierCounts = {
    high: farmers.filter(f => f.trustTier === 'high').length,
    medium: farmers.filter(f => f.trustTier === 'medium').length,
    low: farmers.filter(f => f.trustTier === 'low').length,
    unscored: farmers.filter(f => f.trustTier === 'unscored').length,
  };

  const pieData = [
    { name: 'High trust', value: tierCounts.high, color: '#1a7a4a' },
    { name: 'Medium', value: tierCounts.medium, color: '#f59e0b' },
    { name: 'Low', value: tierCounts.low, color: '#ef4444' },
    { name: 'Pool only', value: tierCounts.unscored, color: '#0ea5e9' },
  ];

  const countyData = [
    { county: 'Kirinyaga', farmers: 187 },
    { county: 'Uasin Gishu', farmers: 163 },
    { county: 'Nyeri', farmers: 142 },
    { county: 'Murang\'a', farmers: 121 },
    { county: 'Kisumu', farmers: 98 },
    { county: 'Garissa', farmers: 76 },
    { county: 'Bomet', farmers: 68 },
    { county: 'Wajir', farmers: 54 },
  ];

  return (
    <div>
      <PageHeader
        title="System overview"
        subtitle="AgriTrust AI platform · Kenya AI Challenge 2026"
        action={<span className="badge badge-green">● All systems operational</span>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total farmers" value={systemStats.totalFarmers.toLocaleString()} icon={<Users size={18} />} accent="var(--green-mid)" />
        <StatCard label="Active peer pools" value={systemStats.activePools} sub={`${systemStats.inPeerPools} farmers pooled`} icon={<Shield size={18} />} accent="var(--sky)" />
        <StatCard label="Avg trust score" value={systemStats.avgTrustScore} sub="among scored farmers" icon={<TrendingUp size={18} />} accent="var(--amber)" />
        <StatCard label="Loans this month" value={systemStats.loansThisMonth} icon={<Activity size={18} />} accent="var(--green-mid)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Trust distribution pie */}
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 16 }}>Trust tier distribution</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* County distribution */}
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 16 }}>Farmers by county</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={countyData} layout="vertical" margin={{ left: 20, right: 10 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="county" tick={{ fontSize: 10 }} width={70} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="farmers" fill="var(--green-mid)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inclusion headline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Space Grotesk', color: '#ec4899' }}>{systemStats.womenPct}%</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Women farmers</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--sky)' }}>{systemStats.youthPct}%</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Youth (under 35)</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--amber)' }}>{systemStats.portfolioAtRiskPct}%</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Portfolio at risk</div>
        </div>
      </div>
    </div>
  );
}

export function AdminRegistry() {
  const [search, setSearch] = useState('');
  const filtered = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.county.toLowerCase().includes(search.toLowerCase()) ||
    f.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Farmer registry"
        subtitle={`${farmers.length} farmers registered`}
        action={<button className="btn btn-primary"><Users size={14} /> Add farmer</button>}
      />

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, ID, or county…"
          style={{
            width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8,
            border: '1px solid var(--border)', fontSize: 12, outline: 'none', background: 'white',
          }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['ID', 'Name', 'County', 'Crops', 'Score', 'Tier', 'Pool', 'Cycles'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((farmer, i) => (
              <tr key={farmer.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '10px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{farmer.id}</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <TrustRing score={farmer.trustScore} tier={farmer.trustTier} size={28} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{farmer.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 4 }}>
                        {farmer.gender === 'F' && <span>F</span>}
                        {farmer.isYouth && <span>· Youth</span>}
                        {farmer.hasDisability && <span>· PWD</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12 }}>{farmer.county}</td>
                <td style={{ padding: '10px 12px', fontSize: 11, color: 'var(--text-secondary)' }}>{farmer.cropTypes.join(', ')}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk', color: getTrustColor(farmer.trustTier) }}>
                  {farmer.trustScore ?? '—'}
                </td>
                <td style={{ padding: '10px 12px' }}><TrustBadge tier={farmer.trustTier} /></td>
                <td style={{ padding: '10px 12px', fontSize: 11 }}>
                  {farmer.peerPoolId
                    ? <span className="badge badge-sky">{farmer.peerPoolId}</span>
                    : <span style={{ color: 'var(--text-muted)' }}>—</span>
                  }
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12, fontWeight: 600 }}>{farmer.repaymentCycles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPools() {
  return (
    <div>
      <PageHeader title="Peer pool manager" subtitle="AI-matched groups for thin-file farmers" action={
        <button className="btn btn-primary"><Users size={14} /> Create pool</button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {peerPools.map(pool => (
          <div key={pool.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <h3 style={{ fontSize: 14 }}>{pool.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{pool.region} · Created {pool.createdAt}</div>
              </div>
              <span className={`badge ${pool.status === 'active' ? 'badge-green' : pool.status === 'forming' ? 'badge-amber' : 'badge-sky'}`}>
                {pool.status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {[
                ['Pool score', pool.poolScore],
                ['Members', pool.memberIds.length],
                ['Repayment', `${pool.repaymentRate}%`],
                ['Total loans', `KES ${(pool.totalLoanKES / 1000).toFixed(0)}K`],
                ['Match basis', pool.matchBasis.length + ' factors'],
              ].map(([k, v]) => (
                <div key={String(k)} style={{ background: 'var(--surface)', borderRadius: 6, padding: '6px 8px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk', marginTop: 1 }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Platform configuration" />
      <div className="card">
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Settings panel coming in Day 2 build.</p>
      </div>
    </div>
  );
}
