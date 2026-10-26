# mio·rie

A responsive, dependency-free brand landing page for mio·rie micro-boulangerie. Product, category and order links lead to the existing Take App shop. No payments or customer details are collected on this site.

## Development

Run `npm run dev` from `/workspace/miorie-bakery` (requires Python 3), or run `python3 -m http.server 3000 --bind 0.0.0.0` directly. No dependency installation or build is required. Deploy the root directory to any static host.

## Brand and content

Source: https://take.app/miorie_bakes. Olive `#6f6c5a` is taken from the storefront; cream and neutral supporting colours echo the logo. Body typography follows the store's system sans-serif stack; Georgia is a complementary heading face, not a verified original logo font.

Photos and the original logo currently load from `cdn3.take.app`. This domain must be allowed for cloud browser validation. Prices and availability remain in Take App to avoid duplicating changing information. No customer reviews, dietary promises, or unverified social accounts have been invented.

Before public launch, have the baker approve copy, photography crops, product links and pickup guidance; choose a domain and static hosting. For production resilience, save authorised image copies locally once network access permits. The development server is not a production server.

## Story-led revision

Page order: brand story → sourdough philosophy → ingredient stories → Boulangerie / Pastries & Small Treats / Tiramisu → ordering → FAQs → contact. Product summaries follow the Take App opening lines, with “indulgence” reserved for tiramisu. Bread disclosures present sensory descriptions; full ingredients and ordering remain in Take App. The Jalapeño tasting sentence is condensed from its cheese/heat description. Category icons are original inline SVGs. Story links open native details elements before scrolling; reveal motion respects reduced-motion preferences.

Pending client assets: Canva reference screenshots (links inaccessible in the development environment), final hero photography, hands-only baking footage, Gugu's own bread philosophy, and contact phone/email. The contact section currently directs visitors to the existing shop. No contact details or hands footage are fabricated. The current hero uses the existing store bread photograph with a dark overlay. Image appearance remains unverified inside the environment because cdn3.take.app is blocked.

## Product-led revision

The hero leads with Boulangerie / Pastries & Small Treats / Tiramisu and cycles four source photos every 6.5 seconds. Pause/play controls, page visibility handling and reduced-motion support are included. The brand chapter visually introduces mio (美) and rie. A single sourdough story disclosure leads to the product collection. Artisan and Everyday products have separate collections; artisan ingredient details are optional. There are eleven product cards including both tiramisu variants. Public Take App pages were consulted for tiramisu and pastry information on 26 October 2026; prices are informational and final totals remain in Take App. Financiers are S$26–30 per six; madeleine/scone pricing is not published and explicitly marked to be announced. No actual seasonal products are claimed as available before release.

Checkout remains in Take App. Apple Pay requires a supported payment provider and merchant onboarding; this static GitHub Pages site cannot securely process payments or store orders by itself. Migration requires a server-side order store, payment webhooks, delivery/pickup rules, stock controls and a protected admin dashboard. No live transaction or customer-data collection is simulated.
