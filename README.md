# Arlo Clay Studio — E-Commerce Product Page Set

An original e-commerce product page set for a fictional handmade ceramics studio: a shop page where every piece states its size, glaze, use, and price in the same order, a product detail page for the featured Cobalt Rim Dinner Bowl with glaze options and honest stock, and a cart & checkout page where shipping is its own line and the total matches the shop pages.

**Live demo:** https://brittanynation.github.io/arlo-clay-shop/
- Shop: https://brittanynation.github.io/arlo-clay-shop/
- Product: https://brittanynation.github.io/arlo-clay-shop/product.html
- Cart & Checkout: https://brittanynation.github.io/arlo-clay-shop/checkout.html

## Roles this supports

Built to support applications for **Front-End Designer**, **Web Designer**, and **Website Designer** roles — front-end design work: designing websites and building them with real code.

## What it demonstrates

- **E-commerce information architecture** — one job per page: Shop ("compare the pieces"), Product ("is this bowl right, in this glaze"), Checkout ("what will I pay, all-in")
- **Honest pricing** — prices on every card, flat $8 shipping and the free-over-$75 threshold stated on the shop, product, and cart pages, and an order summary whose lines add up in the open ($48 + $18 + $8 = $74)
- **Product detail in plain words** — size in inches and in meals, capacity, care, and an honest handmade note that separates glaze variation (a feature) from chips and cracks (covered)
- **Designed states, not just screens** — a pre-selected glaze, a pre-chosen quantity with the button total doing the maths, an optional gift-wrap add-on, and a restock opt-in that promises no other emails
- **Honest form design** — sample checkout and product forms that state plainly that no real order is placed and no payment is taken
- **Accessibility-minded choices** — contrast-safe cobalt/ink/porcelain pairings, badges and selected states that use words, never colour alone, skip link, `aria-current` navigation, real labels on every field, and native `<details>` FAQs
- **Responsive layout** — product, card, and note grids step down cleanly on small screens, and the checkout summary stacks below the form on mobile
- **Semantic, framework-free build** — hand-written HTML/CSS, one stylesheet, no JavaScript required, no external images; all product visuals are CSS-only

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| Cobalt Glaze | `#274CBC` | Featured piece, primary actions, stat band, prices |
| Peach Clay | `#D96C47` | Warm accents, story highlight, secondary product visuals |
| Sage Glaze | `#A8BFA5` | Soft accents, highlights in dark areas |
| Sand | `#E9DFD3` | Chips, soft surfaces |
| Porcelain | `#FBF7F1` | Page background |
| Ink | `#22201D` | Header, headings, footer, body text |

## Contents

| Page | What it covers |
| --- | --- |
| `index.html` | Shop — hero with shipping promise, at-a-glance trust band, six-piece collection grid with size/glaze/use/price on every card, design notes and palette |
| `product.html` | Product — Cobalt Rim Dinner Bowl detail with glaze options, quantity, gift-wrap add-on, size/care/handmade notes, and pairs-well-with pieces |
| `checkout.html` | Cart & Checkout — delivery form, two-item order summary totalling $74 with shipping as its own line, and plain-word FAQs |

## Workflow note

My design workflow runs in **Sketch and Webflow**, where I design websites and systems visually. This demo is hand-built in HTML/CSS to show the same front-end design thinking — comparison-friendly product cards, honest totals, and plain words — expressed directly in code.

## Files

- `index.html` — shop page for the concept
- `product.html` — product detail page
- `checkout.html` — cart & checkout page
- `styles.css` — design tokens and all component styles
- `og-image.png` — 1200×627 social preview image in the project palette

## Note

This is an original portfolio concept created by Brittany Nation. Arlo Clay Studio is a fictional business; this project is not affiliated with any real ceramics studio. All names, prices, stock counts, and figures shown are sample data, and the site takes no real orders.
