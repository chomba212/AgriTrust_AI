import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, AlertCircle, Loader } from 'lucide-react';
import type { Farmer } from '../data/mockData';

interface XAIPanelProps {
  farmer: Farmer;
  compact?: boolean;
}

const FEATHERLESS_API = 'https://api.featherless.ai/v1/chat/completions';
const MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct';

function buildPrompt(farmer: Farmer): string {
  const f = farmer.trustFactors;
  const poolNote = farmer.peerPoolId
    ? `The farmer has no individual score yet and is placed in Peer Pool ${farmer.peerPoolId}.`
    : `Individual trust score: ${farmer.trustScore}/100.`;

  return `You are the Explainable AI layer for AgriTrust AI, a Graph AI credit scoring platform for Kenyan smallholder farmers. Your job is to write a plain-language lending rationale for a loan officer. Be honest, specific, and concise. Mention real signal sources (M-Pesa, cooperative, peer pool, climate). Do NOT be generic. Use 3–4 sentences maximum.

Farmer: ${farmer.name}
County: ${farmer.county}, ${farmer.subcounty}
Crops: ${farmer.cropTypes.join(', ')}
Land: ${farmer.landAcres} acres
${poolNote}
Repayment cycles completed: ${farmer.repaymentCycles}
Cooperative: ${farmer.cooperativeName || 'None'}
M-Pesa linked: ${farmer.mpesaLinked ? 'Yes' : 'No'}

Trust factors (0–100):
- M-Pesa consistency: ${f.mobileMoneyConsistency}
- Co-op repayment: ${f.cooperativeRepayment}
- Input purchase pattern: ${f.inputPurchasePattern}
- Production records: ${f.productionRecords}
- Climate adaptation: ${f.climateAdaptation}
- Community trust: ${f.communityTrust}

Write a 3–4 sentence lending rationale explaining the trust score or pool placement to a rural loan officer. Be direct and evidence-based. No bullet points. No generic preamble.`;
}

export default function XAIPanel({ farmer, compact = false }: XAIPanelProps) {
  const [explanation, setExplanation] = useState<string>(farmer.explanation || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(!compact);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  async function generateExplanation() {
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(FEATHERLESS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: buildPrompt(farmer) }],
          max_tokens: 200,
          temperature: 0.4,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${res.status}`);
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) setExplanation(text);
      else throw new Error('No response from model');
    } catch (e: any) {
      setError(e.message || 'Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      border: '1px solid #bbf7d0',
      borderRadius: 10,
      overflow: 'hidden',
      background: '#f0fdf4',
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 16px',
          background: 'white',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
          cursor: compact ? 'pointer' : 'default',
        }}
        onClick={compact ? () => setExpanded(!expanded) : undefined}
      >
        <Sparkles size={15} color="var(--green-mid)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-deep)', flex: 1 }}>
          AI Explanation
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 4 }}>
          Powered by Featherless
        </span>
        {compact && (expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </div>

      {expanded && (
        <div style={{ padding: 16 }}>
          {/* API key input */}
          {showKeyInput && !loading && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Featherless API key
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  placeholder="fl-..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  style={{
                    flex: 1, padding: '7px 10px', borderRadius: 6,
                    border: '1px solid var(--border)', fontSize: 12,
                    outline: 'none', background: 'white',
                  }}
                  onKeyDown={e => e.key === 'Enter' && generateExplanation()}
                />
                <button
                  className="btn btn-primary"
                  style={{ padding: '7px 12px', fontSize: 12 }}
                  onClick={generateExplanation}
                >
                  Submit
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Get your key at featherless.ai · Not stored beyond this session
              </p>
            </div>
          )}

          {/* Explanation text */}
          {explanation && !loading && (
            <p style={{
              fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)',
              marginBottom: 12,
              padding: '10px 12px',
              background: 'white',
              borderRadius: 8,
              border: '1px solid #bbf7d0',
            }}>
              {explanation}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', color: 'var(--text-secondary)' }}>
              <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 13 }}>Generating explanation via Featherless AI…</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--danger-light)', marginBottom: 12,
            }}>
              <AlertCircle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: 12 }}
              onClick={generateExplanation}
              disabled={loading}
            >
              <Sparkles size={13} />
              {explanation ? 'Regenerate' : 'Generate explanation'}
            </button>
            {explanation && (
              <button
                className="btn btn-secondary"
                style={{ fontSize: 12 }}
                onClick={() => setExplanation('')}
              >
                Clear
              </button>
            )}
            {showKeyInput && apiKey && (
              <button
                className="btn btn-secondary"
                style={{ fontSize: 12 }}
                onClick={() => setShowKeyInput(false)}
              >
                Hide key
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
