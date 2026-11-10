# Linden Shelf — Product Ordering Experience

A responsive product page with an interactive order sheet for **Nord Atelier**, a fictional Scandinavian furniture studio.

Customers can view the Linden Shelf, pick a fulfillment option and extra services, and watch the total update live before confirming their selection.

Built for a Junior Next.js Developer take-home assignment.

## Features

### Product Page
- Responsive navigation. On mobile it collapses into a menu built on the native `<details>` element, so it needs no JavaScript.
- Product image, category, name, description, and price.
- Stock status, delivery and warranty notes, and a specifications list.
- Two-column layout from tablet width up; stacked on mobile.

### Order Sheet
- Opens from **Add to order** in a native HTML `<dialog>` with `showModal()`.
- Layout by screen size:
  - **Mobile (below 768px):** bottom sheet
  - **Tablet (768px–1023px):** centered modal, with the fulfillment and extra choices centered as a group
  - **Desktop (1024px and up):** right-side drawer, with the choices aligned to the start
- Pickup or Delivery, shown as selectable cards built on real radio inputs.
- Optional Assembly and Hardware kit, built on real checkboxes.
- A price breakdown and total that update as soon as the selection changes.

### Business Rules

| Item | Price | Rule |
|---|---:|---|
| Linden Shelf | $180 | Always included |
| Pickup | $0 | Fulfillment, choose one |
| Delivery | $25 | Fulfillment, choose one |
| Assembly | $40 | Available only with Delivery |
| Hardware kit | $30 | Optional with either fulfillment |

- Switching to Pickup unchecks and disables Assembly.
- The Hardware kit stays as the user left it when fulfillment changes.
- Prices are shown in whole US dollars, e.g. `$275`.

### Validation & Confirmation
- Validation uses React Hook Form with a Zod schema.
- Fulfillment is required. Submitting without it shows **"Choose pickup or delivery"** under the Fulfillment group, moves focus there, and keeps the dialog open.
- The schema rejects Assembly with Pickup on its own, even though the UI already disables that combination. That error is attached to the Assembly field.
- A valid submit replaces the form with **"Added to your order"**, which lists the fulfillment, each selected extra, and the total. Extras that weren't selected are not listed.
- **Back to product**, the close button, and Escape all close the dialog and reset the form.

### Accessibility
- Semantic HTML. Radios and checkboxes sit inside `<fieldset>` and `<legend>`, and each one is named by its visible title and described by its price and description.
- The dialog has a title and traps focus. Escape closes it without adding anything, and focus returns to the trigger button afterwards.
- Visible focus states, and touch targets of at least 44px.
- The total is announced to screen readers through an `aria-live` `<output>`.
- Animations are disabled when `prefers-reduced-motion` is set.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Form management | React Hook Form + @hookform/resolvers |
| Validation | Zod 4 |
| Icons | Lucide React |
| Testing | Vitest, React Testing Library, user-event |
| Test environment | jsdom |

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx                  fonts, navbar, footer, metadata
│   ├── page.tsx                    product page
│   └── globals.css                 design tokens, dialog animations
│
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── container.tsx
│   │
│   ├── product/
│   │   ├── product-gallery.tsx
│   │   └── product-details.tsx
│   │
│   ├── order/
│   │   ├── order-dialog.tsx        trigger button + <dialog>
│   │   ├── order-form.tsx          form state, switches to the confirmation
│   │   ├── fulfillment-selector.tsx
│   │   ├── additional-services.tsx
│   │   ├── order-summary.tsx       line items + total (form and confirmation)
│   │   ├── order-confirmation.tsx
│   │   └── dialog-layout.ts        shared title id and content column
│   │
│   └── ui/
│       ├── button.tsx
│       ├── icon-button.tsx
│       ├── option-card.tsx
│       └── field-error.tsx
│
├── config/
│   └── site.ts                     brand name and navigation links
│
├── constants/
│   └── product.ts                  product details and all prices
│
├── features/
│   └── order/
│       ├── order.schema.ts         Zod schema and types
│       └── order.calculations.ts   line items and total
│
├── lib/
│   ├── format-currency.ts
│   └── utils.ts
│
└── tests/
    ├── order-calculations.test.ts
    └── order-dialog.test.tsx
```

## Getting Started

### Prerequisites

- Node.js **22.23.3** (the version used during development; any Node 22 release should work)
- npm 10.9

### Installation

```bash
git clone https://github.com/Sakshamjain98/Quixta-Assignment.git
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run tests

```bash
npm test
```

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Testing

`npm test` runs 15 tests in two files.

**`src/tests/order-dialog.test.tsx`**: component tests with React Testing Library:

1. **Order total** *(required)*: open the dialog, choose Delivery, check Assembly and Hardware kit, and the dialog shows **$275**.
2. **Pickup clears Assembly** *(required)*: choose Delivery, check Assembly, then choose Pickup. Assembly is unchecked and disabled and the total is **$180**. Then check Hardware kit and submit. The confirmation is shown, lists Pickup and Hardware kit with a total of **$210**, and does not mention Assembly.
3. **Validation**: submitting without fulfillment shows "Choose pickup or delivery", and the dialog stays open.
4. **Form reset**: after **Back to product**, reopening the dialog shows a blank form with a total of $180.

**`src/tests/order-calculations.test.ts`**: unit tests for every total in the assignment's table, the schema rules (fulfillment required, Assembly + Pickup rejected), and currency formatting.


## Design Approach

The design is minimal and Scandinavian-inspired: neutral colours, a warm accent, the Geist typeface, and generous spacing. The colours are defined once as Tailwind theme tokens in `globals.css`.

- **One source of prices.** Every label and price lives in `constants/product.ts`. `getLineItems()` builds the breakdown from it, and `getOrderTotal()` adds up those same line items. The form summary, the confirmation, and the tests all use the same functions.
- **Native dialog.** `<dialog>` with `showModal()` provides focus containment, an inert background, and Escape handling, so no dialog library is needed.
- **Reset by unmounting.** The form only exists while the dialog is open, so closing it any way discards its state and errors.


## Image Credits

Product photo by [Annie Spratt on Unsplash](https://unsplash.com/photos/ax-KPVfTYAs), used under the [Unsplash License](https://unsplash.com/license).

## Development & AI Assistance

AI coding assistance was used during this assignment to accelerate implementation and assist with development tasks.

**AI-assisted contributions:**
- Generated the initial project structure and configuration.
- Assisted in developing the product page, reusable UI components, and responsive styling.
- Assisted with order calculation logic and form state handling.
- Generated the initial automated tests and Vitest configuration.
- Prepared the initial README documentation.

**My contributions:**
- Reviewed the assignment requirements and translated them into implementation tasks.
- Defined the UI direction, design approach, and overall application structure.
- Guided the implementation based on the specified business rules and expected user flows.
- Reviewed the generated components, code structure, and validation logic.
- Reviewed and refined the UI for responsiveness, usability, and accessibility.
- Reviewed the test cases and verified the application behaviour locally.
- Prepared the final submission and documentation.

AI assistance was primarily used for code generation and development support. I reviewed and worked on the implementation and take responsibility for the final submitted code.

**Time spent:** Approximately 3 hours, including requirement analysis, AI-assisted implementation, code review, UI refinement, and testing.
