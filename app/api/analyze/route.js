export async function POST(request) {
  const { symbol } = await request.json();

  if (!symbol || typeof symbol !== 'string' || symbol.length > 10) {
    return Response.json({ error: 'Invalid symbol' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  const systemPrompt = 'You are a stock analyst using IBD/MarketSurge methodology and Mark Minervini VCP approach. Research the given stock and return ONLY a JSON object. No markdown, no backticks, no other text. JSON structure: {"symbol":"TICKER","company":"Name","price":0.00,"sector":"Sector","industry":"Industry","market_cap":"$XB","step1_chart":{"score":"X/4","status":"pass","above_200d":{"pass":true,"detail":"text"},"above_50d":{"pass":true,"detail":"text"},"base_forming":{"pass":true,"detail":"text"},"volume_declining":{"pass":true,"detail":"text"}},"step2_rs":{"score":"X/3","status":"pass","rs_trending":{"pass":true,"detail":"text"},"rs_rank":{"pass":true,"detail":"text"},"rs_leading":{"pass":true,"detail":"text"}},"step3_fundamentals":{"score":"X/4","status":"pass","eps_rating":{"pass":true,"detail":"text"},"eps_accelerating":{"pass":true,"detail":"text"},"sales_growth":{"pass":true,"detail":"text"},"smr_quality":{"pass":true,"detail":"text"}},"step4_sector":{"score":"X/4","status":"pass","group_rank":{"pass":true,"detail":"text"},"rotation":{"pass":true,"detail":"text"},"catalyst":{"pass":true,"detail":"text"},"macro":{"pass":true,"detail":"text"}},"step5_trade":{"score":"X/5","status":"pass","entry_zone":{"pass":true,"detail":"$X-$X"},"stop_loss":{"pass":true,"detail":"$X (X%)"},"target_1":{"pass":true,"detail":"$X (+X%)"},"target_2":{"pass":true,"detail":"$X (+X%)"},"rr_ratio":{"pass":true,"detail":"X:1"}},"verdict":{"result":"PASS","trade_type":"Swing","conviction":"High","position_size":"suggested size","summary":"thesis","action":"action"},"total_pass":18,"total_checks":20,"pct_off_high":-5.5,"vol_trend":"Drying up"} Status: pass if most green, warn if yellow flag, fail if critical failure.';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: 'Analyze stock "' + symbol.toUpperCase() + '". Search for current price, moving averages, earnings, next earnings date, analyst targets, industry performance. Return ONLY the JSON.'
        }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(function() { return {}; });
      return Response.json({ error: (err.error && err.error.message) || 'API error ' + res.status }, { status: 502 });
    }

    const json = await res.json();
    var texts = '';
    for (var i = 0; i < json.content.length; i++) {
      if (json.content[i].type === 'text') {
        texts += json.content[i].text + '\n';
      }
    }

    if (!texts.trim()) {
      return Response.json({ error: 'Empty response' }, { status: 502 });
    }

    var clean = texts.replace(/```json/gi, '').replace(/```/gi, '').trim();
    var first = clean.indexOf('{');
    var last = clean.lastIndexOf('}');

    if (first === -1 || last === -1) {
      return Response.json({ error: 'Could not parse analysis — try again' }, { status: 502 });
    }

    var parsed = JSON.parse(clean.substring(first, last + 1));
    return Response.json(parsed);

  } catch (e) {
    return Response.json({ error: e.message || 'Analysis failed' }, { status: 500 });
  }
}
