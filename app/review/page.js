'use client';

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function getJSON(content) {
  if (!content || !Array.isArray(content)) return null;
  const t = content.filter(b => b.type === "text").map(b => b.text).join("\n");
  if (!t.trim()) return null;
  const c = t.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").replace(/<\/?cite[^>]*>/gi, "").trim();
  const a = c.indexOf("{");
  const z = c.lastIndexOf("}");
  if (a === -1 || z === -1) return null;
  return JSON.parse(c.substring(a, z + 1));
}

function stripCites(obj) {
  if (typeof obj === "string") return obj.replace(/<\/?cite[^>]*>/gi, "").replace(/<\/?antml:cite[^>]*>/gi, "");
  if (Array.isArray(obj)) return obj.map(stripCites);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const k in obj) out[k] = stripCites(obj[k]);
    return out;
  }
  return obj;
}

export default function App() {
  const searchParams = useSearchParams();
  const [sym, setSym] = useState("");
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(null);
  const [sig, setSig] = useState(null);
  const [sigErr, setSigErr] = useState(null);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState("");
  const iv = useRef(null);
  const autoRan = useRef(false);

  const steps = ["Searching price data...", "Checking moving averages...", "Analyzing RS...", "Pulling earnings...", "Checking catalysts...", "Evaluating sector...", "Calculating R:R...", "Building trade plan..."];

  const run = async (s) => {
    const tk = (s || sym).trim().toUpperCase();
    if (!tk) return;
    setSym(tk); setBusy(true); setErr(null); setData(null); setSig(null); setSigErr(null);
    let mi = 0; setMsg(steps[0]);
    iv.current = setInterval(() => { mi = (mi + 1) % steps.length; setMsg(steps[mi]); }, 2500);

    fetch("/api/signal?ticker=" + tk)
      .then(r => r.json())
      .then(d => { if (d && !d.error) setSig(d); else setSigErr(d.error || "Signal unavailable"); })
      .catch(() => setSigErr("Signal unavailable"));

    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: tk })
      });
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `API error ${r.status}`); }
      const j = await r.json();
      if (!j.content?.length) throw new Error("Empty response");
      let p; try { p = stripCites(getJSON(j.content)); } catch { throw new Error("Couldn't parse — hit Retry, usually works on 2nd attempt."); }
      if (!p?.symbol) throw new Error("Incomplete data — hit Retry.");
      setData(p);
    } catch (e) { setErr(e.message); }
    finally { clearInterval(iv.current); setBusy(false); }
  };

  // Auto-run when ?ticker= is in URL
  useEffect(() => {
    const urlTicker = searchParams.get("ticker");
    if (urlTicker && !autoRan.current) {
      autoRan.current = true;
      setSym(urlTicker.toUpperCase());
      run(urlTicker);
    }
  }, [searchParams]);

  const clr = s => s === "pass" ? "#1D9E75" : s === "warn" ? "#BA7517" : "#A32D2D";
  const bg = s => s === "pass" ? "#EAF3DE" : s === "warn" ? "#FAEEDA" : "#FCEBEB";
  const tx = s => s === "pass" ? "#27500A" : s === "warn" ? "#633806" : "#791F1F";
  const vm = r => r === "PASS" ? "pass" : r === "FAIL" ? "fail" : "warn";

  const sigClr = s => {
    if (s?.startsWith("BUY")) return "#1D9E75";
    if (s === "APPROACHING" || s?.startsWith("APPROACHING")) return "#BA7517";
    if (s === "SELL") return "#A32D2D";
    return "#888";
  };
  const sigBg = s => {
    if (s?.startsWith("BUY")) return "#EAF3DE";
    if (s === "APPROACHING" || s?.startsWith("APPROACHING")) return "#FAEEDA";
    if (s === "SELL") return "#FCEBEB";
    return "#f5f4f0";
  };

  const Check = ({ item, label }) => item ? (
    <div style={{ display: "flex", gap: 8, margin: "4px 0", fontSize: 13, lineHeight: 1.5 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: item.pass ? "#EAF3DE" : "#FAEEDA", color: item.pass ? "#27500A" : "#633806", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{item.pass ? "\u2713" : "!"}</div>
      <span style={{ color: "var(--color-text-secondary,#555)" }}><strong style={{ color: "var(--color-text-primary,#222)" }}>{label}</strong> — {item.detail}</span>
    </div>
  ) : null;

  const Step = ({ title, step, items }) => step ? (
    <div style={{ borderLeft: `3px solid ${clr(step.status)}`, padding: "12px 16px", margin: "0 0 8px", background: "var(--color-background-primary,#fff)", border: `0.5px solid var(--color-border-tertiary,#e5e5e0)`, borderLeftWidth: 3, borderLeftColor: clr(step.status) }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: bg(step.status), color: tx(step.status), fontWeight: 600 }}>{step.score}</span>
      </div>
      {items.map(([k, l]) => <Check key={k} item={step[k]} label={l} />)}
    </div>
  ) : null;

  const Pill = ({ label, value, highlight }) => (
    <div style={{ background: "var(--color-background-secondary,#f5f4f0)", borderRadius: 8, padding: "7px 12px", flex: 1, minWidth: 68, textAlign: "center" }}>
      <div style={{ fontSize: 10, color: "var(--color-text-tertiary,#999)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: highlight ? clr(vm(value)) : "var(--color-text-primary,#222)" }}>{value}</div>
    </div>
  );

  const SignalCard = () => {
    if (!sig && !sigErr) return null;
    if (sigErr) return (
      <div style={{ background: "#f5f4f0", borderRadius: 10, padding: "12px 16px", margin: "12px 0", fontSize: 12, color: "#888" }}>
        Trend Signal unavailable: {sigErr}
      </div>
    );
    const color = sigClr(sig.signal);
    const background = sigBg(sig.signal);
    return (
      <div style={{ border: "2px solid " + color, borderRadius: 10, padding: "16px 20px", margin: "12px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary,#222)" }}>Trend Signal</span>
          <span style={{ fontSize: 14, fontWeight: 700, padding: "4px 14px", borderRadius: 6, background: background, color: color }}>{sig.signal}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary,#666)", marginBottom: 12 }}>{sig.detail}</div>

        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--color-text-tertiary,#999)", marginBottom: 4, fontWeight: 600 }}>200-DMA Gate</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, fontSize: 13 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: sig.gate.pass ? "#EAF3DE" : "#FCEBEB", color: sig.gate.pass ? "#27500A" : "#791F1F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{sig.gate.pass ? "\u2713" : "\u2717"}</div>
          <span style={{ color: "var(--color-text-secondary,#555)" }}>Price <strong>${sig.price}</strong> vs 200-DMA <strong>${sig.gate.dma200}</strong></span>
        </div>

        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--color-text-tertiary,#999)", marginBottom: 4, fontWeight: 600 }}>Buy Conditions (need 3/3)</div>
        {Object.values(sig.conditions).map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 8, margin: "4px 0", fontSize: 13, lineHeight: 1.5 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: c.pass ? "#EAF3DE" : "#FAEEDA", color: c.pass ? "#27500A" : "#633806", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{c.pass ? "\u2713" : "!"}</div>
            <span style={{ color: "var(--color-text-secondary,#555)" }}><strong style={{ color: "var(--color-text-primary,#222)" }}>{c.label}</strong> — {c.detail}</span>
          </div>
        ))}

        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 11, padding: "5px 10px", borderRadius: 6, background: sig.regime.pass ? "#EAF3DE" : "#FCEBEB", color: sig.regime.pass ? "#27500A" : "#791F1F" }}>
            SPY Regime: ${sig.regime.spyPrice} vs 50-DMA ${sig.regime.spy50} — {sig.regime.pass ? "Healthy" : "Caution"}
          </div>
          {(sig.sell.supertrendRed || sig.sell.belowEMA21) && (
            <div style={{ fontSize: 11, padding: "5px 10px", borderRadius: 6, background: "#FCEBEB", color: "#791F1F" }}>
              Sell: {sig.sell.supertrendRed ? "ST red" : ""}{sig.sell.supertrendRed && sig.sell.belowEMA21 ? " + " : ""}{sig.sell.belowEMA21 ? "< 21-EMA $" + sig.sell.ema21 : ""}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "4px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "var(--color-text-tertiary,#999)", fontWeight: 600 }}>10Bagr</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary,#222)" }}>Setup checklist</div>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary,#999)", marginTop: 2 }}>IBD + VCP + live web search</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input type="text" value={sym} onChange={e => setSym(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && run()}
          placeholder="Ticker (e.g. FIX)" style={{ flex: 1, padding: "10px 14px", fontSize: 16, fontWeight: 600, fontFamily: "monospace", border: "1px solid var(--color-border-secondary,#ccc)", borderRadius: 8, background: "var(--color-background-primary,#fff)", color: "var(--color-text-primary,#222)" }} />
        <button onClick={() => run()} disabled={busy || !sym.trim()}
          style={{ padding: "10px 24px", fontSize: 14, fontWeight: 600, background: busy ? "#aaa" : "var(--color-text-primary,#222)", color: "#fff", border: "none", borderRadius: 8, cursor: busy ? "default" : "pointer" }}>
          {busy ? "Running..." : "Run check"}
        </button>
      </div>

      {busy && (
        <div style={{ textAlign: "center", padding: "44px 0" }}>
          <div style={{ width: 28, height: 28, border: "3px solid #e5e5e0", borderTopColor: "#222", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 14px" }} />
          <div style={{ fontSize: 13, color: "var(--color-text-tertiary,#999)" }}>{msg}</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {err && (
        <div style={{ background: "#FCEBEB", color: "#791F1F", padding: 14, borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
          {err}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => run()} style={{ padding: "7px 18px", fontSize: 13, fontWeight: 600, background: "#222", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Retry</button>
          </div>
        </div>
      )}

      {data && (
        <div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 700, fontFamily: "monospace", color: "var(--color-text-primary,#222)" }}>{data.symbol} </span>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary,#666)" }}>{data.company}</span>
          </div>
          <div style={{ marginBottom: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "baseline" }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>${typeof data.price === "number" ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : data.price}</span>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary,#999)" }}>{data.sector} · {data.industry} · {data.market_cap}</span>
            {data.price_source && <span style={{ fontSize: 10, color: "var(--color-text-tertiary,#999)", fontStyle: "italic" }}>· {data.price_source}</span>}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Pill label="Checks" value={`${data.total_pass}/${data.total_checks}`} />
            <Pill label="% off high" value={data.pct_off_high != null ? `${data.pct_off_high}%` : "N/A"} />
            <Pill label="Volume" value={data.vol_trend || "N/A"} />
            <Pill label="Verdict" value={data.verdict?.result || "N/A"} highlight />
          </div>

          <Step title="Step 1: Chart check" step={data.step1_chart} items={[["above_200d", "Above 200d MA"], ["above_50d", "Above 50d MA"], ["base_forming", "Base forming"], ["volume_declining", "Volume declining"]]} />
          <Step title="Step 2: RS line" step={data.step2_rs} items={[["rs_trending", "RS trending up"], ["rs_rank", "RS rank"], ["rs_leading", "RS leading price"]]} />
          <Step title="Step 3: Fundamentals" step={data.step3_fundamentals} items={[["eps_rating", "EPS growth"], ["eps_accelerating", "EPS accelerating"], ["sales_growth", "Sales growth"], ["smr_quality", "Margins & ROE"]]} />
          <Step title="Step 4: Sector & catalyst" step={data.step4_sector} items={[["group_rank", "Industry group"], ["rotation", "Sector rotation"], ["catalyst", "Earnings catalyst"], ["macro", "Macro factors"]]} />
          <Step title="Step 5: Trade plan" step={data.step5_trade} items={[["entry_zone", "Entry zone"], ["stop_loss", "Stop loss"], ["target_1", "Target 1"], ["target_2", "Target 2"], ["rr_ratio", "Risk/reward"]]} />

          <SignalCard />

          {data.verdict && (
            <div style={{ background: bg(vm(data.verdict.result)), borderRadius: 10, padding: "16px 20px", marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: clr(vm(data.verdict.result)) }}>{data.verdict.result}: {data.verdict.trade_type}</span>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "rgba(0,0,0,0.06)", fontWeight: 600 }}>{data.verdict.conviction} conviction</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "#3d3d3a", margin: "0 0 8px" }}>{data.verdict.summary}</p>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 8 }}>
                <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Action</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{data.verdict.action}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Size: {data.verdict.position_size}</div>
              </div>
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={() => { setData(null); setSym(""); setSig(null); setSigErr(null); autoRan.current = false; }} style={{ padding: "7px 18px", fontSize: 12, background: "transparent", border: "1px solid var(--color-border-tertiary,#ddd)", borderRadius: 6, cursor: "pointer", color: "var(--color-text-secondary,#666)" }}>Analyze another</button>
          </div>
        </div>
      )}

      {!busy && !data && !err && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary,#888)" }}>Enter a ticker and tap Run Check</div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary,#aaa)", marginTop: 3 }}>Uses live web search for current data</div>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            {["FIX", "VIST", "AEIS", "MOD", "VRT", "WWD", "STRL", "FNV", "AROC", "ECG", "BTSG"].map(s => (
              <button key={s} onClick={() => { setSym(s); setTimeout(() => run(s), 50); }}
                style={{ padding: "5px 12px", fontSize: 11, fontFamily: "monospace", background: "transparent", border: "1px solid var(--color-border-tertiary,#ddd)", borderRadius: 5, cursor: "pointer", color: "var(--color-text-secondary,#666)" }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
