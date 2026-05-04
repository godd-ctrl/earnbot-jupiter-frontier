const BASE_URL = "https://api.jup.ag";
const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const JUP_MINT = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";

async function getJson(path) {
  const headers = {};
  if (process.env.JUPITER_API_KEY) headers["x-api-key"] = process.env.JUPITER_API_KEY;

  const response = await fetch(`${BASE_URL}${path}`, { headers });
  const text = await response.text();
  if (!response.ok) throw new Error(`Jupiter API ${response.status}: ${sanitize(text)}`);
  return JSON.parse(text);
}

async function probe(name, path) {
  const started = Date.now();
  try {
    const json = await getJson(path);
    return {
      name,
      ok: true,
      statusCode: 200,
      durationMs: Date.now() - started,
      summary: summarize(json)
    };
  } catch (error) {
    return {
      name,
      ok: false,
      statusCode: 0,
      durationMs: Date.now() - started,
      summary: error instanceof Error ? error.message : String(error)
    };
  }
}

function summarize(value) {
  if (Array.isArray(value)) return `array length=${value.length}`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    return `object keys=${keys.slice(0, 8).join(",")}${keys.length > 8 ? ",..." : ""}`;
  }
  return typeof value;
}

function sanitize(value) {
  return value.replace(/sk_[A-Za-z0-9_-]+/g, "sk_[redacted]").slice(0, 500);
}

const calls = [
  ["Price V3 SOL/USDC/JUP", `/price/v3?ids=${SOL_MINT},${USDC_MINT},${JUP_MINT}`],
  ["Tokens V2 search JUP", "/tokens/v2/search?query=JUP"],
  ["Tokens V2 recent", "/tokens/v2/recent?limit=10"],
  ["Swap V2 order quote", `/swap/v2/order?inputMint=${SOL_MINT}&outputMint=${USDC_MINT}&amount=10000000`]
];

const startedAt = new Date();
const results = [];
for (const [name, path] of calls) results.push(await probe(name, path));

console.log(JSON.stringify({
  startedAt,
  finishedAt: new Date(),
  apiKeyConfigured: Boolean(process.env.JUPITER_API_KEY),
  successfulCalls: results.filter((result) => result.ok).length,
  failedCalls: results.filter((result) => !result.ok).length,
  calls: results
}, null, 2));

