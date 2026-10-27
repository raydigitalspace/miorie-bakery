# mio·rie

A responsive, dependency-free landing page and shop for mio·rie micro-boulangerie, with its own bag and checkout.

## Development

From this folder, run `python3 -m http.server 3000` and open http://localhost:3000. No build step. Deploys as-is to GitHub Pages.

## Pages

- `index.html` (shop): slideshow hero (Sourdough / Small treats / Little indulgence) → short name intro with a "Read our story" link → four brand values → Explore our bakes, grouped under Boulangerie / Pastries / Tiramisu tabs (sourdough's three promises sit at the top of Boulangerie) → photo ribbon of the bakes (no frames or captions) → bread care → how to order → FAQ → contact → closing.
- `story.html` (Our story): short, tidied versions of the baker's drafts: how it began, bread philosophy, kitchen photo ribbon, two ways we bake, small treats, tiramisu, personal touch. Each ends in a soft link to the matching bakes.

Brand board ("Olive edition"): olive #5A5F3A, walnut #4B3621, ivory #F4F1E8; Cormorant Garamond + Montserrat. Emphasis is by colour (`.key`, `em`), not size.

The header's "Explore our bakes" dropdown, the phone menu and the story-page buttons open the right tab and land on the products. Only each product's Order button goes to Take App.

Product photos load from `cdn3.take.app`; everything else is the baker's own, resized in `assets/`.

## Ordering

`CONFIG.checkout` in `script.js` picks how ordering works:

- `'takeapp'` (current): every Order button opens that product in the Take App shop (`https://take.app/miorie_bakes/p/<id>`), which handles cart, payment and order records. Prices on the page mirror Take App and need updating there and here together.
- `'onsite'` (ready for later): the page's own bag, checkout and receipt. Orders go to the Google Sheet in `backend/orders.gs` (setup steps at the top of that file; paste its URL into `CONFIG.orderEndpoint`). Before switching, give the financiers a `data-price` and flavour options (Take App only lists S$26–30 per box of 6), fill in the PayNow line, and update the ordering steps copy. For card / Apple Pay / PayNow taken at checkout, replace the sheet with Stripe Checkout.

## To confirm with the baker

- Fermentation: the baker confirmed "averaging 40 hours" (the printed care card still says over 30).
- Customer quotes for a reviews section, which bakes are bestsellers, and the weekly order cut-off / bake days.
- Double Chocolate tiramisu and Basque-style cheesecakes appear in the album but not the shop; not on the site.

- PayNow number / UEN and order email (only needed for on-site mode).
- Madeleine and scone prices (shown as coming soon / seasonal drop).
