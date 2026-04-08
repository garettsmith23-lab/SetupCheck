'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const MSGS = ['Searching price data...','Checking moving averages...','Analyzing RS line...','Pulling earnings...','Checking catalysts...','Evaluating sector...','Calculating risk/reward...','Building trade plan...'];

function ReviewTool() {
  const searchParams = useSearchParams();
  const [sym, setSym] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState('');
  const [shared, setShared] = useState(false);
  const iv = useRef(null);
  const ran = useRef(false);

  const run = async (s) => {
    const tk = (s || sym).trim().toUpperCase();
    if (!tk) return;
    setSym(tk); setBusy(true); setErr(null); setData(null); setShared(false);
    let mi = 0; setMsg(MSGS[0]);
    iv.current = setInterval(() => { mi = (mi + 1) % MSGS.length; setMsg(MSGS[mi]); }, 2500);
    try {
      const r = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: tk })
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      if (!j.symbol) throw new Error('Incomplete data — try again');
      setData(j);
    } catch (e) { setErr(e.message); }
    finally { clearInterval(iv.current); setBusy(false); }
  };

  useEffect(() => {
    const t = searchParams.get('ticker');
    if (t && !ran.current) {
      ran.current = true;
      setSym(t.toUpperCase());
      run(t.toUpperCase());
    }
  }, [searchParams]);

  const share = () => {
    const url = window.location.origin + '/review?ticker=' + data.symbol;
    navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  const sc = s => s === 'pass' ? '#1D9E75' : s === 'warn' ? '#BA7517' : '#A32D2D';
  const sb = s => s === 'pass' ? '#EAF3DE' : s === 'warn' ? '#FAEEDA' : '#FCEBEB';
  const st = s => s === 'pass' ? '#27500A' : s === 'warn' ? '#633806' : '#791F1F';
  const vm = r => r === 'PASS' ? 'pass' : r === 'FAIL' ? 'fail' : 'warn';

  const CI = ({ item, label }) => item ? (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '4px 0', fontSize: 13, lineHeight: 1.55 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: item.pass ? '#EAF3DE' : '#FAEEDA', color: item.pass ? '#27500A' : '#633806', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{item.pass ? '\u2713' : '!'}</div>
      <span style={{ color: '#555' }}><strong style={{ color: '#222' }}>{label}</strong> — {item.detail}</span>
    </div>
  ) : null;

  const SC = ({ title, step, items }) => step ? (
    <div style={{ borderLeft: '3px solid ' + sc(step.status), padding: '12px 16px', margin: '0 0 8px', background: '#fff', borderTop: '0.5px solid #e5e5e0', borderRight: '0.5px solid #e5e5e0', borderBottom: '0.5px solid #e5e5e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: sb(step.status), color: st(step.status), fontWeight: 600 }}>{step.score}</span>
      </div>
      {items.map(([k, l]) => <CI key={k} item={step[k]} label={l} />)}
    </div>
  ) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8' }}>
      <nav style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ fontSize: 16, fontWeight: 700 }}>SetupCheck</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '8px 16px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, color: '#999', fontWeight: 600 }}>V3 stock review</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Setup checklist</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>IBD + VCP + live web search</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input type="text" value={sym} onChange={e => setSym(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="Ticker (e.g. FIX)" style={{ flex: 1, padding: '10px 14px', fontSize: 16, fontWeight: 600, fontFamily: 'monospace', border: '1px solid #ccc', borderRadius: 8, background: '#fff' }} />
          <button onClick={() => run()} disabled={busy || !sym.trim()}
            style={{ padding: '10px 24px', fontSize: 14, fontWeight: 600, background: busy ? '#aaa' : '#222', color: '#fff', border: 'none', borderRadius: 8, cursor: busy ? 'default' : 'pointer' }}>
            {busy ? 'Running...' : 'Run check'}
          </button>
        </div>

        {busy && (
          <div style={{ textAlign: 'center', padding: '44px 0' }}>
            <div style={{ width: 28, height: 28, border: '3px solid #e5e5e0', borderTopColor: '#222', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }} />
            <div style={{ fontSize: 13, color: '#999' }}>{msg}</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {err && (
          <div style={{ background: '#FCEBEB', color: '#791F1F', padding: 14, borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
            {err}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => run()} style={{ padding: '7px 18px', fontSize: 13, fontWeight: 600, background: '#222', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Retry</button>
            </div>
          </div>
        )}

        {data && (
          <div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'monospace' }}>{data.symbol} </span>
              <span style={{ fontSize: 13, color: '#666' }}>{data.company}</span>
            </div>
            <div style={{ marginBottom: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'baseline' }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>${typeof data.price === 'number' ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : data.price}</span>
              <span style={{ fontSize: 11, color: '#999' }}>{data.sector} · {data.industry} · {data.market_cap}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {[['Checks', data.total_pass + '/' + data.total_checks], ['% off high', data.pct_off_high != null ? data.pct_off_high + '%' : 'N/A'], ['Volume', data.vol_trend || 'N/A'], ['Verdict', data.verdict?.result || 'N/A']].map(([l, v]) => (
                <div key={l} style={{ background: '#f0efea', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 68, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: l === 'Verdict' ? sc(vm(v)) : '#222' }}>{v}</div>
                </div>
              ))}
            </div>
            <SC title="Step 1: Chart check" step={data.step1_chart} items={[['above_200d','Above 200d MA'],['above_50d','Above 50d MA'],['base_forming','Base forming'],['volume_declining','Volume declining']]} />
            <SC title="Step 2: RS line" step={data.step2_rs} items={[['rs_trending','RS trending up'],['rs_rank','RS rank'],['rs_leading','RS leading price']]} />
            <SC title="Step 3: Fundamentals" step={data.step3_fundamentals} items={[['eps_rating','EPS growth'],['eps_accelerating','EPS accelerating'],['sales_growth','Sales growth'],['smr_quality','Margins & ROE']]} />
            <SC title="Step 4: Sector & catalyst" step={data.step4_sector} items={[['group_rank','Industry group'],['rotation','Sector rotation'],['catalyst','Earnings catalyst'],['macro','Macro factors']]} />
            <SC title="Step 5: Trade plan" step={data.step5_trade} items={[['entry_zone','Entry zone'],['stop_loss','Stop loss'],['target_1','Target 1'],['target_2','Target 2'],['rr_ratio','Risk/reward']]} />
            {data.verdict && (
              <div style={{ background: sb(vm(data.verdict.result)), borderRadius: 10, padding: '16px 20px', marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: sc(vm(data.verdict.result)) }}>{data.verdict.result}: {data.verdict.trade_type}</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.06)', fontWeight: 600 }}>{data.verdict.conviction} conviction</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: '#3d3d3a', margin: '0 0 8px' }}>{data.verdict.summary}</p>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 8 }}>
                  <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Action</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{data.verdict.action}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Size: {data.verdict.position_size}</div>
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={share} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, background: shared ? '#1D9E75' : '#222', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s' }}>
                {shared ? '✓ Link copied!' : 'Share this analysis'}
              </button>
              <button onClick={() => { setData(null); setSym(''); setShared(false); }} style={{ padding: '8px 20px', fontSize: 13, background: 'transparent', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', color: '#666' }}>Analyze another</button>
            </div>
          </div>
        )}

        {!busy && !data && !err && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 13, color: '#888' }}>Enter a ticker and tap Run Check</div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Uses live web search for current data</div>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              {['FIX','VIST','AEIS','MOD','VRT','STRL','BTSG','NVDA'].map(s => (
                <button key={s} onClick={() => { setSym(s); setTimeout(() => run(s), 50); }}
                  style={{ padding: '5px 12px', fontSize: 11, fontFamily: 'monospace', background: 'transparent', border: '1px solid #ddd', borderRadius: 5, cursor: 'pointer', color: '#666' }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#bbb' }}>
          Not financial advice. Verify all data independently before trading.
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fafaf8' }} />}>
      <ReviewTool />
    </Suspense>
  );
}
