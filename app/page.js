'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [sym, setSym] = useState('');
  const [sectors, setSectors] = useState(null);
  const [industries, setIndustries] = useState(null);
  const [hot5, setHot5] = useState(null);
  const [top20, setTop20] = useState(null);
  const [scanLoading, setScanLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/sectors').then(r => r.json()).then(d => {
      if (d.sectors) setSectors(d.sectors);
      if (d.industries) setIndustries(d.industries);
      setLoading(false);
    }).catch(() => setLoading(false));

    fetch('/api/scanner').then(r => r.json()).then(d => {
      if (d.hot5) setHot5(d.hot5);
      if (d.top20) setTop20(d.top20);
      setScanLoading(false);
    }).catch(() => setScanLoading(false));
  }, []);

  const go = (ticker) => {
    const t = (ticker || sym).trim().toUpperCase();
    if (!t) return;
    router.push(`/review?ticker=${t}`);
  };

  const goSector = (ticker) => router.push(`/sector/${ticker}`);

  const rsBadge = (rs) => {
    if (rs > 5) return { bg: '#EAF3DE', color: '#1D9E75', label: 'Strong' };
    if (rs > 0) return { bg: '#F0F7EC', color: '#568A3F', label: 'Leading' };
    if (rs > -5) return { bg: '#FAEEDA', color: '#BA7517', label: 'Lagging' };
    return { bg: '#FCEBEB', color: '#A32D2D', label: 'Weak' };
  };

  const sigStyle = (s) => {
    if (s === 'BUY') return { bg: '#EAF3DE', color: '#1D9E75' };
    if (s === 'APPROACHING') return { bg: '#FAEEDA', color: '#BA7517' };
    if (s === 'SELL') return { bg: '#FCEBEB', color: '#A32D2D' };
    return { bg: '#f0f0ed', color: '#666' };
  };

  const SectorTile = ({ item, rank, onClick }) => {
    const b = rsBadge(item.rs_blended);
    return (
      <div onClick={onClick}
        style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 6 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)'; }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>#{rank}</span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#1a1a1a' }}>{item.ticker}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.25 }}>{item.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: b.bg, color: b.color, fontWeight: 700 }}>{b.label}</span>
          <span style={{ fontSize: 11, color: '#666' }}>{item.rs_blended > 0 ? '+' : ''}{item.rs_blended}% vs SPY</span>
        </div>
      </div>
    );
  };

  const StockTile = ({ item, rank, onClick, compact }) => {
    const ss = sigStyle(item.signal);
    return (
      <div onClick={onClick}
        style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: compact ? '10px 12px' : '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)'; }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          {rank && <span style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>#{rank}</span>}
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: '#1a1a1a', marginLeft: 'auto' }}>{item.ticker}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 6 }}>${item.price}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: ss.bg, color: ss.color }}>{item.signal}</span>
          <span style={{ fontSize: 10, color: '#999' }}>{item.pct_from_high}%</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 60px' }}>
      <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, color: '#888', fontWeight: 700, marginBottom: 8 }}>10BAGR</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 12px', color: '#1a1a1a', lineHeight: 1.1 }}>
          Find your next <span style={{ color: '#1D9E75' }}>10-bagger</span>
        </h1>
        <p style={{ fontSize: 16, color: '#666', margin: '0 auto 28px', maxWidth: 560, lineHeight: 1.5 }}>
          IBD methodology + VCP analysis + live signals. Know in 30 seconds if a stock is buyable.
        </p>
        <div style={{ display: 'flex', gap: 8, maxWidth: 560, margin: '0 auto' }}>
          <input type="text" value={sym} onChange={e => setSym(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && go()}
            placeholder="Enter ticker (e.g. NVDA)"
            style={{ flex: 1, padding: '14px 18px', fontSize: 16, fontWeight: 600, fontFamily: 'monospace', border: '1.5px solid #ddd', borderRadius: 10, background: '#fff', color: '#1a1a1a', outline: 'none' }} />
          <button onClick={() => go()} disabled={!sym.trim()}
            style={{ padding: '14px 28px', fontSize: 15, fontWeight: 700, background: sym.trim() ? '#1a1a1a' : '#ccc', color: '#fff', border: 'none', borderRadius: 10, cursor: sym.trim() ? 'pointer' : 'default' }}>
            Run check →
          </button>
        </div>
      </div>

      {/* HOT 5 - LIVE */}
      <div style={{ marginTop: 8, background: 'linear-gradient(135deg, #EAF3DE 0%, #f5f4f0 100%)', borderRadius: 14, padding: '20px 24px', border: '1px solid #d4e8c0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#1D9E75', fontWeight: 700 }}>Hot Setups Today</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Strongest 5 right now</div>
            </div>
          </div>
          {hot5 && <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#fff', color: '#27500A', fontWeight: 600, border: '1px solid #d4e8c0' }}>Live</span>}
        </div>
        {scanLoading && <div style={{ textAlign: 'center', padding: 20, color: '#999', fontSize: 13 }}>Scanning watchlist… (first load takes ~60 sec)</div>}
        {hot5 && hot5.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {hot5.map((s, i) => <StockTile key={s.ticker} item={s} onClick={() => go(s.ticker)} compact />)}
          </div>
        )}
        {hot5 && hot5.length === 0 && (
          <div style={{ textAlign: 'center', padding: 20, color: '#888', fontSize: 13 }}>No BUY signals in the watchlist right now</div>
        )}
      </div>

      {/* TOP 20 - LIVE */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#1D9E75', fontWeight: 700 }}>Today's Leaders</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#1a1a1a' }}>Top 20 stocks</h2>
          </div>
          {top20 && <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#EAF3DE', color: '#27500A', fontWeight: 600 }}>Live</span>}
        </div>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
          Ranked by combined score: 3-month RS vs SPY (40%) + breakout proximity (30%) + Trend Signal (30%).
        </p>
        {scanLoading && <div style={{ textAlign: 'center', padding: 30, color: '#999', fontSize: 13 }}>Scanning…</div>}
        {top20 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {top20.map((s, i) => <StockTile key={s.ticker} item={s} rank={i + 1} onClick={() => go(s.ticker)} />)}
          </div>
        )}
      </div>

      {/* TOP SECTORS */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#BA7517', fontWeight: 700 }}>Sector Rotation</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#1a1a1a' }}>Top sectors</h2>
          </div>
          {sectors && <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#EAF3DE', color: '#27500A', fontWeight: 600 }}>Live</span>}
        </div>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
          11 S&P sectors ranked by blended RS (1mo + 3mo + 6mo) vs SPY. Click for details.
        </p>
        {loading && <div style={{ textAlign: 'center', padding: 30, color: '#999', fontSize: 13 }}>Loading sector data…</div>}
        {sectors && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {sectors.map((s, i) => <SectorTile key={s.ticker} item={s} rank={i + 1} onClick={() => goSector(s.ticker)} />)}
          </div>
        )}
      </div>

      {/* TOP INDUSTRIES */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#A32D2D', fontWeight: 700 }}>Narrow Scope</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#1a1a1a' }}>Top 20 industries</h2>
          </div>
          {industries && <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#EAF3DE', color: '#27500A', fontWeight: 600 }}>Live</span>}
        </div>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
          Industry ETFs ranked by blended RS vs SPY (semiconductors, biotech, homebuilders, miners, etc.).
        </p>
        {loading && <div style={{ textAlign: 'center', padding: 30, color: '#999', fontSize: 13 }}>Loading industry data…</div>}
        {industries && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {industries.map((s, i) => <SectorTile key={s.ticker} item={s} rank={i + 1} onClick={() => goSector(s.ticker)} />)}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 60, paddingTop: 20, borderTop: '1px solid #eee' }}>
        <div style={{ fontSize: 11, color: '#999' }}>10Bagr is not financial advice. Always do your own research before investing.</div>
      </div>
    </div>
  );
}
