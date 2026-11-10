# Linden shelf: product page and order sheet

A single product page for the **Linden shelf**. The page loads the product and its prices from a small API inside the app. **Add to order** opens an order sheet where you choose fulfillment and extras and watch the total update live. A valid submit shows a confirmation. There is no database, account, or payment.

**Live demo:** _add the Vercel URL here_

## Getting started

Built and tested with Node.js **22.23.3** and npm **10.9.9**.

```bash
git clone https://github.com/Sakshamjain98/Quixta-Assignment.git
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest + React Testing Library (no server needed)
npm run build      # production build
npm start          # serve the production build
npm run lint
```

### API modes

`GET /api/product` reads `PRODUCT_API_MODE` on every request:

| Value | Behaviour |
|---|---|
| `error` | HTTP 500 with `{ "error": "unavailable" }` |
| `slow` | waits 2 seconds, then answers normally |
| anything else / unset | answers normally |

Copy `.env.example` to `.env.local` and set the value there, or pass it inline:

```bash
cp .env.example .env.local
PRODUCT_API_MODE=slow npm run dev    # see "Loading product…"
PRODUCT_API_MODE=error npm run dev   # see "Could not load the product" and Try again
```

## Data fetching: client, cached with RTK Query

The page fetches `/api/product` **on the client** through a Redux Toolkit Query endpoint (`src/store/product-api.ts`):

- **Caching.** The product is fetched once and kept in the Redux store. Any component that asks for it again is served from the cache without another request, and the entry is kept for 5 minutes after the last component using it unmounts.
- **States.** RTK Query provides the loading, error and refetch states, so `product-view.tsx` only chooses between "Loading product…", "Could not load the product" with **Try again** (which calls `refetch()`), and the product.
- **Testing.** Tests mock `fetch` and need no running server.
- **One store per browser session.** The store is created inside a client `StoreProvider`, so it is never shared between server requests.

The route handler returns the module `src/data/product.ts`, which is the only place prices are written. Components get the product as a prop and contain no price numbers. Prices are stored in cents and formatted as whole dollars (`$275`).

## How it works

- **Order rules come from the data.** Each extra has `requires` (a fulfillment code or `null`). One helper, `isExtraAvailable()`, decides:
  - whether an extra's checkbox is enabled
  - which extras get unchecked when fulfillment changes (choosing Pickup unchecks Assembly)
  - what the zod schema rejects
- **Validation.** `createOrderSchema(product)` builds the zod schema from the product:
  - Fulfillment is required. Without it, "Choose pickup or delivery" appears under the Fulfillment group and focus moves there.
  - Assembly with Pickup is rejected even though the UI disables that checkbox. That error appears under Assembly.
- **Totals.** `getSelectedOptions()` returns the chosen fulfillment and extras, and `getOrderTotalCents()` adds them to the shelf price. The live total and the confirmation's summary both use them.
- **Dialog.** A native `<dialog>` opened with `showModal()`. It traps focus, makes the page behind it inert, and closes on Escape without adding anything. The form only exists while the dialog is open, so every way of closing it (Escape, ×, **Back to product**) resets the form.
- **Controls.** Every option is a real radio or checkbox inside a `<fieldset>` with a `<legend>`. The whole row is the label, so the entire row is clickable, and each row is at least 56px tall.

## Performance and security

- **Lazy-loaded form.** The order form (react-hook-form, zod and the order components) is loaded with `React.lazy` only when the dialog opens. It is preloaded when the pointer hovers over the button or the button gets keyboard focus. This cut the JavaScript downloaded on first load from 207 KB to 165 KB (gzipped, measured in Chrome).
- **Static page.** `/` is prerendered at build time. Only `/api/product` runs per request, because it reads `PRODUCT_API_MODE`.
- **API caching.** In normal mode `/api/product` sends `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`, so a CDN can serve it while the browser relies on the RTK Query cache. `error` and `slow` responses send `no-store`, so every request in those modes really fails or waits.
- **Fonts.** Geist is self-hosted through `next/font`, so there is no request to a third-party font server.
- **Security headers** on every response (`next.config.ts`):
  - `Content-Security-Policy`: only same-origin resources, no plugins or framing, and forms can only post to the same origin
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` turning off camera, microphone, geolocation and payment
  - HSTS
  - `X-Powered-By` removed
- **CSP trade-off.** `script-src` allows `'unsafe-inline'` because Next.js injects inline hydration scripts. The stricter alternative, a per-request nonce, would make the page render on every request instead of being served statically. The app renders no user-supplied HTML (React escapes all text), and `npm audit --omit=dev` reports 0 vulnerabilities.

## Design

| Element | Below 768px | 768px and up |
|---|---|---|
| Page content | Full width, 16px padding | Max 960px, centred (16px padding until 1024px) |
| Product layout | Placeholder above the text | Placeholder left (half the width), text right |
| Image placeholder | Grey 4:3 box, `role="img"`, named "Linden shelf" | Same |
| Product name | 24px bold | 32px bold |
| Shelf price | 20px | 24px |
| Add to order | Full width, 48px tall | Fits its text, 48px tall |
| Dialog | Sheet fixed to the bottom, full width | Centred modal, max 480px wide |

Primary buttons use `#1F4D3A` with white text, and error text is `#B42318`.

