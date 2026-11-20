# Adnan Electronics Household website (Datix AI web client)

Context file for Claude on any PC. Read this first. Update Status, Next steps and the Progress log at the end of every session.
GitHub: datixai/electricappliancesweb (private work repo).

## What it is
Dubai kitchen appliance shop (client via WhatsApp) wants a full REDESIGN of his existing site sliverscriest.com (old developer gone, domain access unclear). Design reference he sent: thesuncart.com (take layout ideas only, never copy its brand, text or images). Categories: Air fryers, Blenders, Choppers, Juicers, Spice grinders, Stoves, Kettles and tea makers. Also wants an invoice template for his phone (not built yet). Home page first for his approval.
Scope, domain risk and the quote: docs/analysis.md. Chat notes: docs/client_chat.md.

## Status (20 Nov 2026)
- v1 built in site/ (Next.js 15 App Router, plain CSS, no database):
  - Storefront: responsive header, logo (SVG "A" monogram, name "Adnan Electronics Household" + Persian "لوازم خانگی", set in site/lib/site.js and components/ui.js), search, category navigation, redesigned homepage, category pages, product page with gallery and "Order on WhatsApp", search page, floating WhatsApp button (right side).
  - Admin at /admin: password login, add / edit / delete products, choose category, upload several photos, mark as best seller.
  - 29 seed products from the client's posters in site/data/products.json, photos in site/public/products/pN.jpg (pN = Nth image of client_files/images in Python sorted() order).
- Homepage redesign complete: refreshed hero with an automatic product carousel, category and featured product layouts, simpler product cards, GCC delivery coverage, business footer, and FAQ. The carousel includes manual controls, hover and focus pause, and reduced-motion support. The hero image now fills its panel with cover fitting. Card and product-detail prices share demonstration values and must be confirmed before publishing. No review data is available, so no reviews are shown.
- v3 look (20 Nov 2026), same principles as D:/TheLuxeOrganization: /shop page with a centred intro and a full-width photo mosaic of the 7 categories (dark overlay, spaced capital labels, text and gold Discover on hover), category pages with a zooming photo banner and an Other categories strip, richer product cards (category badge, best seller flag, brand, 2 features, More info button), Playfair Display headings, deep ink + champagne gold colours, 4-column footer with Developed by Datix AI linking to datixai.com. Styles in site/app/theme.css (loaded after globals.css), components CategoryMosaic and PageHero in components/ui.js.
- 20 Nov 2026 (later): storefront pages moved into site/app/(site)/ with their own layout (header, footer, WhatsApp float); /admin now has its own clean layout and styles (site/app/admin/admin.css): login card, stats, sticky add/edit form with photo previews, product list with search and category tabs. Home hero rebuilt (components/HeroSlider.js): split layout with a photo panel cross-fading 4 lifestyle photos (p21, p41, p13, p14) using plain <img> (next/image left the panel blank). Home categories now use the Luxe photo mosaic (CategoryMosaic).
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
1. Review the redesigned homepage with the client, confirm product prices and hero image crop, send the quote, and get 50% advance.
2. Confirm domain registrar access, then plan hosting in the client's name.
3. Arabic version, invoice maker for his phone, clean product photos (posters have text on them).

## Rules
- No em or en dashes anywhere. Keep this project's files only in this folder.
- Git: commit as Ahmed's local identity, no Claude attribution, ask before every push.

## Progress log
- 2026-11-19: Project folder set up, client chats analysed, quote suggested. Built Next.js site v1 with admin panel and pushed to GitHub.
- 2026-11-19: Site name changed from Silvers Criest to Adnan Electronics Household (لوازم خانگی) at the client's request. Silvers Criest stays as a product brand.
- 2026-11-19: New logo: gold house roof + white "A" with a lightning bolt crossbar (home + electronics), navy badge. Files in site/public/brand (emblem.svg/png, logo-horizontal.svg/png), favicon site/app/icon.svg, React version Emblem/Logo in components/ui.js.
- 2026-11-20: Redesigned the storefront homepage and shared product cards, added UAE and GCC delivery messaging, an FAQ, Instagram footer link, and polished responsive header and footer. Reviews omitted because no genuine review data exists.
- 2026-11-20: Added an accessible, responsive hero product carousel with four catalog-based slides, 4.5-second autoplay, manual controls, hover and focus pause, and reduced-motion support.
- 2026-11-20: Removed the header WhatsApp button and hero CTAs, and added easy-to-update demonstration AED prices to product cards.
- 2026-11-20: Reused the shared product price formatter on product details so each detail page matches its listing cards.
- 2026-11-20: Updated the main hero image to cover its available panel and verified the fit on desktop and mobile.
- 2026-11-20: Pulled the other developer's homepage work, then applied the Luxe design principles: new /shop page with category mosaic, category page banners, new product cards with More info, new colours and display font, footer with Developed by Datix AI (datixai.com). Removed the gold line before section labels.
- 2026-11-20: Admin given its own layout and a full redesign; home hero rebuilt with lifestyle photos; home categories shown as the Luxe-style mosaic.
