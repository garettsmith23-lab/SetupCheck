export const revalidate = 21600; // 6 hours
export const maxDuration = 60;

const WATCHLIST = [
  "AAOI", "AAPL", "AAT", "ABBV", "ACA", "ACAD", "ACMR", "ACVA", "ADEA", "ADI",
  "ADMA", "ADPT", "ADTN", "AEE", "AEIS", "AEM", "AEP", "AEVA", "AEYE", "AFL",
  "AFRM", "AGI", "AGX", "AHR", "AI", "AIG", "AIQ", "AIR", "AIS", "AIVC",
  "ALAB", "ALB", "ALGM", "ALHC", "ALK", "ALKT", "ALNT", "ALNY", "AMAL", "AMAT",
  "AMBA", "AMBQ", "AMD", "AMG", "AMKR", "AMPX", "AMSC", "AMTM", "AMX", "AMZN",
  "ANAB", "ANDG", "ANET", "ANIP", "APA", "APC", "APG", "APH", "APLD", "APP",
  "AR", "ARDT", "ARGT", "ARIS", "ARKG", "ARKK", "ARKQ", "ARKW", "ARKX", "ARLO",
  "ARM", "AROC", "ARQT", "ARRY", "ARW", "ARWR", "AS", "ASB", "ASMB", "ASML",
  "ASPI", "ASTH", "ASTS", "ASX", "ATAT", "ATEC", "ATEN", "ATEYY", "ATI", "ATO",
  "ATRO", "AUGO", "AUPH", "AVGO", "AVT", "AX", "AXGN", "AXTI", "AZZ", "B",
  "BABA", "BAI", "BAP", "BBAI", "BBAR", "BBT", "BBVA", "BE", "BELFB", "BG",
  "BHP", "BILI", "BIRK", "BITQ", "BK", "BKCH", "BKV", "BLLN", "BMY", "BNTX",
  "BOH", "BOIL", "BOOT", "BPOP", "BRBR", "BROS", "BRZE", "BSAC", "BSM", "BSX",
  "BSY", "BTAL", "BTSG", "BURL", "BVN", "BWAY", "BWET", "BWMN", "BWXT", "C",
  "CALX", "CAMT", "CAR", "CARG", "CASY", "CAT", "CATY", "CAVA", "CBOE", "CCB",
  "CCJ", "CCL", "CCU", "CDE", "CDNL", "CDNS", "CECO", "CEG", "CELH", "CENX",
  "CEPV", "CF", "CFG", "CG", "CGAU", "CGNX", "CHAT", "CHEF", "CHWY", "CHYM",
  "CIB", "CIEN", "CIFR", "CLBT", "CLPR", "CLS", "CLSK", "CM", "CMC", "COCO",
  "CODA", "COHN", "COHR", "COPJ", "CORZ", "COST", "CPNG", "CPRX", "CPS", "CPSH",
  "CRDO", "CRS", "CRUS", "CRVS", "CRWV", "CSCO", "CSTM", "CSX", "CTLP", "CTRE",
  "CTVA", "CUBI", "CURE", "CVE", "CVLT", "CVSA", "CVX", "CW", "CWAN", "DASH",
  "DAVE", "DCI", "DDOG", "DELL", "DFAT", "DGII", "DHI", "DINO", "DIOD", "DLO",
  "DOCN", "DOCS", "DORM", "DRS", "DSGX", "DTM", "DY", "EAT", "EBAY", "EBC",
  "ECG", "ECO", "ECPG", "EHC", "EMBJ", "EME", "EMPG", "ENLT", "ENS", "ENSG",
  "ENVA", "EOSE", "EQH", "EQIX", "EQT", "EQWL", "ERII", "ERO", "ES", "ESE",
  "ESI", "ESLT", "ESP", "ET", "ETN", "ETON", "EUAD", "EVR", "EVRG", "EXE",
  "EXLS", "EXPE", "EXTR", "EZPW", "FAST", "FBNC", "FCF", "FCFS", "FCX", "FDX",
  "FE", "FEIM", "FET", "FETH", "FFTY", "FIG", "FIGS", "FIVE", "FIX", "FLEX",
  "FLNC", "FLR", "FLS", "FN", "FNGS", "FNV", "FORM", "FOUR", "FPS", "FRMI",
  "FRNW", "FRO", "FROG", "FSLR", "FSLY", "FTAI", "FTI", "FTK", "FTNT", "FUNC",
  "FUTU", "FVRR", "GCT", "GE", "GEHC", "GEN", "GEV", "GGAL", "GGG", "GH",
  "GHM", "GIL", "GLNG", "GLW", "GLXY", "GMAB", "GMED", "GOOG", "GOOGL", "GRAL",
  "GRDN", "GSIB", "GSK", "GTLB", "GTLS", "GTX", "GVA", "HALO", "HBM", "HEI",
  "HG", "HIMS", "HLIO", "HMH", "HMY", "HNGE", "HNRG", "HOOD", "HPE", "HQH",
  "HQY", "HRMY", "HROW", "HRTG", "HSAI", "HSBC", "HST", "HTHT", "HTZ", "HUBB",
  "HUT", "HWM", "IBB", "IBEX", "IBIT", "IBKR", "IBP", "ICHR", "IDR", "IDXX",
  "IEFA", "IESC", "IGPT", "IGV", "IIIN", "IMAX", "INCY", "INDV", "INFQ", "ING",
  "INGR", "INOD", "INSM", "INSW", "INTC", "INTU", "INVZ", "IONQ", "IOT", "IRDM",
  "IREN", "IRM", "IRMD", "ISBA", "ISRG", "ITA", "ITT", "IVES", "IXJ", "J",
  "JAN", "JAZZ", "JBHT", "JBL", "JBS", "JBTM", "JCI", "JEF", "JETS", "JOBY",
  "JOYY", "JQUA", "KALU", "KALV", "KD", "KEN", "KEX", "KEYS", "KGC", "KGS",
  "KIE", "KLAC", "KLIC", "KNSA", "KRMN", "KRYS", "KTB", "KTOS", "KVYO", "KYIV",
  "LASR", "LB", "LBRDK", "LBRT", "LDOS", "LEU", "LGN", "LGND", "LITE", "LLY",
  "LMAT", "LMB", "LMT", "LOAR", "LQDA", "LRCX", "LSCC", "LSPD", "LTBR", "LTH",
  "LYB", "MAGS", "MAMA", "MANE", "MB", "MCHP", "MDGL", "MDLN", "MDT", "MEC",
  "MEME", "META", "METC", "MGNI", "MIR", "MIRM", "MJ", "MKSI", "MLI", "MMSI",
  "MNSO", "MNST", "MO", "MOD", "MP", "MPAA", "MPLT", "MPTI", "MPWR", "MRCY",
  "MRK", "MRP", "MRVL", "MRX", "MS", "MSFT", "MTSI", "MTUS", "MTZ", "MU",
  "MWA", "MWH", "MXL", "MYRG", "NAGE", "NATL", "NBBK", "NBIS", "NBIX", "NEE",
  "NEM", "NEOV", "NET", "NEXA", "NFG", "NFLU", "NFLX", "NGVC", "NI", "NIC",
  "NLR", "NNE", "NPB", "NPKI", "NRDS", "NRG", "NTGR", "NTRS", "NTSK", "NU",
  "NUE", "NUKZ", "NUTX", "NVA", "NVDA", "NVGS", "NVMI", "NVO", "NVS", "NVT",
  "NWG", "NXT", "OCC", "ODD", "OII", "OKLO", "OKTA", "OLLI", "OMEX", "ONC",
  "ONDS", "ONON", "ONTO", "OOMA", "OPFI", "OR", "ORA", "ORCL", "ORKA", "ORLA",
  "OSW", "OUST", "OWL", "OXY", "P", "PACS", "PAHC", "PANW", "PAR", "PARR",
  "PAY", "PBR", "PBW", "PBYI", "PDFS", "PDLB", "PENG", "PFGC", "PGC", "PGY",
  "PHIN", "PIPR", "PJT", "PKE", "PL", "PLAB", "PLMR", "PLOW", "PLTR", "PNFP",
  "PODD", "POWL", "PPH", "PPHC", "PRCH", "PRDO", "PRIM", "PRM", "PSIX", "PSLV",
  "PTRN", "PWP", "PWR", "Q", "QBTS", "QQQ", "QTUM", "QURE", "QYLD", "RAIL",
  "RAMP", "RBA", "RBC", "RBRK", "RDDT", "RDVT", "RDWR", "REAL", "RELY", "REMX",
  "RGLD", "RGTI", "RIGL", "RIO", "RIOT", "RKLB", "RKT", "RMBS", "RNAC", "ROAD",
  "ROKU", "ROST", "RPRX", "RR", "RRC", "RSI", "RSPM", "RTX", "RUN", "RXO",
  "RY", "RYTM", "S", "SAIL", "SAN", "SANA", "SANM", "SBS", "SCCO", "SE",
  "SEDG", "SEG", "SEI", "SERV", "SEZL", "SFM", "SFST", "SH", "SHAK", "SHLD",
  "SHOC", "SHOP", "SII", "SIMO", "SITM", "SKYW", "SLAB", "SLB", "SMA", "SMBK",
  "SMCI", "SMR", "SMTC", "SN", "SNDK", "SNEX", "SNX", "SOFI", "SOUN", "SPHR",
  "SPRX", "SPXC", "SPYD", "SPYM", "SQM", "SRFM", "SSRM", "SSYS", "STC", "STE",
  "STLD", "STN", "STNE", "STNG", "STRL", "STRT", "STRW", "STT", "STX", "SVM",
  "SXI", "SYM", "SYRE", "TAL", "TAN", "TARS", "TATT", "TBBK", "TCBI", "TCBX",
  "TCOM", "TD", "TDW", "TEAM", "TECK", "TEL", "TEM", "TEN", "TER", "TEX",
  "TFPM", "TGLS", "TGTX", "THR", "TIGO", "TIGR", "TIMB", "TJX", "TKO", "TLN",
  "TMDX", "TNGX", "TNK", "TOST", "TPC", "TPR", "TQQQ", "TRAK", "TRGP", "TRIN",
  "TRMB", "TRNO", "TRS", "TS", "TSEM", "TSLA", "TSM", "TSSI", "TT", "TTAN",
  "TTI", "TTMI", "TTWO", "TVTX", "TW", "TWLO", "UAMY", "UBER", "UGE", "UI",
  "ULS", "UMAC", "UNFI", "UNH", "UNTY", "UPST", "URA", "URBN", "USAC", "USFD",
  "USLM", "UTES", "UTHR", "UTI", "UUUU", "VAL", "VCTR", "VERX", "VFMO", "VG",
  "VIAV", "VICR", "VIK", "VIRT", "VISN", "VIST", "VITL", "VIV", "VRDN", "VRNS",
  "VRT", "VSAT", "VSEC", "VST", "VSTM", "W", "WAB", "WAY", "WBS", "WCC",
  "WDC", "WEAV", "WFRD", "WGS", "WLDN", "WMT", "WOR", "WPM", "WRB", "WSBF",
  "WT", "WULF", "WWD", "XAR", "XLC", "XLV", "XMTR", "XMVM", "XP", "XPO",
  "XYZ", "YOU", "ZION", "ZS", "ZTO", "ZWS"
];

