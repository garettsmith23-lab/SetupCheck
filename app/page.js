'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [sym, setSym] = useState('');
  const router = useRouter();

  const go = (ticker) => {
    const t = (ticker || sym).trim().toUpperCase();
    if (!t) return;
    router.push(`/review?ticker=${t}`);
  };

  const placeholderHot5 = Array(5).fill(null);
  const placeholderStocks = Array(8).fill(null);
  const placeholderSectors = [
    'Technology', 'Industrials', 'Energy', 'Financials',
    'Healthcare', 'Discretionary', 'Staples', 'Utilities',
    'Materials', 'Real Estate', 'Communications'
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 60px' }}>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, color: '#888', fontWeight: 700, marginBottom: 8 }}>10BAGR</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 12px', color: '#1a1a1a', lineHeight: 1.1 }}>
          Find your next <span style={{ color: '#1D9E75' }}>10-bagger</span>
        </h1>
        <p style={{ fontSize: 16, color: '#666', margin: '0 auto 28px', maxWidth: 560, lineHeight: 1.5 }}>
          IBD methodology + VCP analysis + live signals. Know in 30 seconds if a stock is buyable.
        </p>

        {/* Search */}
        <div style={{ display: 'flex', gap: 8, maxWidth: 560, margin: '0 auto' }}>
          <input
            type="text"
            value={sym}
            onChange={e => setSym(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && go()}
            placeholder="Enter ticker (e.g. NVDA)"
            style={{ flex: 1, padding: '14px 18px', fontSize: 16, fontWeight: 600, fontFamily: 'monospace', border: '1.5px solid #ddd', borderRadius: 10, background: '#fff', color: '#1a1a1a', outline: 'none' }}
          />
          <button
            onClick={() => go()}
            disabled={!sym.trim()}
            style={{ padding: '14px 28px', fontSize: 15, fontWeight: 700, background: sym.trim() ? '#1a1a1a' : '#ccc', color: '#fff', border: 'none', borderRadius: 10, cursor: sym.trim() ? 'pointer' : 'default' }}
          >
            Run check →
          </button>
        </div>
      </div>

      {/* HOT 5 SETUPS - right under the search */}
      <div style={{ marginTop: 8, background: 'linear-gradient(135deg, #EAF3DE 0%, #f5f4f0 100%)', borderRadius: 14, padding: '20px 24px', border: '1px solid #d4e8c0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#1D9E75', fontWeight: 700 }}>Hot Setups Today</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Strongest 5 right now</div>
            </div>
          </div>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#fff', color: '#633806', fontWeight: 600, border: '1px solid #e5d4a8' }}>Coming soon</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {placeholderHot5.map((_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e5e5e0', borderRadius: 10, padding: '12px 14px', opacity: 0.7 }}>
              <div style={{ height: 10, background: '#f0f0ed', borderRadius: 3, marginBottom: 8, width: '40%' }} />
              <div style={{ height: 18, background: '#e8e8e4', borderRadius: 4, marginBottom: 8, width: '65%' }} />
              <div style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: '#EAF3DE', color: '#27500A', fontWeight: 700, display: 'inline-block' }}>BUY</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP 20 STOCKS */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#1D9E75', fontWeight: 700 }}>Today's Leaders</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#1a1a1a' }}>Top 20 stocks</h2>
          </div>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#FAEEDA', color: '#633806', fontWeight: 600 }}>Coming soon</span>
        </div>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
          Ranked by combined score: RS strength + breakout proximity + Trend Signal state.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {placeholderStocks.map((_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px', opacity: 0.55 }}>
              <div style={{ height: 14, background: '#f0f0ed', borderRadius: 4, marginBottom: 8, width: '60%' }} />
              <div style={{ height: 20, background: '#e8e8e4', borderRadius: 4, marginBottom: 10, width: '45%' }} />
              <div style={{ height: 10, background: '#f0f0ed', borderRadius: 3, width: '80%' }} />
            </div>
          ))}
        </div>
      </div>

      {/* TOP SECTORS */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#BA7517', fontWeight: 700 }}>Sector Rotation</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#1a1a1a' }}>Top sectors</h2>
          </div>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#FAEEDA', color: '#633806', fontWeight: 600 }}>Coming soon</span>
        </div>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
          Ranked by relative strength vs SPY. Click a sector to see the top stocks within it.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {placeholderSectors.map((name, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px', opacity: 0.55, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>#{i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#555', marginTop: 2 }}>{name}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f0ed' }} />
            </div>
          ))}
        </div>
      </div>

      {/* TOP INDUSTRIES (placeholder) */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#A32D2D', fontWeight: 700 }}>Narrow Scope</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#1a1a1a' }}>Top 20 industries</h2>
          </div>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#FAEEDA', color: '#633806', fontWeight: 600 }}>Coming soon</span>
        </div>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
          Industry-level breakdowns using specialized ETFs (semiconductors, biotech, housing, etc.).
        </p>
        <div style={{ background: '#fafafa', border: '1px dashed #ddd', borderRadius: 10, padding: '28px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#999' }}>Industry rankings will appear here</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', marginTop: 60, paddingTop: 20, borderTop: '1px solid #eee' }}>
        <div style={{ fontSize: 11, color: '#999' }}>10Bagr is not financial advice. Always do your own research before investing.</div>
      </div>
    </div>
  );
}
