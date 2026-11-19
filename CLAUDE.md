# Adnan Electronics Household website (Datix AI web client)

Context file for Claude on any PC. Read this first. Update Status, Next steps and the Progress log at the end of every session.
GitHub: datixai/electricappliancesweb (private work repo).

## What it is
Dubai kitchen appliance shop (client via WhatsApp) wants a full REDESIGN of his existing site sliverscriest.com (old developer gone, domain access unclear). Design reference he sent: thesuncart.com (take layout ideas only, never copy its brand, text or images). Categories: Air fryers, Blenders, Choppers, Juicers, Spice grinders, Stoves, Kettles and tea makers. Also wants an invoice template for his phone (not built yet). Home page first for his approval.
Scope, domain risk and the quote: docs/analysis.md. Chat notes: docs/client_chat.md.

## Status (19 Nov 2026)
- v1 built in site/ (Next.js 15 App Router, plain CSS, no database):
  - Storefront: top bar, logo (SVG "A" monogram, name "Adnan Electronics Household" + Persian "لوازم خانگی", set in site/lib/site.js and components/ui.js), search, category nav, hero with product collage, category tiles, best sellers, wholesale banner, per-category rows, category pages, product page with gallery and "Order on WhatsApp", search page, floating WhatsApp button (right side).
  - Admin at /admin: password login, add / edit / delete products, choose category, upload several photos, mark as best seller.
  - 29 seed products from the client's posters in site/data/products.json, photos in site/public/products/pN.jpg (pN = Nth image of client_files/images in Python sorted() order).
- Quote not sent yet (suggested $700 package, see analysis). English only so far.

## How it works
- Products live in site/data/products.json. Admin uploads go to site/data/uploads (gitignored) and are served by /api/img/<name>.
- Admin password: ADMIN_PASSWORD in site/.env.local (gitignored, not in GitHub). On a new PC copy site/.env.example to site/.env.local and set a password.
- Needs a host with a writable disk (VPS or Node hosting). Vercel would NOT keep uploaded products; switch to a database + image storage if hosting there.
- Contact settings (WhatsApp number, address, categories): site/lib/site.js.

## Run
```
cd site
npm install
npm run dev      # http://localhost:3000 , admin at /admin
npm run build && npm start   # production
```

## Folders
- client_files/images/   all 45 client images (NOT in git: same files are in site/public/products as p1-p45)
- docs/                  chat notes and analysis / quote
- site/                  the Next.js website

## Next steps
1. Send the home page to the client for approval, send the quote, get 50% advance.
2. Confirm domain registrar access, then plan hosting in the client's name.
3. Arabic version, invoice maker for his phone, clean product photos (posters have text on them).

## Rules
- No em or en dashes anywhere. Keep this project's files only in this folder.
- Git: commit as Ahmed's local identity, no Claude attribution, ask before every push.

## Progress log
- 2026-11-19: Project folder set up, client chats analysed, quote suggested. Built Next.js site v1 with admin panel and pushed to GitHub.
- 2026-11-19: Site name changed from Silvers Criest to Adnan Electronics Household (لوازم خانگی) at the client's request. Silvers Criest stays as a product brand.
- 2026-11-19: New logo: gold house roof + white "A" with a lightning bolt crossbar (home + electronics), navy badge. Files in site/public/brand (emblem.svg/png, logo-horizontal.svg/png), favicon site/app/icon.svg, React version Emblem/Logo in components/ui.js.