export async function GET() {
  try {
    const spy = await fetchDaily("SPY");
    if (!spy) return Response.json({ error: "Could not fetch SPY" }, { status: 500 });
    const spy3m = pctChange(spy.closes, 63);

    // Batch fetches in chunks of 50 to avoid overwhelming Yahoo
    const BATCH_SIZE = 50;
    const results = [];
    for (let i = 0; i < WATCHLIST.length; i += BATCH_SIZE) {
      const batch = WATCHLIST.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(t => fetchDaily(t).then(d => ({ ticker: t, data: d })).catch(() => ({ ticker: t, data: null })))
      );
      results.push(...batchResults);
    }

    const scored = results
      .filter(r => r.data && r.data.closes.length >= 200)
      .map(r => {
        const { closes, highs, lows } = r.data;
        const price = closes[closes.length - 1];

        // Trend Signal
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

        // Breakout score: how close to 52-week high (0 = at high, -100 = far below)
        const high52 = Math.max(...highs.slice(-252));
        const pctFromHigh = ((price - high52) / high52) * 100; // 0 to negative

        // Breakout component: closer to high = better. Range 0-100
        // -2% from high = 90, -10% = 50, -20% = 0
        const breakoutScore = Math.max(0, Math.min(100, 100 + pctFromHigh * 5));

        // RS component: 3-month outperformance vs SPY. Each 1% over = 5 points, capped 0-100
        const stockChg3m = pctChange(closes, 63);
        const rsVsSpy = stockChg3m - spy3m;
        const rsScore = Math.max(0, Math.min(100, 50 + rsVsSpy * 2.5));

        // Signal component: BUY=100, APPROACHING=70, NEUTRAL=40, SELL=10, NO SIGNAL=0
        const signalScore = signal === "BUY" ? 100 : signal === "APPROACHING" ? 70 : signal === "NEUTRAL" ? 40 : signal === "SELL" ? 10 : 0;

        // Combined score: weighted average
        const combined = (rsScore * 0.4 + breakoutScore * 0.3 + signalScore * 0.3);

        return {
          ticker: r.ticker,
          price: +price.toFixed(2),
          signal,
          rs_3m: +rsVsSpy.toFixed(2),
          pct_from_high: +pctFromHigh.toFixed(1),
          score: +combined.toFixed(1)
        };
      })
      .sort((a, b) => b.score - a.score);

    const buys = scored.filter(s => s.signal === "BUY");
    const hot5 = buys.slice(0, 5);
    const top20 = scored.slice(0, 20);

    return Response.json({
      hot5,
      top20,
      total_scanned: results.length,
      total_with_data: scored.length,
      total_buys: buys.length,
      updated: new Date().toISOString()
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function fetchDaily(symbol) {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?interval=1d&range=1y&includePrePost=false";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } });
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

function pctChange(arr, lookback) {
  const n = arr.length;
  if (n < lookback + 1) return 0;
  return ((arr[n - 1] - arr[n - 1 - lookback]) / arr[n - 1 - lookback]) * 100;
}
