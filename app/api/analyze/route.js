export async function POST(request) {
  const { symbol } = await request.json();

  if (!symbol || typeof symbol !== 'string' || symbol.length > 10) {
    return Response.json({ error: 'Invalid symbol' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  const systemPrompt = `You are a stock analyst using IBD/MarketSurge methodology and Mark Minervini's VCP approach. Research the given stock and return ONLY a JSON object (no markdown, no backticks, no other text).

CRITICAL DATA RULES — follow these or the analysis is worthless:
1. You MUST search the web for the current price. Do NOT guess or use training data. The price must come from a source dated within the last 2 trading days.
2. You MUST search specifically for the stock's 50-day and 200-day simple moving averages. Search queries like "[TICKER] 50 day moving average" and "[TICKER] 200 day SMA". Do NOT infer MAs from "the stock is in an uptrend" type commentary — get the actual numbers.
3. In every "detail" field for chart checks, include the ACTUAL NUMBERS you found. Example: "Price $142.30 vs 50d MA $138.50 — above by 2.7%". If you cannot find a real number, set pass:false and write "Could not verify — [what you searched]".
4. If you cannot verify the current price from a fresh source, set step1_chart.status to "warn" and note it in the verdict summary.
5. Never fabricate moving average values. It is better to mark something unverified than to guess.
6. Do NOT include any citation tags like <cite> or  in any field. Return plain text only.

Today's date context: it is currently April 2026. Search for the most recent trading session data. Do not assume any specific market conditions — let the searches tell you what's happening.

JSON structure:
{"symbol":"TICKER","company":"Name","price":0.00,"price_source":"e.g. Yahoo Finance Apr 20","sector":"Sector","industry":"Industry","market_cap":"$XB","step1_chart":{"score":"X/4","status":"pass","above_200d":{"pass":true,"detail":"Price $X vs 200d $Y — above/below by Z%"},"above_50d":{"pass":true,"detail":"Price $X vs 50d $Y — above/below by Z%"},"base_forming":{"pass":true,"detail":"text"},"volume_declining":{"pass":true,"detail":"text"}},"step2_rs":{"score":"X/3","status":"pass","rs_trending":{"pass":true,"detail":"text"},"rs_rank":{"pass":true,"detail":"text"},"rs_leading":{"pass":true,"detail":"text"}},"step3_fundamentals":{"score":"X/4","status":"pass","eps_rating":{"pass":true,"detail":"text"},"eps_accelerating":{"pass":true,"detail":"text"},"sales_growth":{"pass":true,"detail":"text"},"smr_quality":{"pass":true,"detail":"text"}},"step4_sector":{"score":"X/4","status":"pass","group_rank":{"pass":true,"detail":"text"},"rotation":{"pass":true,"detail":"text"},"catalyst":{"pass":true,"detail":"text"},"macro":{"pass":true,"detail":"text"}},"step5_trade":{"score":"X/5","status":"pass","entry_zone":{"pass":true,"detail":"$X-$X"},"stop_loss":{"pass":true,"detail":"$X (X%)"},"target_1":{"pass":true,"detail":"$X (+X%)"},"target_2":{"pass":true,"detail":"$X (+X%)"},"rr_ratio":{"pass":true,"detail":"X:1"}},"verdict":{"result":"PASS","trade_type":"Swing","conviction":"High","position_size":"$X for $200K acct","summary":"thesis","action":"action"},"total_pass":18,"total_checks":20,"pct_off_high":-5.5,"vol_trend":"Drying up"}

Status: "pass" if most green AND data verified, "warn" if yellow flag OR data uncertain, "fail" if critical failure. pass:true=green, pass:false=yellow/red flag.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 6000,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [
          {
            role: 'user',
            content: `Analyze stock "${symbol.toUpperCase()}". Search for current price, 50-day moving average, 200-day moving average, earnings, next earnings date, analyst targets, industry performance. Return ONLY the JSON object with no citation tags.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err.error?.message || 'API error' }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
