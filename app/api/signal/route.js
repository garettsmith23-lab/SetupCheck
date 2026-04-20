export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker")?.toUpperCase();
  if (!ticker) return Response.json({ error: "Ticker required" }, { status: 400 });

  try {
    const [td, spd] = await Promise.all([fetchDaily(ticker), fetchDaily("SPY")]);
    const { closes, highs, lows } = td;
    const price = closes[closes.length - 1];

    const dma200 = sma(closes, 200);
    const dma50 = sma(closes, 50);
    const ema21Val = ema(closes, 21);
    const st = calcSupertrend(highs, lows, closes, 10, 3.0);
    const m = calcMACD(closes, 12, 26, 9);

    const spyPrice = spd.closes[spd.closes.length - 1];
    const spy50 = sma(spd.closes, 50);
    const regimeOk = spyPrice > spy50;

    const gate = price > dma200;
    const c1 = price > dma50;
    const c2 = st.isGreen;
    const c3 = m.line > m.signal;
    const sellST = !st.isGreen;
    const sellEMA = price < ema21Val;

    let signal, detail;
    if (!gate) {
      signal = "NO SIGNAL";
      detail = "Gate failed \u2014 price $" + price.toFixed(2) + " below 200-DMA $" + dma200.toFixed(2);
    } else if (sellST || sellEMA) {
      signal = "SELL";
      const r = [];
      if (sellST) r.push("Supertrend flipped red");
      if (sellEMA) r.push("Close $" + price.toFixed(2) + " below 21-EMA $" + ema21Val.toFixed(2));
      detail = r.join("; ");
    } else {
      const met = [c1, c2, c3].filter(Boolean).length;
      if (met === 3) {
        signal = "BUY";
        detail = "All 3 conditions aligned: Close > 50-DMA, Supertrend green, MACD bullish";
      } else if (met === 2) {
        signal = "APPROACHING";
        const miss = [];
        if (!c1) miss.push("Close < 50-DMA");
        if (!c2) miss.push("Supertrend not green");
        if (!c3) miss.push("MACD bearish");
        detail = "2/3 aligned \u2014 missing: " + miss.join(", ");
      } else {
        signal = "NEUTRAL";
        detail = "Only " + met + "/3 conditions met";
      }
    }

    if (!regimeOk && (signal === "BUY" || signal === "APPROACHING")) {
      signal += "*";
      detail += " (caution: SPY below its 50-DMA)";
    }

    return Response.json({
      ticker,
      signal,
      detail,
      price: +price.toFixed(2),
      gate: { pass: gate, dma200: +dma200.toFixed(2) },
      conditions: {
        aboveDMA50: { pass: c1, label: "Close > 50-DMA", detail: "$" + price.toFixed(2) + " vs $" + dma50.toFixed(2) },
        supertrendGreen: { pass: c2, label: "Supertrend", detail: c2 ? "Green \u2014 support $" + st.value.toFixed(2) : "Red \u2014 resistance $" + st.value.toFixed(2) },
        macdBullish: { pass: c3, label: "MACD > Signal", detail: m.line.toFixed(3) + " vs " + m.signal.toFixed(3) }
      },
      sell: { supertrendRed: sellST, belowEMA21: sellEMA, ema21: +ema21Val.toFixed(2) },
      regime: { pass: regimeOk, spyPrice: +spyPrice.toFixed(2), spy50: +spy50.toFixed(2) }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function fetchDaily(symbol) {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?interval=1d&range=1y&includePrePost=false";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" }, next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Yahoo Finance returned " + res.status + " for " + symbol);
  const json = await res.json();
  const r = json.chart?.result?.[0];
  if (!r?.indicators?.quote?.[0]) throw new Error("No data for " + symbol);
  const q = r.indicators.quote[0];
  const closes = [], highs = [], lows = [];
  let lc = 0, lh = 0, ll = 0;
  for (let i = 0; i < q.close.length; i++) {
    closes.push(q.close[i] ?? lc); highs.push(q.high[i] ?? lh); lows.push(q.low[i] ?? ll);
    if (q.close[i] != null) lc = q.close[i];
    if (q.high[i] != null) lh = q.high[i];
    if (q.low[i] != null) ll = q.low[i];
  }
  return { closes, highs, lows };
}

function sma(data, period) {
  if (data.length < period) return data[data.length - 1];
  let s = 0; for (let i = data.length - period; i < data.length; i++) s += data[i];
  return s / period;
}

function ema(data, period) {
  const k = 2 / (period + 1);
  let e = data[0];
  for (let i = 1; i < data.length; i++) e = data[i] * k + e * (1 - k);
  return e;
}

function emaSeries(data, period) {
  const k = 2 / (period + 1);
  const out = [data[0]];
  for (let i = 1; i < data.length; i++) out.push(data[i] * k + out[i - 1] * (1 - k));
  return out;
}

function calcMACD(closes, fast, slow, sig) {
  const ef = emaSeries(closes, fast);
  const es = emaSeries(closes, slow);
  const line = ef.map((v, i) => v - es[i]);
  const signal = emaSeries(line, sig);
  const n = line.length - 1;
  return { line: line[n], signal: signal[n], hist: line[n] - signal[n] };
}

function calcSupertrend(highs, lows, closes, period, factor) {
  const n = closes.length;
  const tr = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    tr[i] = Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1]));
  }
  const atr = new Array(n).fill(0);
  let sum = 0;
  for (let i = 1; i <= period && i < n; i++) sum += tr[i];
  if (period < n) atr[period] = sum / period;
  for (let i = period + 1; i < n; i++) atr[i] = (atr[i - 1] * (period - 1) + tr[i]) / period;

  const up = new Array(n).fill(0);
  const dn = new Array(n).fill(0);
  const dir = new Array(n).fill(1);

  for (let i = period; i < n; i++) {
    const hl2 = (highs[i] + lows[i]) / 2;
    let nu = hl2 - factor * atr[i];
    let nd = hl2 + factor * atr[i];
    if (i > period) {
      if (closes[i - 1] > up[i - 1]) nu = Math.max(nu, up[i - 1]);
      if (closes[i - 1] < dn[i - 1]) nd = Math.min(nd, dn[i - 1]);
    }
    up[i] = nu; dn[i] = nd;
    if (i === period) { dir[i] = closes[i] > nd ? 1 : -1; }
    else {
      dir[i] = dir[i - 1] === 1 && closes[i] < up[i - 1] ? -1
             : dir[i - 1] === -1 && closes[i] > dn[i - 1] ? 1
             : dir[i - 1];
    }
  }
  const last = n - 1;
  return { value: dir[last] === 1 ? up[last] : dn[last], direction: dir[last], isGreen: dir[last] === 1 };
}
