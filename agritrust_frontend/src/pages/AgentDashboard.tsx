// @ts-nocheck
import { useState } from 'react';
// @ts-nocheck
import {
  MapPin, Camera, CheckCircle, AlertTriangle,
  Sprout, UserPlus, ClipboardList
} from 'lucide-react';
// @ts-nocheck
import { farmers, fieldVisits, getFarmerById } from '../data/mockData';
// @ts-nocheck
import { PageHeader, StatCard, ClimateRisk } from '../components/UI';

export function AgentAssignments() {
  const myVisits = fieldVisits;
  const pendingFarmers = farmers.filter(f => !fieldVisits.find(v => v.farmerId === f.id)).slice(0, 3);

  return (
    <div>
      <PageHeader title="My assignments" subtitle="Field Agent · Nyeri & Kirinyaga region" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Visits this month" value={myVisits.length} accent="var(--green-mid)" />
        <StatCard label="Pending visits" value={pendingFarmers.length} accent="var(--amber)" />
        <StatCard label="Farmers onboarded" value={12} sub="this quarter" accent="var(--sky)" />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>Upcoming farm visits</h3>
        {pendingFarmers.map(farmer => (
          <div key={farmer.id} style={{
            display: 'flex', gap: 12, alignItems: 'center',
            padding: '10px', borderRadius: 8, border: '1px solid var(--border)',
            marginBottom: 8, background: 'var(--surface)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--amber-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sprout size={18} color="var(--earth)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{farmer.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <MapPin size={10} style={{ verticalAlign: -1 }} /> {farmer.subcounty}, {farmer.county}
                · {farmer.cropTypes.join(', ')}
              </div>
            </div>
            <button className="btn btn-primary" style={{ fontSize: 11, padding: '5px 10px' }}>
              Start visit
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>Recent visits</h3>
        {myVisits.map(visit => {
          const farmer = getFarmerById(visit.farmerId);
          return (
            <div key={visit.id} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                background: visit.cropCondition === 'excellent' ? 'var(--green-mid)' :
                  visit.cropCondition === 'good' ? '#86efac' :
                  visit.cropCondition === 'fair' ? 'var(--amber)' : 'var(--danger)',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{farmer?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  {visit.visitDate} · {visit.cropCondition} crop condition
                  {visit.photoCaptured && ' · 📷 photo captured'}
                </div>
                <ClimateRisk value={visit.droughtRisk} />
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{visit.notes}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AgentOnboard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', phone: '', county: '', subcounty: '', cropTypes: '', landAcres: '', cooperativeName: '', mpesaLinked: 'yes', gender: 'F', isYouth: false,
  });

  const update = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const fields1 = [
    { key: 'name', label: 'Full name', placeholder: 'e.g. Grace Wanjiku Muthoni' },
    { key: 'phone', label: 'Phone number', placeholder: '07XX XXX XXX' },
    { key: 'county', label: 'County', placeholder: 'e.g. Kirinyaga' },
    { key: 'subcounty', label: 'Sub-county', placeholder: 'e.g. Mwea' },
  ];

  const fields2 = [
    { key: 'cropTypes', label: 'Crops grown', placeholder: 'e.g. Rice, Maize' },
    { key: 'landAcres', label: 'Land size (acres)', placeholder: 'e.g. 2.5' },
    { key: 'cooperativeName', label: 'Cooperative / SACCO', placeholder: 'Leave blank if none' },
  ];

  return (
    <div>
      <PageHeader title="Onboard new farmer" subtitle="Capture farmer data to start building their trust profile" />

      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['Personal info', 'Farm details', 'Confirm'].map((label, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i + 1 <= step ? 'var(--green-mid)' : 'var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: i + 1 <= step ? 'white' : 'var(--text-muted)',
              flexShrink: 0,
            }}>
              {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <div style={{ fontSize: 12, fontWeight: i + 1 === step ? 600 : 400, color: i + 1 === step ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {label}
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? 'var(--green-mid)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      <div className="card">
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Personal information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {fields1.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input
                    value={String(form[f.key as keyof typeof form])}
                    onChange={e => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 8,
                      border: '1px solid var(--border)', fontSize: 12, outline: 'none',
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Gender</label>
                <select
                  value={form.gender}
                  onChange={e => update('gender', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, outline: 'none', background: 'white' }}
                >
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 16 }}>
                <input
                  type="checkbox"
                  id="youth"
                  checked={form.isYouth}
                  onChange={e => update('isYouth', e.target.checked)}
                />
                <label htmlFor="youth" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Youth farmer (under 35)</label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Farm details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {fields2.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input
                    value={String(form[f.key as keyof typeof form])}
                    onChange={e => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 8,
                      border: '1px solid var(--border)', fontSize: 12, outline: 'none',
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>M-Pesa linked?</label>
                <select
                  value={form.mpesaLinked}
                  onChange={e => update('mpesaLinked', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, outline: 'none', background: 'white' }}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Confirm and submit</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {Object.entries(form).map(([k, v]) => (
                <div key={k} style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginTop: 1 }}>{String(v) || '—'}</div>
                </div>
              ))}
            </div>
            <div style={{
              padding: '12px', borderRadius: 8,
              background: 'var(--sky-light)', border: '1px solid #bae6fd',
              display: 'flex', gap: 8,
            }}>
              <AlertTriangle size={14} color="#0369a1" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: '#0369a1' }}>
                Submitting creates a new farmer profile. AgriTrust AI will begin scoring as data accumulates. Thin-file farmers will be matched to a peer pool within 24 hours.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          {step > 1
            ? <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>
            : <div />
          }
          {step < 3
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
            : <button className="btn btn-primary" onClick={() => { setStep(1); setForm({ name: '', phone: '', county: '', subcounty: '', cropTypes: '', landAcres: '', cooperativeName: '', mpesaLinked: 'yes', gender: 'F', isYouth: false }); }}>
                <UserPlus size={14} /> Submit farmer
              </button>
          }
        </div>
      </div>
    </div>
  );
}

export function AgentVisitLog() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    farmerId: '',
    cropCondition: 'good',
    droughtRisk: '20',
    pestRisk: '10',
    notes: '',
    photoCaptured: false,
  });

  const update = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader title="Log field visit" subtitle="Capture field observations to update the farmer's trust profile" />

      <div className="card">
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Select farmer</h3>
            <select
              value={form.farmerId}
              onChange={e => update('farmerId', e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: 8,
                border: '1px solid var(--border)', fontSize: 13, outline: 'none', background: 'white',
                marginBottom: 12,
              }}
            >
              <option value="">— choose farmer —</option>
              {farmers.map(f => <option key={f.id} value={f.id}>{f.name} · {f.county}</option>)}
            </select>

            {form.farmerId && (
              <div style={{ padding: '10px 12px', background: 'var(--green-light)', borderRadius: 8, fontSize: 12, color: 'var(--green-deep)' }}>
                <strong>{getFarmerById(form.farmerId)?.name}</strong> selected.
                Crops: {getFarmerById(form.farmerId)?.cropTypes.join(', ')}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Field observations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Crop condition</label>
                <select
                  value={form.cropCondition}
                  onChange={e => update('cropCondition', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, outline: 'none', background: 'white' }}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Drought risk (%)</label>
                <input type="range" min="0" max="100" value={form.droughtRisk}
                  onChange={e => update('droughtRisk', e.target.value)}
                  style={{ width: '100%' }}
                />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{form.droughtRisk}%</div>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Visit notes</label>
              <textarea
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
                placeholder="Describe crop status, risks observed, farmer discussions…"
                rows={4}
                style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  border: '1px solid var(--border)', fontSize: 12, outline: 'none',
                  resize: 'vertical', lineHeight: 1.6,
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="btn btn-secondary"
                style={{ gap: 6 }}
                onClick={() => update('photoCaptured', !form.photoCaptured)}
              >
                <Camera size={14} />
                {form.photoCaptured ? '✓ Photo captured' : 'Capture photo'}
              </button>
              {form.photoCaptured && <span className="badge badge-green">Attached</span>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 12 }}>Review and submit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                ['Farmer', getFarmerById(form.farmerId)?.name || '—'],
                ['Crop condition', form.cropCondition],
                ['Drought risk', form.droughtRisk + '%'],
                ['Notes', form.notes || 'None'],
                ['Photo', form.photoCaptured ? 'Captured' : 'Not taken'],
              ].map(([k, v]) => (
                <div key={String(k)} style={{ display: 'flex', gap: 12, padding: '8px 10px', background: 'var(--surface)', borderRadius: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 100, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          {step > 1
            ? <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>
            : <div />
          }
          {step < 3
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 1 && !form.farmerId}>
                Continue →
              </button>
            : <button className="btn btn-primary" onClick={() => { setStep(1); }}>
                <ClipboardList size={14} /> Submit visit log
              </button>
          }
        </div>
      </div>
    </div>
  );
}

export function AgentVisits() {
  return (
    <div>
      <PageHeader title="Recent visits" subtitle={`${fieldVisits.length} visits logged`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fieldVisits.map(visit => {
          const farmer = getFarmerById(visit.farmerId);
          return (
            <div key={visit.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: 14 }}>{farmer?.name}</h3>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    <MapPin size={10} style={{ verticalAlign: -1 }} /> {farmer?.county} · {visit.visitDate}
                  </div>
                </div>
                <span className={`badge ${visit.cropCondition === 'excellent' ? 'badge-green' : visit.cropCondition === 'good' ? 'badge-green' : visit.cropCondition === 'fair' ? 'badge-amber' : 'badge-red'}`}>
                  {visit.cropCondition}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <ClimateRisk value={visit.droughtRisk} />
                <ClimateRisk value={visit.pestRisk} label="Pest risk" />
                {visit.photoCaptured && <span className="badge badge-sky"><Camera size={10} /> photo</span>}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{visit.notes}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
