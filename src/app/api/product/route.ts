import { PRODUCT } from "@/data/product";

const SLOW_DELAY_MS = 2000;

// Let the CDN serve the product for a minute and refresh it in the background.
// The browser itself doesn't cache it (max-age=0); the client keeps it in the RTK Query cache instead.
const CACHEABLE = { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" };
const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  const mode = process.env.PRODUCT_API_MODE;

  if (mode === "error") {
    return Response.json({ error: "unavailable" }, { status: 500, headers: NO_STORE });
  }
  if (mode === "slow") {
    await new Promise((resolve) => setTimeout(resolve, SLOW_DELAY_MS));
    // Never cache the slow response, or only the first request would actually be slow.
    return Response.json(PRODUCT, { headers: NO_STORE });
  }

  return Response.json(PRODUCT, { headers: CACHEABLE });
}
