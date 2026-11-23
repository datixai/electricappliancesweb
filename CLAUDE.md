# Adnan Electronics Household website (Datix AI web client)

Context file for Claude on any PC. Read this first. Update Status, Next steps and the Progress log at the end of every session.
GitHub: datixai/electricappliancesweb (private work repo).

## What it is
Dubai kitchen appliance shop (client via WhatsApp) wants a full REDESIGN of his existing site sliverscriest.com (old developer gone, domain access unclear). Design reference he sent: thesuncart.com (take layout ideas only, never copy its brand, text or images). Categories: Air fryers, Blenders, Choppers, Juicers, Spice grinders, Stoves, Kettles and tea makers. Also wants an invoice template for his phone (not built yet). Home page first for his approval.
Scope, domain risk and the quote: docs/analysis.md. Chat notes: docs/client_chat.md.

## Status (21 Nov 2026)
- v1 built in site/ (Next.js 15 App Router, plain CSS, no database):
  - Storefront: responsive header, logo (SVG "A" monogram, name "Adnan Electronics Household" + Persian "لوازم خانگی", set in site/lib/site.js and components/ui.js), search, category navigation, redesigned homepage, category pages, product page with gallery and "Order on WhatsApp", search page, floating WhatsApp button (right side).
  - Admin at /adadmin (renamed from /admin on 23 Nov 2026, not listed in robots.txt; the page is noindex): password login, add / edit / delete products, choose category, upload several photos, mark as best seller.
  - 29 seed products from the client's posters in site/data/products.json, photos in site/public/products/pN.jpg (pN = Nth image of client_files/images in Python sorted() order).
- Homepage redesign complete: refreshed hero with an automatic product carousel, category and featured product layouts, simpler product cards, GCC delivery coverage, business footer, and FAQ. The carousel includes manual controls, hover and focus pause, and reduced-motion support. The hero image now fills its panel with cover fitting. The delivery section follows the hero, and the featured grid has a See All link to Shop. Product prices are hidden on customer-facing pages; product records and admin pricing remain unchanged. No review data is available, so no reviews are shown.
- v3 look (20 Nov 2026), same principles as D:/TheLuxeOrganization: /shop page with a centred intro and a full-width photo mosaic of the 7 categories (dark overlay, spaced capital labels, text and gold Discover on hover), category pages with a zooming photo banner and an Other categories strip, richer product cards (category badge, best seller flag, brand, 2 features, More info button), Playfair Display headings, deep ink + champagne gold colours, 4-column footer with Developed by Datix AI linking to datixai.com. Styles in site/app/theme.css (loaded after globals.css), components CategoryMosaic and PageHero in components/ui.js.
- 20 Nov 2026 (later): storefront pages moved into site/app/(site)/ with their own layout (header, footer, WhatsApp float); /adadmin now has its own clean layout and styles (site/app/admin/admin.css): login card, stats, sticky add/edit form with photo previews, product list with search and category tabs. Home hero rebuilt (components/HeroSlider.js): split layout with a photo panel cross-fading 4 lifestyle photos (p21, p41, p13, p14) using plain <img> (next/image left the panel blank). Home categories now use the Luxe photo mosaic (CategoryMosaic).
- Menu (components/NavLinks.js) now contains Home, Shop All, About Us and Contact; category links remain on the Shop page and in the footer.
- Product details now use a responsive gallery, data-backed specifications, WhatsApp ordering, and related product cards. The contact section includes the clickable business email adnandisnie@gmail.com.
- The homepage no longer displays its "Explore the collection / Shop by category" mosaic section or its FAQ section; the remaining homepage sections are unchanged.
- Moved the "A considered choice / Why Adnan Electronics" section from the homepage to About Us without changing its copy.
- Shop All keeps all seven category cards and all 29 products, with working category and brand filters and Featured and name sorting. Price display, filtering and sorting are removed from the storefront.
- Added /about and /contact pages with existing business details, UAE and GCC delivery information, and clickable phone, WhatsApp, email and Instagram links. The Contact page has a responsive inquiry form with validation and prefilled email submission, a premium intro image reused from the original PageHero, followed by business and location details, plus the restored entrance animation with reduced-motion support. No map link was available, so no map is embedded.
- Header now has a single logo-and-navigation row; the announcement bar and search UI are removed. A translucent dark glass treatment appears while scrolling and reverts at the top.
- Quote not sent yet (suggested $700 package, see analysis). English only so far.

## How it works
- Data: Firebase project adnanelectronics-69f17 (free Spark plan). Products in Firestore collection "products" (sorted by "order"), admin photos in collection "images" (resized in the browser to under 700 KB, served by /api/img/<id>), since Spark has no Cloud Storage. Seed photos stay in public/products. Without Firebase keys the site falls back to site/data/products.json and data/uploads (local dev). Code: lib/firebase.js, lib/store.js, scripts/seed-firestore.mjs (copies products.json into Firestore once).
- Admin login: email + password via Firebase Authentication (REST signInWithPassword, then a Firebase session cookie). Only ADMIN_EMAIL (m.adnan.ali113@gmail.com) is accepted. "Forgot password" sends a Firebase reset email. Env: ADMIN_EMAIL, FIREBASE_API_KEY, FIREBASE_SERVICE_ACCOUNT (one-line JSON on Vercel) or site/firebase-service-account.json locally (gitignored). ADMIN_PASSWORD is only the local fallback.
- Hosted on Vercel at https://adnanhomestore.com (GoDaddy DNS: A @ 216.198.79.1). Set NEXT_PUBLIC_SITE_URL=https://adnanhomestore.com on Vercel.
- Contact settings (WhatsApp number, phone, email, Instagram, address and categories): site/lib/site.js.

