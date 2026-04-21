const SECTORS = [
  { ticker: "XLK", name: "Technology" },
  { ticker: "XLV", name: "Healthcare" },
  { ticker: "XLF", name: "Financials" },
  { ticker: "XLY", name: "Consumer Discretionary" },
  { ticker: "XLC", name: "Communications" },
  { ticker: "XLI", name: "Industrials" },
  { ticker: "XLP", name: "Consumer Staples" },
  { ticker: "XLE", name: "Energy" },
  { ticker: "XLU", name: "Utilities" },
  { ticker: "XLRE", name: "Real Estate" },
  { ticker: "XLB", name: "Materials" }
];

const INDUSTRIES = [
  { ticker: "SMH", name: "Semiconductors" },
  { ticker: "SOXX", name: "Semiconductor Equipment" },
  { ticker: "IGV", name: "Software" },
  { ticker: "CIBR", name: "Cybersecurity" },
  { ticker: "CLOU", name: "Cloud Computing" },
  { ticker: "ARKK", name: "Innovation / Disruptive Tech" },
  { ticker: "IBB", name: "Biotech" },
  { ticker: "XBI", name: "Biotech Equal-Weight" },
  { ticker: "IHI", name: "Medical Devices" },
  { ticker: "IHF", name: "Healthcare Providers" },
  { ticker: "XHB", name: "Homebuilders" },
  { ticker: "ITB", name: "Home Construction" },
  { ticker: "KRE", name: "Regional Banks" },
  { ticker: "KBE", name: "Banks" },
  { ticker: "KIE", name: "Insurance" },
  { ticker: "XRT", name: "Retail" },
  { ticker: "XAR", name: "Aerospace & Defense" },
  { ticker: "ITA", name: "Aerospace & Defense (iShares)" },
  { ticker: "JETS", name: "Airlines" },
  { ticker: "XOP", name: "Oil & Gas Exploration" },
  { ticker: "OIH", name: "Oil Services" },
  { ticker: "TAN", name: "Solar" },
  { ticker: "ICLN", name: "Clean Energy" },
  { ticker: "URA", name: "Uranium" },
  { ticker: "GDX", name: "Gold Miners" },
  { ticker: "SIL", name: "Silver Miners" },
  { ticker: "COPX", name: "Copper Miners" },
  { ticker: "LIT", name: "Lithium & Battery" },
  { ticker: "REMX", name: "Rare Earth" },
  { ticker: "MOO", name: "Agribusiness" }
];

export async function GET() {
  try {
    const allTickers = [...SECTORS, ...INDUSTRIES, { ticker: "SPY", name: "S&P 500" }];
    const results = await Promise.allSettled(allTickers.map(t => fetchDaily(t.ticker)));

    const data = {};
    allTickers.forEach((t, i) => {
      if (results[i].status === "fulfilled") data[t.ticker] = results[i].value;
    });

    const spy = data["SPY"];
    if (!spy) return Response.json({ error: "Could not fetch SPY" }, { status: 500 });

    const spy1m = pctChange(spy, 21);
    const spy3m = pctChange(spy, 63);
    const spy6m = pctChange(spy, 126);

    const rank = (arr) => arr
      .map(t => {
        const d = data[t.ticker];
        if (!d) return null;
        const r1m = pctChange(d, 21) - spy1m;
        const r3m = pctChange(d, 63) - spy3m;
        const r6m = pctChange(d, 126) - spy6m;
        const blended = (r1m + r3m + r6m) / 3;
        const price = d[d.length - 1];
        const abs1m = pctChange(d, 21);
        const abs3m = pctChange(d, 63);
        return {
          ticker: t.ticker,
          name: t.name,
          price: +price.toFixed(2),
          rs_1m: +r1m.toFixed(2),
          rs_3m: +r3m.toFixed(2),
          rs_6m: +r6m.toFixed(2),
          rs_blended: +blended.toFixed(2),
          abs_1m: +abs1m.toFixed(2),
          abs_3m: +abs3m.toFixed(2)
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.rs_blended - a.rs_blended);

    return Response.json({
      sectors: rank(SECTORS),
      industries: rank(INDUSTRIES).slice(0, 20),
      spy: { price: +spy[spy.length - 1].toFixed(2), chg_1m: +spy1m.toFixed(2), chg_3m: +spy3m.toFixed(2) },
      updated: new Date().toISOString()
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function fetchDaily(symbol) {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?interval=1d&range=1y&includePrePost=false";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" }, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Yahoo " + res.status + " for " + symbol);
  const json = await res.json();
  const r = json.chart?.result?.[0];
  if (!r?.indicators?.quote?.[0]) throw new Error("No data for " + symbol);
  const q = r.indicators.quote[0];
  const closes = [];
  let last = 0;
  for (let i = 0; i < q.close.length; i++) {
    closes.push(q.close[i] ?? last);
    if (q.close[i] != null) last = q.close[i];
  }
  return closes;
}

function pctChange(arr, lookback) {
  const n = arr.length;
  if (n < lookback + 1) return 0;
  return ((arr[n - 1] - arr[n - 1 - lookback]) / arr[n - 1 - lookback]) * 100;
}
