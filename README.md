# mio·rie

A responsive, dependency-free brand landing page for mio·rie micro-boulangerie. Product, category and order links lead to the existing Take App shop. No payments or customer details are collected on this site.

## Development

Run `npm run dev` from `/workspace/miorie-bakery` (requires Python 3), or run `python3 -m http.server 3000 --bind 0.0.0.0` directly. No dependency installation or build is required. Deploy the root directory to any static host.

## Brand and content

Source: https://take.app/miorie_bakes. Olive `#6f6c5a` is taken from the storefront; cream and neutral supporting colours echo the logo. Body typography follows the store's system sans-serif stack; Georgia is a complementary heading face, not a verified original logo font.

Photos and the original logo currently load from `cdn3.take.app`. This domain must be allowed for cloud browser validation. Prices and availability remain in Take App to avoid duplicating changing information. No customer reviews, dietary promises, or unverified social accounts have been invented.

Before public launch, have the baker approve copy, photography crops, product links and pickup guidance; choose a domain and static hosting. For production resilience, save authorised image copies locally once network access permits. The development server is not a production server.
