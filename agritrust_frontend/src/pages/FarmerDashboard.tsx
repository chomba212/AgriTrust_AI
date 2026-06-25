// @ts-nocheck
import { useState } from 'react';
// @ts-nocheck
import {
  TrendingUp, Sprout, Users, ArrowUpRight,
  CheckCircle, Clock, AlertCircle, Lightbulb
} from 'lucide-react';
// @ts-nocheck
import { farmers, peerPools, loanApplications, getPoolById } from '../data/mockData';
// @ts-nocheck
import {
  TrustRing, TrustBadge, TrustFactorPanel, PageHeader, StatCard, ClimateRisk, StatusBadge
} from '../components/UI';
import XAIPanel from '../components/XAIPanel';

// Use Grace as the "logged-in" farmer
const ME = farmers[0];

export function FarmerProfile() {
  const myPool = ME.peerPoolId ? getPoolById(ME.peerPoolId) : null;

  const radarFactors = [
    { label: 'M-Pesa activity', key: 'mobileMoneyConsistency', tip: 'Keep sending and receiving via M-Pesa regularly.' },
    { label: 'Co-op repayment', key: 'cooperativeRepayment', tip: 'Paying cooperative dues on time directly boosts your score.' },
    { label: 'Input purchases', key: 'inputPurchasePattern', tip: 'Buying inputs through tracked channels builds your farming record.' },
    { label: 'Production data', key: 'productionRecords', tip: 'Log your harvests with your cooperative or via field agent visits.' },
    { label: 'Climate adaptation', key: 'climateAdaptation', tip: 'Using drought-tolerant varieties and water conservation counts.' },
    { label: 'Community trust', key: 'communityTrust', tip: 'Active cooperative membership improves your community trust score.' },
  ] as const;

  return (
    <div>
      <PageHeader title="My trust profile" subtitle="How AgriTrust AI scores your creditworthiness" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Main trust card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--green-deep) 0%, #1a5c38 100%)', border: 'none' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
              <TrustRing score={ME.trustScore} tier={ME.trustTier} size={96} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: '0.08em', marginBottom: 4 }}>YOUR TRUST SCORE</div>
                <div style={{ color: 'white', fontFamily: 'Space Grotesk', fontSize: 42, fontWeight: 700, lineHeight: 1 }}>
                  {ME.trustScore}
                </div>
                <div style={{ color: 'var(--green-bright)', fontSize: 13, marginTop: 6 }}>
                  ● High trust tier
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['Cycles', ME.repaymentCycles],
                ['Cooperative', 'Active'],
                ['M-Pesa', ME.mpesaLinked ? 'Linked' : 'No'],
              ].map(([k, v]) => (
                <div key={String(k)} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: 'Space Grotesk', marginTop: 1 }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Score factors */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 14 }}>What's driving your score</h3>
            <TrustFactorPanel factors={ME.trustFactors} />
          </div>

          {/* Climate */}
          <div className="card">
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
              <Sprout size={14} color="var(--green-mid)" />
              <h4 style={{ fontSize: 13 }}>Climate context — {ME.county}</h4>
            </div>
            <ClimateRisk value={20} />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              Low drought risk this season. Good growing conditions for rice in Mwea.
            </p>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <XAIPanel farmer={ME} />

          {/* Score history */}
          <div className="card">
            <h4 style={{ fontSize: 13, marginBottom: 12 }}>Score journey</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { date: 'Jun 2026', score: 78, event: 'Current score', active: true },
                { date: 'Mar 2026', score: 72, event: '4th repayment cycle completed' },
                { date: 'Dec 2025', score: 64, event: 'Joined Mwea Rice SACCO' },
                { date: 'Sep 2025', score: 55, event: 'M-Pesa activity scored' },
                { date: 'Mar 2022', score: 0, event: 'Joined AgriTrust' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: item.active ? 'var(--green-mid)' : 'var(--surface)',
                    border: '2px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk',
                    color: item.active ? 'white' : 'var(--text-secondary)',
                  }}>
                    {item.score || '—'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: item.active ? 600 : 400 }}>{item.event}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FarmerLoans() {
  const myLoans = loanApplications.filter(l => l.farmerId === ME.id);

  return (
    <div>
      <PageHeader
        title="My loans"
        action={<button className="btn btn-primary"><ArrowUpRight size={14} /> Apply for loan</button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Active loans" value={myLoans.filter(l => l.status === 'disbursed').length} accent="var(--green-mid)" />
        <StatCard label="Total borrowed" value={`KES ${myLoans.reduce((a, l) => a + l.amountKES, 0).toLocaleString()}`} accent="var(--sky)" />
        <StatCard label="Repayment cycles" value={ME.repaymentCycles} sub="on-time payments" accent="var(--amber)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {myLoans.map(loan => (
          <div key={loan.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: loan.status === 'approved' || loan.status === 'disbursed' ? 'var(--green-light)' :
                  loan.status === 'pending' ? 'var(--amber-light)' : 'var(--danger-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {loan.status === 'approved' || loan.status === 'repaid' ? <CheckCircle size={18} color="var(--green-mid)" /> :
                  loan.status === 'pending' ? <Clock size={18} color="var(--amber)" /> :
                  loan.status === 'rejected' ? <AlertCircle size={18} color="var(--danger)" /> :
                  <TrendingUp size={18} color="var(--sky)" />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{loan.purpose}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Applied {loan.appliedAt}</div>
                {loan.lenderNote && (
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Note: {loan.lenderNote}
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--green-deep)' }}>
                KES {loan.amountKES.toLocaleString()}
              </div>
              <StatusBadge status={loan.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FarmerPool() {
  const pool = ME.peerPoolId ? getPoolById(ME.peerPoolId) : null;

  if (!pool) {
    return (
      <div>
        <PageHeader title="My peer pool" />
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Users size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            You have a full individual trust score and are not in a peer pool.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My peer pool" subtitle="You're backed by a shared group guarantee" />

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>{pool.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            ['Pool score', pool.poolScore],
            ['Members', pool.memberIds.length],
            ['Repayment', `${pool.repaymentRate}%`],
            ['Status', pool.status],
          ].map(([k, v]) => (
            <div key={String(k)} style={{ background: 'var(--surface)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Space Grotesk', marginTop: 2 }}>{String(v)}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>WHY YOU WERE MATCHED</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {pool.matchBasis.map(b => <span key={b} className="badge badge-green">{b}</span>)}
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--sky-light)', border: '1px solid #bae6fd' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Lightbulb size={16} color="#0369a1" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>
              Your path to an individual score
            </div>
            <p style={{ fontSize: 12, color: '#0369a1', lineHeight: 1.6 }}>
              After completing <strong>2 repayment cycles</strong> through the pool, AgriTrust AI will begin building your individual trust profile. Strong group behaviour feeds your personal score from day one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FarmerTips() {
  const factors = ME.trustFactors;

  const tips = [
    {
      score: factors.mobileMoneyConsistency,
      title: 'Use M-Pesa consistently',
      detail: 'Regular M-Pesa activity — sending, receiving, buying airtime — creates a financial pattern that AgriTrust AI can score. Aim for at least 8 transactions per month.',
      icon: <TrendingUp size={18} />,
    },
    {
      score: factors.cooperativeRepayment,
      title: 'Stay current with your cooperative',
      detail: 'Every on-time payment to your SACCO or cooperative is recorded and boosts your repayment history score significantly.',
      icon: <CheckCircle size={18} />,
    },
    {
      score: factors.productionRecords,
      title: 'Log your harvest data',
      detail: 'Ask your field agent to record your harvest yields, delivery volumes, and input purchases. The more data on record, the stronger your profile.',
      icon: <Sprout size={18} />,
    },
    {
      score: factors.climateAdaptation,
      title: 'Adopt climate-smart practices',
      detail: 'Using drought-tolerant seeds, practicing water harvesting, or joining a climate adaptation programme all improve your climate adaptation score.',
      icon: <AlertCircle size={18} />,
    },
  ].sort((a, b) => a.score - b.score); // lowest scores first = most impactful tips

  return (
    <div>
      <PageHeader title="Improvement tips" subtitle="Actions that will raise your trust score fastest" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tips.map((tip, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: tip.score >= 70 ? 'var(--green-light)' : tip.score >= 45 ? 'var(--amber-light)' : 'var(--danger-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: tip.score >= 70 ? 'var(--green-mid)' : tip.score >= 45 ? 'var(--earth)' : 'var(--danger)',
              }}>
                {tip.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <h3 style={{ fontSize: 14 }}>{tip.title}</h3>
                  <span style={{
                    fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk',
                    color: tip.score >= 70 ? 'var(--green-mid)' : tip.score >= 45 ? 'var(--amber)' : 'var(--danger)',
                  }}>
                    {tip.score}/100
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip.detail}</p>
                {i === 0 && (
                  <div style={{ marginTop: 8 }}>
                    <span className="badge badge-amber">Highest impact action</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
