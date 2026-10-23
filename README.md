# YADAVYA

A minimal, quiet-luxury online clothing storefront and private management atelier built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Firebase.

---

## 1. Overview & Philosophy

**YADAVYA** is designed around the concept of quiet luxury—calm, spacious, confident, and intentional. Every detail adheres to strict anti-template aesthetics:

- **Strict Palette:** ~90% white (`#FFFFFF`), ~8% subtle cool blue tints (`--surface: #F6F9FC`, `--blue-50: #EEF5FB`), and ~2% deep ink (`#0E1A24`).
- **Typography:** Pure **Instrument Sans** with disciplined tracking and line-height.
- **Architectural Structure:** 1px hairline borders (`--line: #E4EAF0`), generous negative space, zero drop shadows, and sharp rectangular edges (0px to 2px radius).
- **Anti-"Vibe-Coded" Rules:** Zero gradients, zero glassmorphism, zero emojis, zero purple/neon tones, and zero marketing fluff.
- **Dynamic Catalogue:** No products are hardcoded. The catalogue renders with equal elegance whether it contains 0, 1, or 100 garments.

---

## 2. Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components & Dynamic ISR)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS (Theme tokens & Hairline utilities)
- **Animation:** Framer Motion (Calm `cubic-bezier(0.22, 1, 0.36, 1)` easing)
- **Smooth Scrolling:** Lenis (subtle, respecting `prefers-reduced-motion`)
- **State Management:** Zustand with LocalStorage persistence for Shopping Bag
- **Validation:** Zod schemas for products, taxonomy, and checkout
- **Icons:** `lucide-react` wrapped through a single controller with 1.25 stroke width
- **Backend & Auth:** Firebase Free (Spark Plan) — Firebase Auth (Email/Password) & Cloud Firestore

---

## 3. Spark Plan Image URL Architecture

In compliance with the Firebase free (Spark) tier, **Firebase Storage is completely excluded**:
- All imagery (garment covers, hover angles, hero banners, and category covers) uses direct external HTTPS image URLs.
- The admin product manager features:
  - Dynamic URL rows with live thumbnail previews.
  - "Make Cover" and order repositioning.
  - "Paste multiple URLs" bulk importer.
  - Graceful load failure handling displaying an understated typographic fallback rather than broken icons or layout shifts.
- Configured in `next.config.ts` with wildcard remote patterns.

---

## 4. Hidden Admin Atelier (`/mysystem02`)

The management portal is strictly private and hidden:
- **Direct URL:** `/mysystem02` (login), `/mysystem02/dashboard`, `/mysystem02/products`, `/mysystem02/categories`, `/mysystem02/orders`, `/mysystem02/settings`.
- **Zero Hints:** There are no buttons, links, or mentions of the admin portal anywhere on the public storefront.
- **Search Protection:** Configured with `X-Robots-Tag: noindex, nofollow, noarchive` and excluded from both `robots.txt` and `sitemap.xml`.
- **404 Masking:** Unauthenticated visitors attempting to access any sub-route (e.g. `/mysystem02/products`) receive an HTTP 404 Not Found response, rather than a login redirect.
- **Whitelist Security:** Only email addresses specified in `ADMIN_EMAILS` are granted portal authorization.

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ installed

### Environment Configuration
Copy the provided `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Ensure the following variables are present:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBINR7cIBPFXzlmB4LxYUliviiwFzrlJB8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yadavya-1f900.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yadavya-1f900
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=588192130188
NEXT_PUBLIC_FIREBASE_APP_ID=1:588192130188:web:219b905320fd763e5507a9
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-GFHH8C4Q41

ADMIN_EMAILS=admin@yadavya.com,sunny@example.com
NEXT_PUBLIC_ADMIN_EMAILS=admin@yadavya.com,sunny@example.com

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Installation & Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

### Optional Seed Script
To populate the store with 8 sample luxury garments across 3 curated categories:
```bash
npm run seed
```
*(Note: Ensure Firebase security rules permit writes or authenticate appropriately before seeding).*

### Production Build
```bash
npm run build
npm run start
```

---

## 6. Firestore Security Rules

Deploy the included `firestore.rules` file to Cloud Firestore:
- Public read access for published garments, categories, and site settings.
- Public create access for checkout orders.
- Writes to catalog, settings, and orders restricted strictly to authenticated whitelisted admin emails.

---

## 7. Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into Vercel.
3. Configure the Environment Variables from `.env.local`.
4. Deploy. The dynamic routes and ISR revalidation will execute automatically.
