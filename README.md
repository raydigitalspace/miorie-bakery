# mio·rie

A responsive, dependency-free landing page and shop for mio·rie micro-boulangerie, with its own bag and checkout.

## Development

From this folder, run `python3 -m http.server 3000` and open http://localhost:3000. No build step. Deploys as-is to GitHub Pages.

## Pages

- `index.html` (shop): hero (auto-sliding photos; headline = Boulangerie / Pastries & Small Treats / Tiramisu, each with a "Shop" hover hint) → short name story (pinned; links to the full story) → ingredient marquee → Buy our bakes (four category tiles with "Shop now" hints) → Boulangerie (artisan, everyday) → Pastries → Tiramisu → ordering → FAQ → contact.
- `story.html` (Our story): hero → name story → Good bread takes time (flour / time / craft cards with Read more) → Inside our little kitchen ribbon → Two ways we bake sourdough (everyday / artisan cards with Read more) → back to the shop.

The header's "Buy our bakes" dropdown (and the phone Menu) jumps straight to Artisan, Everyday, Pastries or Tiramisu. Only each product's Order button goes to Take App.

Story copy is taken verbatim from the Take App landing cards ("About mio·rie", "Good bread takes time", "Small treats, simple pleasures"). Product photos load from `cdn3.take.app`. Hero, story, kitchen-gallery and crumb photos plus two videos (financier tear, box reveal) come from the baker's own album and live in `assets/` (resized JPEGs, 540p H.264 videos that load only when scrolled into view). The "Inside our little kitchen" ribbon sits after the crumb story. Storage and reheating FAQ text is from the sourdough care-tips card.

## Ordering

`CONFIG.checkout` in `script.js` picks how ordering works:

- `'takeapp'` (current): every Order button opens that product in the Take App shop (`https://take.app/miorie_bakes/p/<id>`), which handles cart, payment and order records. Prices on the page mirror Take App and need updating there and here together.
- `'onsite'` (ready for later): the page's own bag, checkout and receipt. Orders go to the Google Sheet in `backend/orders.gs` (setup steps at the top of that file; paste its URL into `CONFIG.orderEndpoint`). Before switching, give the financiers a `data-price` and flavour options (Take App only lists S$26–30 per box of 6), fill in the PayNow line, and update the ordering steps copy. For card / Apple Pay / PayNow taken at checkout, replace the sheet with Stripe Checkout.

## To confirm with the baker

- Fermentation time: the shop story says "an average of 40 hours", the care-tips card says "over 30 hours". The site uses 40.
- Double Chocolate tiramisu and Basque-style cheesecakes appear in the album but not the shop; not on the site.

- PayNow number / UEN and order email (only needed for on-site mode).
- Madeleine and scone prices (shown as coming soon / seasonal drop).
