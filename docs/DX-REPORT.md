# Jupiter Developer Platform DX Report

## Project

I integrated Jupiter Developer Platform APIs into an existing multi-chain arbitrage and EarnBot stack as a read-only developer-experience probe. The project uses Jupiter Price V3 for SOL-equivalent valuation, Tokens V2 for token discovery/risk context, and Swap V2 `/order` for takerless swap routing inspection. The probe is intentionally zero-cost: it does not sign transactions, does not spend gas, and does not touch user funds.

## Probe Results

Started: 2026-05-04T20:06:39.630Z
Finished: 2026-05-04T20:06:40.281Z
API key configured: no

| Call | OK | Status | Duration | Summary |
| --- | --- | ---: | ---: | --- |
| Price V3 SOL/USDC/JUP | yes | 200 | 193ms | object keys=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v,JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN,So11111111111111111111111111111111111111112 |
| Tokens V2 search JUP | yes | 200 | 98ms | array length=20 |
| Tokens V2 recent | yes | 200 | 68ms | array length=30 |
| Swap V2 order quote | yes | 200 | 292ms | object keys=swapType,inAmount,outAmount,otherAmountThreshold,swapMode,slippageBps,priceImpactPct,routePlan,... |

## What Worked

- Price V3 is simple to integrate and gives enough information for treasury valuation and dashboard display.
- Tokens V2 is directly useful for risk filtering because organic score, verification, liquidity, and audit fields can be combined into a token quality gate.
- Swap V2 `/order` fits agent workflows because it can be probed without signing when a taker is omitted.
- All responses are JSON-native, which made it easy to wire into a CLI and generated report.

## Friction Found

- The developer platform should expose a single copy-paste TypeScript starter that covers Price, Tokens, and a no-sign Swap V2 quote in one file.
- The docs should call out which endpoints work keyless and which require a Developer Platform key at the top of each page.
- Swap V2 /order is excellent for agent probing because takerless calls return quote context without forcing signing, but the docs could make that safer discovery path more prominent.
- Tokens V2 is valuable for arb and risk systems, but examples should show a practical token-risk filter using verification, organic score, liquidity, and audit fields together.
- A machine-readable diagnostics endpoint for API key scope, rate limit, and remaining quota would make agent integrations easier to debug.

## How I Would Improve The Platform

I would add an agent-first quickstart that starts with read-only API calls, then graduates to taker-based order creation, then to signing and `/execute`. That sequence lets developers verify API keys, response schemas, and rate limits before they put a wallet in the loop. I would also expose a diagnostics endpoint that answers: key valid, plan tier, requests remaining, endpoint access, and most recent error category.

## Safety Notes

- No private key or seed phrase is required by this probe.
- No transaction is signed or submitted.
- API keys are read from environment variables and never printed in the report.
- The generated output is suitable for public review without secrets.
