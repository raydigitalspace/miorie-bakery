# mio·rie

A responsive, dependency-free landing page and shop for mio·rie micro-boulangerie, with its own bag and checkout.

## Development

From this folder, run `python3 -m http.server 3000` and open http://localhost:3000. No build step. Deploys as-is to GitHub Pages.

## Page order

Hero (auto-sliding photos; headline = Boulangerie / Pastries & Small Treats / Tiramisu) → Our story (pinned scroll chapter on the name) → Good bread takes time (zoomed crumb, story card on the right) → ingredient marquee → The bakes (everyday vs artisan comparison, artisan collection with ingredient read-more and a seasonal slot, everyday collection, pastries, tiramisu) → ordering → FAQ → contact.

Story copy is taken verbatim from the Take App landing cards ("About mio·rie", "Good bread takes time", "Small treats, simple pleasures"). Photos load from `cdn3.take.app`.

## Ordering

The bag and checkout run on the page (prices are in the HTML `data-price` attributes). Each order gets a number like `MR261026-Q4SQ`, a pickup date at least `CONFIG.leadDays` (4) days out, and an on-screen receipt.

To go live, deploy `backend/orders.gs` as a Google Apps Script web app on a Google Sheet (steps at the top of that file) and paste its URL into `CONFIG.orderEndpoint` in `script.js`. Orders then land in the sheet, the customer gets an emailed receipt and the baker gets a new-order email. Payment is PayNow against the order number, marked paid in the sheet. Until the endpoint is set, checkout runs in preview mode and says so on the receipt.

## To confirm with the baker

- Financier prices per flavour (currently Classic Sliced Almond S$26, Hojicha Black Sesame S$30, based on the shop's "S$26–30").
- Pickup time slots in the checkout form (placeholders).
- PayNow number / UEN (`CONFIG.paynowLine` and `PAYNOW_LINE`), and the order email address.
- Madeleine and scone prices (shown as coming soon / seasonal drop, not purchasable yet).
