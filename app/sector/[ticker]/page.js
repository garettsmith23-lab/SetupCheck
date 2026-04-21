'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SectorDetail({ params }) {
  const router = useRouter();
  const ticker = params.ticker?.toUpperCase();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!ticker) return;
    fetch('/api/sectors')
      .then(r => r.json())
      .then(d => {
        const all = [...(d.sectors || []), ...(d.industries || [])];
        const found = all.find(x => x.ticker === ticker);
        if (found) setData(found);
        else setErr('Sector not found');
      })
      .catch(e => setErr(e.message));
  }, [ticker]);

  const rsBadge = (rs) => {
    if (rs > 5) return { bg: '#EAF3DE', color: '#1D9E75', label: 'Strong' };
    if (rs > 0) return { bg: '#F0F7EC', color: '#568A3F', label: 'Leading' };
    if (rs > -5) return { bg: '#FAEEDA', color: '#BA7517', label: 'Lagging' };
    return { bg: '#FCEBEB', color: '#A32D2D', label: 'Weak' };
  };

  if (err) return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 14, color: '#A32D2D' }}>{err}</div>
      <button onClick={() => router.push('/')} style={{ marginTop: 16, padding: '8px 18px', fontSize: 13, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Back to home</button>
    </div>
  );

  if (!data) return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 16px', textAlign: 'center', color: '#999', fontSize: 13 }}>Loading…</div>
  );

  const b = rsBadge(data.rs_blended);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 60px' }}>
      <button onClick={() => router.push('/')} style={{ fontSize: 12, background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: 0, marginBottom: 16 }}>← Back to home</button>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: '#1a1a1a' }}>{data.ticker}</span>
        <span style={{ fontSize: 14, color: '#666', marginLeft: 10 }}>{data.name}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>${data.price}</div>

      <div style={{ background: b.bg, borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: b.color, fontWeight: 700 }}>RS Status</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: b.color, marginTop: 2 }}>{b.label}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#666' }}>Blended RS vs SPY</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: b.color, fontFamily: 'monospace' }}>
              {data.rs_blended > 0 ? '+' : ''}{data.rs_blended}%
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        <Metric label="1-Month RS" value={data.rs_1m} />
        <Metric label="3-Month RS" value={data.rs_3m} />
        <Metric label="6-Month RS" value={data.rs_6m} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 24 }}>
        <Metric label="1-Month Return" value={data.abs_1m} absolute />
        <Metric label="3-Month Return" value={data.abs_3m} absolute />
      </div>

      <div style={{ background: '#f5f4f0', borderRadius: 10, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
          Want to see this ETF's full IBD/VCP checklist and Trend Signal?
        </div>
        <button
          onClick={() => router.push(`/review?ticker=${data.ticker}`)}
          style={{ padding: '10px 18px', fontSize: 14, fontWeight: 700, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Run full checklist on {data.ticker} →
        </button>
      </div>

      <div style={{ background: '#fafafa', border: '1px dashed #ddd', borderRadius: 10, padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#999' }}>Top stocks in this sector coming in Phase 3</div>
      </div>
    </div>
  );
}

function Metric({ label, value, absolute }) {
  const pos = value > 0;
  const color = absolute ? (pos ? '#1D9E75' : '#A32D2D') : (pos ? '#1D9E75' : value > -5 ? '#BA7517' : '#A32D2D');
  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'monospace', marginTop: 2 }}>
        {pos ? '+' : ''}{value}%
      </div>
    </div>
  );
}
