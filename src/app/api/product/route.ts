import { PRODUCT } from "@/data/product";

const SLOW_DELAY_MS = 2000;

export async function GET() {
  const mode = process.env.PRODUCT_API_MODE;

  if (mode === "error") {
    return Response.json({ error: "unavailable" }, { status: 500 });
  }
  if (mode === "slow") {
    await new Promise((resolve) => setTimeout(resolve, SLOW_DELAY_MS));
  }

  return Response.json(PRODUCT);
}
