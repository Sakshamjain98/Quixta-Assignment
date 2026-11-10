// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/product/route";
import { PRODUCT } from "@/data/product";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("GET /api/product", () => {
  it("returns the product when PRODUCT_API_MODE is unset", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage=60");
    expect(await res.json()).toEqual(PRODUCT);
  });

  it("answers 500 with an error body in error mode", async () => {
    vi.stubEnv("PRODUCT_API_MODE", "error");
    const res = await GET();
    expect(res.status).toBe(500);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(await res.json()).toEqual({ error: "unavailable" });
  });

  it("waits 2 seconds before answering in slow mode", async () => {
    vi.stubEnv("PRODUCT_API_MODE", "slow");
    vi.useFakeTimers();
    let settled = false;
    const pending = GET().then((res) => {
      settled = true;
      return res;
    });

    await vi.advanceTimersByTimeAsync(1999);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    const res = await pending;
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});
