# EarnBot Jupiter Developer Platform Probe

Read-only Jupiter Developer Platform integration proof for a Superteam Frontier submission.

The probe checks:

- Price V3 for SOL, USDC, and JUP valuation context.
- Tokens V2 search and recent-token discovery.
- Swap V2 `/order` in no-sign quote mode.

It does not sign transactions, does not require a private key, does not spend gas, and does not touch user funds.

## Run

```bash
npm install
npm run probe
```

Optional:

```bash
JUPITER_API_KEY=your_key npm run probe
```

## Output

The prepared DX report is in [docs/DX-REPORT.md](docs/DX-REPORT.md).

