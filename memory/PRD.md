# Easy Wedding Cards — Landing Page PRD

## Original Problem Statement
Build ONLY the landing page/homepage for "Easy Wedding Cards", a modern luxury wedding
invitation website. Emotional idea: "The first glimpse of your wedding." Feel: luxury
wedding editorial × contemporary fashion campaign × premium stationery brand. Two commercial
destinations exist as PLACEHOLDER links only: Shop Wedding Cards (`/shop`, primary) and
Gifts (`/gifts`, secondary). No catalogue/product/cart/checkout/auth/admin/backend.

## Architecture
- Frontend-only: React 19 + Tailwind + Framer Motion + Lenis (smooth scroll).
- No backend, no DB, no auth used for this page.
- Single route `/` → `pages/Landing.jsx`. Commercial links are placeholders (`/shop`, `/gifts`).
- Fonts: Cormorant Garamond (editorial serif) + Montserrat (minimal sans).
- Palette: Warm Ivory #F7F3EF, Soft Cream #FDFBF8, Dusty Blush #E4C9C1, Champagne #D9C2AF,
  Muted Champagne #B89A78, Warm Taupe #8C7767, Deep Espresso #32271F.
- Imagery: custom AI-generated warm-ivory editorial photography (10 images) in `data/landing.js`.

## User Personas
- **Couples** (primary): browsing to buy their wedding invitations.
- **Wedding guests** (secondary): discovering gifts to buy for the couple.

## Core Requirements (static)
Header → Hero → single scroll moment → Featured Wedding Cards → Gifts teaser → Final CTA → Footer.
Restrained motion: ONE scroll-driven hero→collection moment; otherwise subtle fade-ups & hover zoom.
Respect prefers-reduced-motion. Mobile designed (not compressed).

## Implemented (2026-06)
- Header with scroll-aware background, primary "Shop Cards" CTA, mobile menu.
- Asymmetric editorial hero with dominant invitation photo + parallax (scale 1→1.035, drift).
- Scroll moment: 3 sequential lines ("Before the flowers." / "Before the celebration." /
  "They see the invitation.") tied to scroll progress.
- Collection: 6 products (Amara, Celeste, Noa, Elodie, Camille, Aurelia) in an asymmetric
  editorial spread + one detail photo, hover "View Invitation", "Explore All Wedding Cards" CTA → /shop.
- Gifts teaser (compact horizontal) → /gifts.
- Espresso-contrast Final emotional CTA → /shop.
- Minimal espresso footer.
- Verified by testing agent: 100% frontend pass, all sections render, all images load, all links correct, mobile + reduced-motion OK.

## Shop Page (2026-06)
- `/shop` route pulling from `src/data/cards.json` (14 cards).
- Features: category circles + `?category=` URL sync, live search, sort (featured/price asc/desc), favorites with localStorage persistence + favorites-only filter, load-more pagination (PAGE_SIZE 8), quick-view modal (gallery thumbnails, variant selector, size/material, ₹ pricing, Odambady pair logic, WhatsApp order, Share, `#card=` deep-link), fullscreen lightbox with keyboard nav. Themed in ivory/ink/rose; verified 100% (iteration_3).

## Backlog / Remaining
- P0: none for the landing page (scope complete).
- P1: Build `/shop` (wedding card catalogue + product detail).
- P1: Build `/gifts` (gift catalogue for guests).
- P2: About / Contact pages; Instagram feed embed; real product photography swap-in.

## Next Tasks
- On request: implement `/shop` collection & product pages, then `/gifts`.
