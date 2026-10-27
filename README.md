# mio·rie

A responsive, dependency-free landing page and shop for mio·rie micro-boulangerie, with its own bag and checkout.

## Development

From this folder, run `python3 -m http.server 3000` and open http://localhost:3000. No build step. Deploys as-is to GitHub Pages.

## Page order

Hero (auto-sliding photos; headline = Boulangerie / Pastries & Small Treats / Tiramisu) → Our story (pinned scroll chapter on the name) → Good bread takes time (zoomed crumb, story card on the right) → ingredient marquee → The bakes (everyday vs artisan comparison, artisan collection with ingredient read-more and a seasonal slot, everyday collection, pastries, tiramisu) → ordering → FAQ → contact.

Story copy is taken verbatim from the Take App landing cards ("About mio·rie", "Good bread takes time", "Small treats, simple pleasures"). Photos load from `cdn3.take.app`.

## Ordering

`CONFIG.checkout` in `script.js` picks how ordering works:

- `'takeapp'` (current): every Order button opens that product in the Take App shop (`https://take.app/miorie_bakes/p/<id>`), which handles cart, payment and order records. Prices on the page mirror Take App and need updating there and here together.
- `'onsite'` (ready for later): the page's own bag, checkout and receipt. Orders go to the Google Sheet in `backend/orders.gs` (setup steps at the top of that file; paste its URL into `CONFIG.orderEndpoint`). Before switching, give the financiers a `data-price` and flavour options (Take App only lists S$26–30 per box of 6), fill in the PayNow line, and update the ordering steps copy. For card / Apple Pay / PayNow taken at checkout, replace the sheet with Stripe Checkout.

## To confirm with the baker

- PayNow number / UEN and order email (only needed for on-site mode).
- Madeleine and scone prices (shown as coming soon / seasonal drop).
