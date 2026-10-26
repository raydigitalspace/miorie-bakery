/**
 * mio·rie order sheet — Google Apps Script web app.
 *
 * Setup (about 5 minutes, free):
 * 1. Create a Google Sheet called "mio·rie orders". Extensions → Apps Script.
 * 2. Paste this file in, set OWNER_EMAIL and PAYNOW_LINE below, and save.
 * 3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 * 4. Copy the web-app URL into CONFIG.orderEndpoint in script.js.
 *
 * Every order becomes a row (the sales ledger). The customer gets an emailed
 * receipt and the baker gets a new-order email. Mark the "Status" column
 * Paid / Baked / Collected as each order moves along.
 */
const OWNER_EMAIL = 'replace-with-miorie-email@example.com';
const PAYNOW_LINE = 'PayNow to <mobile or UEN>, reference: your order number';
const HEADERS = ['Received', 'Order no.', 'Status', 'Name', 'Mobile', 'Email', 'Pickup date', 'Pickup time', 'Items', 'Total (S$)', 'Notes'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const order = JSON.parse(e.postData.contents);
    validate(order);
    const sheet = getSheet();
    const items = order.items.map(i => `${i.qty} × ${i.name}${i.option ? ' (' + i.option + ')' : ''} @ ${i.price.toFixed(2)}`).join('\n');
    const total = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const c = order.customer;
    sheet.appendRow([new Date(), order.orderNo, 'Awaiting payment', c.name, "'" + c.phone, c.email, c.pickup, c.slot, items, total, c.notes || '']);

    const body = `Thank you, ${c.name}.\n\nOrder ${order.orderNo}\n\n${items}\n\nTotal: S$${total.toFixed(2)}\nPickup: ${c.pickup}, ${c.slot}\n\n${PAYNOW_LINE}\n\nWith care,\nmio·rie`;
    MailApp.sendEmail(c.email, `Your mio·rie order ${order.orderNo}`, body, { replyTo: OWNER_EMAIL, name: 'mio·rie' });
    MailApp.sendEmail(OWNER_EMAIL, `New order ${order.orderNo} · S$${total.toFixed(2)}`, `${c.name} · ${c.phone} · ${c.email}\nPickup ${c.pickup}, ${c.slot}\n\n${items}\n\nNotes: ${c.notes || '-'}`);
    return json({ ok: true, orderNo: order.orderNo, total });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function validate(order) {
  const c = order && order.customer;
  if (!c || !c.name || !c.phone || !/^\S+@\S+\.\S+$/.test(c.email || '') || !c.pickup) throw new Error('Missing customer details');
  if (!Array.isArray(order.items) || !order.items.length || order.items.length > 40) throw new Error('Empty order');
  order.items.forEach(i => {
    if (!(i.qty > 0 && i.qty < 50 && i.price > 0 && i.price < 200)) throw new Error('Invalid item');
  });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS).setFrozenRows(1);
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
