'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

const MSGS = ['Searching price data...','Checking moving averages...','Analyzing RS line...','Pulling earnings...','Checking catalysts...','Evaluating sector...','Calculating risk/reward...','Building trade plan...'];

export default function ReviewPage() {
  const [sym, setSym] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState('');
  const iv = useRef(null);

  const run = async (s) => {
    const tk = (s || sym).trim().toUpperCase();
    if (!tk) return;
    setSym(tk); setBusy(true); setErr(null); setData(null);
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
          <button onClick={() =>
