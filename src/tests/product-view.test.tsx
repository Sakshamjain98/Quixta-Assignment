import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductView } from "@/components/product/product-view";
import { PRODUCT } from "@/data/product";
import { StoreProvider } from "@/store/store-provider";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// Fresh store per render, so cached data never leaks between tests.
const renderView = () => render(<StoreProvider><ProductView /></StoreProvider>);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Product view", () => {
  it("shows a loading state, then the product from the API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(PRODUCT)));
    renderView();

    expect(screen.getByText("Loading product…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Linden shelf" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Linden shelf" })).toBeInTheDocument();
    expect(screen.getByText("$180")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to order" })).toBeInTheDocument();
  });

  it("serves a second mount from the cache without another request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(PRODUCT));
    vi.stubGlobal("fetch", fetchMock);
    render(
      <StoreProvider>
        <ProductView />
        <ProductView />
      </StoreProvider>,
    );

    expect(await screen.findAllByRole("heading", { name: "Linden shelf" })).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows an error with Try again, which requests the product again", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "unavailable" }, 500))
      .mockResolvedValueOnce(jsonResponse(PRODUCT));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderView();

    expect(await screen.findByText("Could not load the product")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "Linden shelf" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith("/api/product");
  });
});
