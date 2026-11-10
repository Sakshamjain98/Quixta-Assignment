import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductView } from "@/components/product/product-view";
import { PRODUCT } from "@/data/product";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Product view", () => {
  it("shows a loading state, then the product from the API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(PRODUCT)));
    render(<ProductView />);

    expect(screen.getByText("Loading product…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Linden shelf" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Linden shelf" })).toBeInTheDocument();
    expect(screen.getByText("$180")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to order" })).toBeInTheDocument();
  });

  it("shows an error with Try again, which requests the product again", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "unavailable" }, 500))
      .mockResolvedValueOnce(jsonResponse(PRODUCT));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ProductView />);

    expect(await screen.findByText("Could not load the product")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "Linden shelf" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith("/api/product", expect.anything());
  });
});