**Visual design.** The spec table above sets the sizes and colours. On top of that:

- The product sits in a white card with soft green corner washes, a "Wall Shelf" badge, and a placeholder showing an image icon and the product name.
- Each option row has an icon. Selected rows get a light green background, and the two fulfillment options sit side by side in the modal.
- The total sits in a green box.
- The confirmation shows a check badge, separate Fulfillment and Extras sections, and an outlined **Back to product** button.

Where a reference mock-up drew the name or price larger than the spec, I kept the spec sizes (24/32px and 20/24px).

**768px–1023px:** I use the desktop layout from 768px. At that width each column is about 350px wide, which fits the placeholder and the text comfortably. Stacking them would push **Add to order** below the fold on a landscape tablet. A bottom sheet stretched across a tablet screen also leaves very wide option rows, so a centred 480px modal is easier to scan.

## Tests

`npm test` runs 22 tests in four files. None of them need a running server.

- **`src/tests/order-dialog.test.tsx`** renders the dialog with the product data passed in:
  1. **Total** *(required)*: choose Delivery, check Assembly and Hardware kit, and the dialog shows **$275**.
  2. **Pickup clears Assembly** *(required)*: Delivery, then Assembly, then Pickup. Assembly is unchecked and disabled and the total is **$180**. Then Hardware kit and submit: the confirmation is shown, lists Pickup and Hardware kit with **$210**, and does not mention Assembly.
  3. Submitting without fulfillment shows "Choose pickup or delivery", and the dialog stays open.
  4. **Back to product** resets the form.
- **`src/tests/product-view.test.tsx`** mocks `fetch`. It checks the loading state, then the product. It checks that a second component reading the product is served from the cache without another request. It also checks the error state, and that **Try again** requests the product again.
- **`src/tests/product-api.test.ts`** calls the route handler directly in normal, `error`, and `slow` mode, using fake timers for the 2-second wait.
- **`src/tests/order-calculations.test.ts`** covers every total in the brief's table, the schema rules, and money formatting.

jsdom doesn't implement `HTMLDialogElement.showModal()`, so `vitest.setup.ts` adds a small stub. Native Escape and focus behaviour were checked in a real browser at 375px and 1280px.

## Project structure

```text
src/
├── app/
│   ├── api/product/route.ts       GET /api/product (+ PRODUCT_API_MODE)
│   ├── layout.tsx                 wraps the app in StoreProvider
│   ├── page.tsx                   page container (max 960px)
│   └── globals.css                colour tokens, dialog animation
├── data/product.ts                product + prices: the only place prices live
├── store/
│   ├── product-api.ts             RTK Query endpoint (cache, loading, error, refetch)
│   ├── store.ts                   configureStore
│   └── store-provider.tsx         client Provider, one store per session
├── features/order/
│   ├── order.calculations.ts      line items, total, isExtraAvailable()
│   └── order.schema.ts            zod schema built from the product
├── components/
│   ├── product/
│   │   ├── product-view.tsx       loading / error / ready from the RTK Query hook
│   │   └── product-details.tsx    placeholder, name, description, price, button
│   ├── order/
│   │   ├── order-dialog.tsx       button + <dialog>
│   │   ├── order-form.tsx         react-hook-form, swaps to the confirmation
│   │   ├── fulfillment-selector.tsx
│   │   ├── extras-selector.tsx
│   │   ├── order-total.tsx        green total box (form and confirmation)
│   │   ├── option-icon.tsx        maps option codes to icons (visual only)
│   │   ├── order-confirmation.tsx
│   │   └── dialog-ids.ts
│   └── ui/                        button, icon-button, option-card, field-error
├── lib/                           format-currency, cn()
└── tests/
```

## AI tools

**Tools:** Claude Code (Anthropic's coding assistant), used in the terminal.

**What it was used for:**
- Scaffolding the project and configuring Vitest
- The components and styling
- The order calculations and the zod schema
- The route handler, the Redux store setup, and the performance and security changes
- The tests
- A first draft of this README

**What I did:**
- Read the brief and turned it into tasks
- Set the direction and structure
- Reviewed the generated code, the validation rules, and the tests
- Checked the app in the browser at both widths and in each API mode
- Prepared the submission

**One thing I changed or threw away:** the first version it gave me had a right-side drawer on desktop, a stock product photo, and prices hard-coded in a constants file that the components imported. I threw all three away to follow the spec: the dialog is now a centred modal of at most 480px, the image is a grey placeholder, and prices exist only in the module that `/api/product` returns. Components receive them as data.

## Time spent

Approximately 3.5 hours, including requirement analysis, AI-assisted implementation, code review, UI refinement, and testing.
