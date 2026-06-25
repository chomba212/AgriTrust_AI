// @ts-nocheck
import { getTrustColor, getTrustLabel, type TrustTier, type TrustFactors } from '../data/mockData';

// ── Stat card ────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {label}
        </span>
        {icon && <span style={{ color: accent || 'var(--text-muted)', opacity: 0.7 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: accent || 'var(--text-primary)', lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</div>}
    </div>
  );
}

// ── Trust score ring ──────────────────────────────────────────
interface TrustRingProps {
  score: number | null;
  tier: TrustTier;
  size?: number;
}

export function TrustRing({ score, tier, size = 72 }: TrustRingProps) {
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = score !== null ? score / 100 : 0;
  const color = getTrustColor(tier);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={5} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {score !== null ? (
          <span style={{ fontSize: size > 64 ? 16 : 13, fontWeight: 700, color, fontFamily: 'Space Grotesk, sans-serif' }}>
            {score}
          </span>
        ) : (
          <span style={{ fontSize: 9, fontWeight: 600, color, textAlign: 'center', lineHeight: 1.2 }}>
            POOL<br />ONLY
          </span>
        )}
      </div>
    </div>
  );
}

// ── Trust badge ───────────────────────────────────────────────
interface TrustBadgeProps { tier: TrustTier }
export function TrustBadge({ tier }: TrustBadgeProps) {
  const map: Record<TrustTier, string> = {
    high: 'badge badge-green',
    medium: 'badge badge-amber',
    low: 'badge badge-red',
    unscored: 'badge badge-sky',
  };
  return <span className={map[tier]}>{getTrustLabel(tier)}</span>;
}

// ── Risk rating badge ─────────────────────────────────────────
interface RiskBadgeProps { rating: 'A' | 'B' | 'C' | 'D' }
export function RiskBadge({ rating }: RiskBadgeProps) {
  const map = {
    A: 'badge badge-green',
    B: 'badge badge-sky',
    C: 'badge badge-amber',
    D: 'badge badge-red',
  };
  const labels = { A: 'Risk A — low', B: 'Risk B — moderate', C: 'Risk C — elevated', D: 'Risk D — high' };
  return <span className={map[rating]}>{labels[rating]}</span>;
}

// ── Status badge ──────────────────────────────────────────────
type LoanStatus = 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
interface StatusBadgeProps { status: LoanStatus }
export function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<LoanStatus, string> = {
    pending: 'badge badge-amber',
    approved: 'badge badge-green',
    rejected: 'badge badge-red',
    disbursed: 'badge badge-sky',
    repaid: 'badge badge-green',
  };
  return <span className={map[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

// ── Trust factor radar ────────────────────────────────────────
interface FactorBarProps {
  label: string;
  value: number;
  color?: string;
}

function FactorBar({ label, value, color = 'var(--green-mid)' }: FactorBarProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: value >= 70 ? 'var(--green-mid)' : value >= 45 ? 'var(--amber)' : 'var(--danger)' }}>
          {value}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${value}%`,
          background: value >= 70 ? 'var(--green-mid)' : value >= 45 ? 'var(--amber)' : 'var(--danger)',
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}

interface TrustFactorPanelProps { factors: TrustFactors }
export function TrustFactorPanel({ factors }: TrustFactorPanelProps) {
  const items: [string, keyof TrustFactors][] = [
    ['M-Pesa consistency', 'mobileMoneyConsistency'],
    ['Co-op repayment', 'cooperativeRepayment'],
    ['Input purchase pattern', 'inputPurchasePattern'],
    ['Production records', 'productionRecords'],
    ['Climate adaptation', 'climateAdaptation'],
    ['Community trust', 'communityTrust'],
  ];
  return (
    <div>
      {items.map(([label, key]) => (
        <FactorBar key={key} label={label} value={factors[key]} />
      ))}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, marginBottom: 2 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
interface EmptyProps { message: string; icon?: React.ReactNode }
export function Empty({ message, icon }: EmptyProps) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
      {icon && <div style={{ marginBottom: 12, opacity: 0.5 }}>{icon}</div>}
      <p style={{ fontSize: 13 }}>{message}</p>
    </div>
  );
}

// ── Climate risk pill ─────────────────────────────────────────
interface ClimateRiskProps { value: number; label?: string }
export function ClimateRisk({ value, label = 'Drought risk' }: ClimateRiskProps) {
  const color = value >= 60 ? '#ef4444' : value >= 35 ? '#f59e0b' : '#1a7a4a';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{value}%</span>
    </div>
  );
}
