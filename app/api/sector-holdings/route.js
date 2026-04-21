const HOLDINGS = {
  XLK: ["NVDA", "AAPL", "MSFT", "AVGO", "CRM", "ORCL", "CSCO", "ACN", "IBM", "NOW"],
  XLV: ["LLY", "UNH", "JNJ", "ABBV", "MRK", "TMO", "ABT", "ISRG", "PFE", "AMGN"],
  XLF: ["JPM", "BRK-B", "V", "MA", "BAC", "WFC", "GS", "MS", "AXP", "BLK"],
  XLY: ["AMZN", "TSLA", "HD", "MCD", "LOW", "BKNG", "TJX", "NKE", "SBUX", "CMG"],
  XLC: ["META", "GOOGL", "GOOG", "NFLX", "TMUS", "DIS", "VZ", "T", "CMCSA", "EA"],
  XLI: ["GE", "CAT", "RTX", "UBER", "HON", "UNP", "ETN", "LMT", "BA", "DE"],
  XLP: ["COST", "WMT", "PG", "KO", "PEP", "PM", "MO", "MDLZ", "CL", "TGT"],
  XLE: ["XOM", "CVX", "COP", "WMB", "EOG", "OKE", "SLB", "PSX", "MPC", "VLO"],
  XLU: ["NEE", "SO", "DUK", "CEG", "AEP", "SRE", "D", "PCG", "EXC", "VST"],
  XLRE: ["PLD", "AMT", "WELL", "EQIX", "DLR", "SPG", "PSA", "O", "CCI", "EXR"],
  XLB: ["LIN", "SHW", "ECL", "APD", "FCX", "NEM", "NUE", "DD", "CTVA", "DOW"],
  SMH: ["NVDA", "TSM", "AVGO", "ASML", "AMD", "QCOM", "TXN", "LRCX", "AMAT", "MU"],
  SOXX: ["NVDA", "AVGO", "AMD", "QCOM", "TXN", "LRCX", "AMAT", "KLAC", "MRVL", "MCHP"],
  IGV: ["ORCL", "CRM", "MSFT", "NOW", "ADBE", "PLTR", "INTU", "SNOW", "SHOP", "PANW"],
  CIBR: ["CRWD", "PANW", "CSCO", "FTNT", "ZS", "CHKP", "NET", "OKTA", "S", "QLYS"],
  CLOU: ["MDB", "NET", "ZS", "DDOG", "SNOW", "CFLT", "PAYC", "TEAM", "SHOP", "HUBS"],
  ARKK: ["TSLA", "COIN", "ROKU", "RBLX", "PLTR", "HOOD", "PATH", "DKNG", "U", "TDOC"],
  IBB: ["VRTX", "GILD", "AMGN", "REGN", "MRNA", "ALNY", "BIIB", "ILMN", "INCY", "BMRN"],
  XBI: ["MRNA", "VRTX", "BIIB", "ALNY", "EXEL", "INCY", "UTHR", "ARGX", "NBIX", "HALO"],
  IHI: ["ABT", "ISRG", "TMO", "MDT", "SYK", "BDX", "BSX", "EW", "DXCM", "IDXX"],
  IHF: ["UNH", "ELV", "CI", "CVS", "HCA", "HUM", "CNC", "MCK", "COR", "LH"],
  XHB: ["DHI", "LEN", "NVR", "PHM", "TOL", "MTH", "KBH", "MHO", "TPH", "CCS"],
  ITB: ["DHI", "LEN", "NVR", "PHM", "TOL", "MTH", "BLDR", "KBH", "MAS", "MHK"],
  KRE: ["RF", "CFG", "KEY", "HBAN", "FITB", "CMA", "ZION", "WBS", "PNFP", "MTB"],
  KBE: ["JPM", "BAC", "WFC", "C", "USB", "PNC", "TFC", "MTB", "FITB", "RF"],
  KIE: ["PGR", "ALL", "TRV", "CB", "MET", "PRU", "AIG", "AFL", "HIG", "CINF"],
  XRT: ["AMZN", "HD", "LOW", "COST", "WMT", "TGT", "TJX", "ROST", "BBY", "ORLY"],
  XAR: ["GE", "RTX", "LMT", "BA", "NOC", "GD", "LHX", "TDG", "HWM", "TXT"],
  ITA: ["RTX", "BA", "LMT", "GE", "NOC", "GD", "TDG", "LHX", "HWM", "AXON"],
  JETS: ["UAL", "DAL", "AAL", "LUV", "ALK", "SKYW", "JBLU", "HA", "ALGT", "ULCC"],
  XOP: ["MRO", "APA", "DVN", "FANG", "EOG", "COP", "OXY", "HES", "OVV", "MTDR"],
  OIH: ["SLB", "HAL", "BKR", "WFRD", "TDW", "NOV", "CHX", "LBRT", "RIG", "WHD"],
  TAN: ["FSLR", "ENPH", "NXT", "ARRY", "SHLS", "SEDG", "RUN", "CSIQ", "SPWR", "MAXN"],
  ICLN: ["FSLR", "ENPH", "NXT", "CEG", "BEP", "BEPC", "ORA", "PLUG", "RUN", "AES"],
  URA: ["CCJ", "NXE", "UEC", "DNN", "PDN", "BHP", "LEU", "URG", "UUUU", "LTBR"],
  GDX: ["NEM", "AEM", "GOLD", "FNV", "WPM", "KGC", "GFI", "RGLD", "AU", "PAAS"],
  SIL: ["WPM", "PAAS", "HL", "AG", "FSM", "SVM", "EXK", "CDE", "SSRM", "FR"],
  COPX: ["FCX", "BHP", "SCCO", "TECK", "ERO", "HBM", "IVN", "CS", "LUN", "ANTO"],
  LIT: ["ALB", "SQM", "GGB", "PLL", "LAC", "LTH", "SGML", "LAAC", "AMLI", "PILBF"],
  REMX: ["MP", "ILU", "LYC", "NEO", "REEMF", "TMC", "TMRC", "AVL", "USAR", "UUUU"],
  MOO: ["DE", "ZTS", "TSN", "ADM", "CTVA", "CF", "MOS", "NTR", "BG", "FMC"]
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const etf = searchParams.get("etf")?.toUpperCase();
  if (!etf) return Response.json({ error: "ETF required" }, { status: 400 });

  const tickers = HOLDINGS[etf];
  if (!tickers) return Response.json({ error: "Holdings not available for " + etf }, { status: 404 });

  try {
    const stockData = await Promise.all(
      tickers.map(t => fetchDaily(t).catch(() => null))
    );

    const holdings = tickers.map((ticker, i) => {
      const d = stockData[i];
      if (!d) return { ticker, error: true };
      const { closes, highs, lows } = d;
      const price = closes[closes.length - 1];
      const dma200 = sma(closes, 200);
      const dma50 = sma(closes, 50);
      const ema21Val = ema(closes, 21);
      const st = calcSupertrend(highs, lows, closes, 10, 3.0);
      const m = calcMACD(closes, 12, 26, 9);

      const gate = price > dma200;
      const c1 = price > dma50;
      const c2 = st.isGreen;
      const c3 = m.line > m.signal;
      const sellST = !st.isGreen;
      const sellEMA = price < ema21Val;

      let signal;
      if (!gate) signal = "NO SIGNAL";
      else if (sellST || sellEMA) signal = "SELL";
      else {
        const met = [c1, c2, c3].filter(Boolean).length;
        if (met === 3) signal = "BUY";
        else if (met === 2) signal = "APPROACHING";
        else signal = "NEUTRAL";
      }

      const high52 = Math.max(...highs.slice(-252));
      const pctFromHigh = ((price - high52) / high52) * 100;

      return {
        ticker,
        price: +price.toFixed(2),
        signal,
        conditions_met: [c1, c2, c3].filter(Boolean).length,
        pct_from_high: +pctFromHigh.toFixed(1),
        above_200d: gate
      };
    });

    return Response.json({ etf, holdings });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function fetchDaily(symbol) {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?interval=1d&range=1y&includePrePost=false";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" }, next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("Yahoo " + res.status);
  const json = await res.json();
  const r = json.chart?.result?.[0];
  if (!r?.indicators?.quote?.[0]) throw new Error("No data");
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
  return { line: line[n], signal: signal[n] };
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
    if (i === period) dir[i] = closes[i] > nd ? 1 : -1;
    else dir[i] = dir[i - 1] === 1 && closes[i] < up[i - 1] ? -1
                : dir[i - 1] === -1 && closes[i] > dn[i - 1] ? 1 : dir[i - 1];
  }
  return { isGreen: dir[n - 1] === 1 };
}