## Run
```
cd site
npm install
npm run dev      # http://localhost:3000 , admin at /adadmin
npm run build && npm start   # production
```

## Folders
- client_files/images/   all 45 client images (NOT in git: same files are in site/public/products as p1-p45)
- docs/                  chat notes and analysis / quote
- site/                  the Next.js website

## Next steps
1. Review the homepage section order and See All link, plus the About, Shop and Contact pages; confirm the inquiry-only storefront approach, send the quote, and get 50% advance.
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
- 2026-11-20: Redesigned the dynamic product details page and added a clickable contact email while preserving existing catalog data, pricing, images, and WhatsApp links.
- 2026-11-20: Removed only the homepage category mosaic section and verified the remaining sections still render.
- 2026-11-20: Removed only the homepage FAQ section and verified the other sections still render.
- 2026-11-21: Simplified the main navigation, retained all seven Shop category cards and 29 products, and added working combined filters with all requested sort orders.
- 2026-11-21: Added About and Contact pages with existing business details and responsive layouts; verified product, contact and navigation links.
- 2026-11-21: Production build passed; browser checks confirmed product counts, category cards, price and brand filtering, sort orders, mobile drawer behavior, and page routes.
- 2026-11-21: Removed the header search bar UI and added responsive scroll-triggered transparency; verified the header at the top and while scrolling on desktop and mobile.
- 2026-11-21: Removed the announcement strip and aligned the existing logo and navigation into a compact responsive header; checked all four links and scroll behavior on desktop and mobile.
- 2026-11-21: Refined the Contact page with a responsive validated form and prefilled email submission; verified validation, generated email contents, contact links, and mobile and desktop layout. Removed an invalid phone input pattern that prevented browser validation.
- 2026-11-21: Matched the Contact page sequence to the reference with intro, form and business details; restored its original PageHero rise animation with a subtle stagger. Verified reduced-motion behavior, form submission and mobile layout.
- 2026-11-21: Added the original Contact PageHero image beside the intro and separated the address into a final location section. Verified image cropping, page sequence, links, form behavior, animation, and responsive layouts.
- 2026-11-21: Moved the "Why Adnan Electronics" section to About Us, removed storefront price displays and Shop price controls, and verified product cards, product detail links, WhatsApp ordering, and remaining Shop filters.
- 2026-11-21: Moved the UAE and GCC delivery section below the homepage hero and added a responsive See All link to Shop after featured products; verified desktop and mobile section order and navigation.
- 2026-11-23: Pulled the other developer's About, Contact, shop filters and header work. Name check: SITE.company changed from Disnie Electronics Trading LLC to Adnan Electronics Household (footer, copyright, About, Contact), short "Adnan Electronics" made full everywhere, About copy reworded, footer dead /#faq link replaced by About us and Contact, email read from SITE.email, product and search pages got their own titles. Disnie stays only as a product brand on 4 products.
- 2026-11-23: Only Adnan Electronics Household on the site: the 2 Disnie-brand products renamed (brand now Adnan Electronics Household), hero tag changed. The email address adnandisnie@gmail.com is the client's real address and stays. SEO added: full metadata (description, keywords, Open Graph, Twitter, canonical on every page), app/sitemap.js (all pages, categories, products), app/robots.js (blocks /admin and /api), schema.org HomeGoodsStore + WebSite search on all pages, Product + BreadcrumbList on product pages (price only when a real price is entered in admin), public/llms.txt, search page noindex. Site URL comes from SITE.url in lib/site.js: set NEXT_PUBLIC_SITE_URL on the host (defaults to https://sliverscriest.com).
- 2026-11-23: Domain adnanhomestore.com live on Vercel with HTTPS. Firebase added: Firestore products + images, admin email/password login via Firebase Auth with forgot password, browser photo resizing, seed script. Tested in local fallback mode (login, wrong login 401, add with photo, image, product page, delete). Waiting for: Auth Email/Password enabled, admin user created, Firestore created, service account key. Invoice DAI/009 made in invoices/ (gitignored).
- 2026-11-23 (later): Firebase live on adnanhomestore.com (needed firebase-admin 13: v14 pulls an ESM-only jose that fails on Vercel's Node). Admin moved from /admin to /adadmin (not in robots.txt, page is noindex; /admin is now 404). Security hardening: same-origin check on login and product APIs, login rate limit (8 per 15 min) and reset limit, generic reset answer, SameSite=strict cookie, real file type check on photos (magic bytes), field length limits, keep-list allowlist, removed photos deleted from Firestore, security headers (CSP, X-Frame-Options, nosniff, HSTS, Referrer-Policy, Permissions-Policy), /api/health shows only firebase true/false. Tests: `node scripts/e2e-admin-test.mjs` (57 checks, local server in Firebase mode, signs in via service account, cleans up) and `node scripts/check-links.mjs` (41 pages, 56 assets, no broken links). SEO: titles with "in Dubai, UAE" on category and product pages, CollectionPage + ItemList schema, geo meta, Urdu keywords, GOOGLE_SITE_VERIFICATION env supported, default domain set to adnanhomestore.com. Known: npm audit shows 11 findings in build tools and Google libraries, fixing needs Next 16 (breaking), not exploitable by visitors.
