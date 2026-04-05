'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>SetupCheck</span>
        <Link href="/review" style={{ padding: '8px 20px', fontSize: 14, fontWeight: 600, background: '#1a1a1a', color: '#fff', borderRadius: 8 }}>Launch tool</Link>
      </nav>
      <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 3, color: '#999', fontWeight: 600, marginBottom: 12 }}>AI-powered stock analysis</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: -1, marginBottom: 20 }}>
          Know if a stock is buyable in 30 seconds
        </h1>
        <p style={{ fontSize: 18, color: '#666', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px' }}>
          Enter any ticker. Get an instant 5-step review using IBD methodology, VCP analysis, and live market data — complete with entry, stop, targets, and position sizing.
        </p>
        <Link href="/review" style={{ display: 'inline-block', padding: '14px 36px', fontSize: 16, fontWeight: 600, background: '#1a1a1a', color: '#fff', borderRadius: 10 }}>
          Analyze a stock free
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginTop: 64, textAlign: 'left' }}>
          {[
            ['Chart structure', 'Checks price vs moving averages, identifies base patterns, and confirms volume dry-up.'],
            ['Relative strength', 'Measures whether the stock is outperforming the market and if the RS line is leading price.'],
            ['Fundamentals', 'Evaluates EPS acceleration, revenue trends, margins, and return on equity.'],
            ['Sector timing', 'Confirms industry group leadership, rotation alignment, and upcoming catalysts.'],
            ['Trade plan', 'Calculates entry, stop loss, targets, risk/reward, and position sizing.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ padding: 20, background: '#fff', borderRadius: 12, border: '0.5px solid #e5e5e0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </main>
      <footer style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: '#aaa' }}>
        SetupCheck is not financial advice. Always do your own research before investing.
      </footer>
    </div>
  );
}
