// Checkout settings. 'takeapp': Order buttons open the product in the Take App shop.
// 'onsite': the page's own bag and checkout; paste the Google Apps Script web-app URL
// (see backend/orders.gs) into orderEndpoint, or orders run in preview mode.
const CONFIG = {
  checkout: 'takeapp',
  orderEndpoint: '',
  paynowLine: 'PayNow details will be shared here once confirmed by mio·rie.',
  leadDays: 4,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = n => 'S$' + n.toFixed(2);

$('#year').textContent = new Date().getFullYear();
if (!reduceMotion) document.documentElement.classList.add('motion');

// Header tightens once the page scrolls.
const header = $('#top-bar');
const onScrollHeader = () => header.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

// Hero slideshow: crossfade with slow zoom, progress dots and a pause control.
(() => {
  const hero = $('.hero');
  const slides = $$('.hero-slide');
  const dotsHost = $('[data-hero-dots]');
  const caption = $('[data-hero-caption]');
  const pauseBtn = $('[data-hero-pause]');
  const DURATION = 6000;
  let current = 0, timer, paused = reduceMotion;
  hero.style.setProperty('--dur', DURATION + 'ms');

  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Show ' + slide.dataset.caption);
    dot.innerHTML = '<i></i>';
    dot.addEventListener('click', () => { show(i); schedule(); });
    dotsHost.appendChild(dot);
    return dot;
  });

  function show(i) {
    slides[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    caption.textContent = slides[current].dataset.caption;
    dots.forEach((d, k) => {
      d.classList.toggle('done', k < current);
      d.classList.remove('active');
    });
    void dots[current].offsetWidth; // restart the fill animation
    dots[current].classList.add('active');
  }
  function schedule() {
    clearTimeout(timer);
    hero.classList.toggle('paused', paused);
    pauseBtn.textContent = paused ? 'Play' : 'Pause';
    pauseBtn.setAttribute('aria-pressed', String(paused));
    if (!paused && !document.hidden) timer = setTimeout(() => { show(current + 1); schedule(); }, DURATION);
  }
  pauseBtn.addEventListener('click', () => { paused = !paused; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  show(0);
  schedule();
})();

// Split headings into lines so each can rise into place.
$$('.split').forEach(el => {
  el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i)
    .map(part => `<span class="line"><span>${part}</span></span>`).join('');
});

// Reveal on scroll.
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .split, .frame, .feature-img').forEach(el => io.observe(el));
} else {
  $$('.reveal, .split').forEach(el => el.classList.add('visible'));
}

// Scroll-driven effects: the pinned name story, crumb zoom and closing parallax.
(() => {
  const chapter = $('.name-chapter');
  const steps = $$('.name-steps li');
  const stepImgs = $$('[data-step-img]');
  const progress = $('[data-name-progress]');
  const crumb = $('.crumb-image');
  const crumbImg = crumb && $('img', crumb);
  const closingBg = $('.closing-bg');

  function setStep(step) {
    if (chapter.dataset.step === String(step)) return;
    chapter.dataset.step = step;
    steps.forEach((li, i) => {
      li.classList.toggle('active', i === step);
      li.classList.toggle('past', i < step);
    });
    const img = stepImgs.filter(im => +im.dataset.stepImg <= step).pop();
    stepImgs.forEach(im => im.classList.toggle('active', im === img));
  }

  function frame() {
    const vh = innerHeight;
    const r = chapter.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
    setStep(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
    progress.style.transform = `scaleX(${p})`;
    if (crumbImg && !reduceMotion) {
      const r = crumb.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      crumbImg.style.setProperty('--zoom', (1.45 - p * 0.4).toFixed(3));
      crumbImg.style.setProperty('--py', (-p * 10).toFixed(2) + '%');
    }
    if (closingBg && !reduceMotion) {
      const r = closingBg.parentElement.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) closingBg.style.setProperty('--py', ((r.top / vh) * -12).toFixed(2) + '%');
    }
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { frame(); ticking = false; }); }
  }, { passive: true });
  addEventListener('resize', frame);
  steps[0].classList.add('active');
  frame();
})();

// ---------- Bag & checkout (on-site mode only) ----------
if (CONFIG.checkout === 'onsite') {
$$('[data-onsite]').forEach(el => { el.hidden = false; });
$$('[data-shop-link]').forEach(el => { el.hidden = true; });
$$('a[data-add]').forEach(a => {
  a.textContent = 'Add to bag';
  a.setAttribute('role', 'button');
  a.addEventListener('click', e => e.preventDefault());
});
const STORE_KEY = 'miorie-bag';
let bag = [];
try { bag = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { bag = []; }
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(bag)); } catch {} };
const subtotal = () => bag.reduce((sum, item) => sum + item.price * item.qty, 0);

const drawer = $('#drawer');
const scrim = $('.drawer-scrim');
const toast = $('[data-toast]');
let lastFocus = null;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove('show'), 2200);
}

function goto(view) {
  $$('.drawer-view', drawer).forEach(v => { v.hidden = v.dataset.view !== view; });
  $('[data-drawer-title]').textContent = { bag: 'Your bag', details: 'Pickup details', receipt: 'Receipt' }[view];
}

function openCart(view = 'bag') {
  lastFocus = document.activeElement;
  goto(view);
  scrim.hidden = false;
  drawer.inert = false;
  drawer.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => { scrim.classList.add('open'); drawer.classList.add('open'); });
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('.icon-btn', drawer).focus(), 50);
}
function closeCart() {
  scrim.classList.remove('open');
  drawer.classList.remove('open');
  drawer.inert = true;
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { scrim.hidden = true; }, 500);
  if ($('[data-view="receipt"]').hidden === false) goto('bag');
  lastFocus?.focus?.();
}
$$('[data-open-cart]').forEach(b => b.addEventListener('click', () => openCart()));
$$('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });
$$('[data-goto]').forEach(b => b.addEventListener('click', () => goto(b.dataset.goto)));

function renderBag() {
  const list = $('[data-bag-list]');
  list.innerHTML = '';
  bag.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'bag-item';
    li.innerHTML = `<img src="${item.img}" alt="">
      <div><h5></h5><small></small>
        <div class="qty"><button type="button" aria-label="One less">−</button><span>${item.qty}</span><button type="button" aria-label="One more">+</button></div></div>
      <div><div class="line-price">${money(item.price * item.qty)}</div><button type="button" class="remove">Remove</button></div>`;
    $('h5', li).textContent = item.name;
    $('small', li).textContent = (item.option ? item.option + ' · ' : '') + money(item.price);
    const [less, more] = $$('.qty button', li);
    less.addEventListener('click', () => { item.qty > 1 ? item.qty-- : bag.splice(i, 1); update(); });
    more.addEventListener('click', () => { item.qty++; update(); });
    $('.remove', li).addEventListener('click', () => { bag.splice(i, 1); update(); });
    list.appendChild(li);
  });
  $('[data-bag-empty]').hidden = bag.length > 0;
  $('[data-checkout-btn]').disabled = bag.length === 0;
  $$('[data-subtotal]').forEach(el => { el.textContent = money(subtotal()); });
  const count = bag.reduce((n, item) => n + item.qty, 0);
  $('[data-bag-count]').textContent = count;
  $('[data-bag-total]').textContent = money(subtotal());
  $('.mobile-bag').classList.toggle('show', count > 0);
}
function update() { save(); renderBag(); }

// Option selects (e.g. financier flavours) set the card's price.
$$('[data-option]').forEach(select => {
  const card = select.closest('.product');
  const sync = () => {
    const price = select.selectedOptions[0].dataset.price;
    card.dataset.price = price;
    $('[data-price-label]', card).textContent = 'S$' + price;
  };
  select.addEventListener('change', sync);
  sync();
});

$$('[data-add]').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.product');
  const option = $('[data-option]', card)?.value || '';
  const id = card.dataset.product + (option ? ':' + option : '');
  const existing = bag.find(item => item.id === id);
  if (existing) existing.qty++;
  else bag.push({
    id, name: card.dataset.name, option, qty: 1,
    price: Number(card.dataset.price),
    img: $('img', card).src.replace(/width=\d+/, 'width=200'),
  });
  update();
  button.classList.add('added');
  button.textContent = 'Added ✓';
  setTimeout(() => { button.classList.remove('added'); button.textContent = 'Add to bag'; }, 1600);
  const bagBtn = $('.bag-button');
  bagBtn.classList.remove('bump'); void bagBtn.offsetWidth; bagBtn.classList.add('bump');
  showToast(card.dataset.name + ' added');
}));

// Pickup date: earliest is today + lead time.
const pickup = $('[data-pickup]');
const earliest = new Date();
earliest.setDate(earliest.getDate() + CONFIG.leadDays);
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
pickup.min = iso(earliest);

const form = $('[data-view="details"]');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const error = $('[data-form-error]');
  error.textContent = '';
  let firstBad = null;
  $$('input, select', form).forEach(field => {
    const bad = !field.checkValidity() || (field === pickup && field.value && field.value < field.min);
    field.setAttribute('aria-invalid', String(bad));
    if (bad && !firstBad) firstBad = field;
  });
  if (firstBad) {
    error.textContent = firstBad === pickup && pickup.value
      ? `Sourdough needs time. The earliest pickup is ${pickup.min}.`
      : 'Please check the highlighted details.';
    firstBad.focus();
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const stamp = new Date();
  const order = {
    orderNo: 'MR' + iso(stamp).slice(2).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    createdAt: stamp.toISOString(),
    customer: data,
    items: bag.map(({ name, option, qty, price }) => ({ name, option, qty, price })),
    total: subtotal(),
  };
  const submit = $('button[type=submit]', form);
  submit.disabled = true;
  submit.textContent = 'Placing order…';
  try {
    if (CONFIG.orderEndpoint) {
      // text/plain keeps this a simple request, which Apps Script web apps accept cross-origin.
      const res = await fetch(CONFIG.orderEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(order) });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Order not saved');
    }
    showReceipt(order, !CONFIG.orderEndpoint);
    bag = [];
    update();
    form.reset();
  } catch (err) {
    error.textContent = 'Sorry, your order could not be sent. Please try again, or message us through our shop.';
  } finally {
    submit.disabled = false;
    submit.textContent = 'Place order';
  }
});

function showReceipt(order, demo) {
  $('[data-order-no]').textContent = order.orderNo;
  $('[data-paynow-line]').textContent = `${money(order.total)} · ${CONFIG.paynowLine}`;
  const list = $('[data-receipt-list]');
  list.innerHTML = '';
  order.items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'bag-item';
    li.innerHTML = '<div><h5></h5><small></small></div><div class="line-price"></div>';
    $('h5', li).textContent = item.name;
    $('small', li).textContent = `${item.option ? item.option + ' · ' : ''}Qty ${item.qty}`;
    $('.line-price', li).textContent = money(item.price * item.qty);
    list.appendChild(li);
  });
  $('[data-receipt-total]').textContent = money(order.total);
  const c = order.customer;
  $('[data-receipt-meta]').textContent = `Pickup ${c.pickup}, ${c.slot}.` + (demo ? '' : ` A copy has been sent to ${c.email}.`);
  $('[data-demo-note]').hidden = !demo;
  goto('receipt');
}

renderBag();
}

// Videos load only when they come near the screen, and pause when they leave it.
(() => {
  const videos = $$('[data-lazy-video]');
  if (!videos.length) return;
  const start = video => {
    if (!video.dataset.loaded) {
      $$('source', video).forEach(s => { s.src = s.dataset.src; });
      video.load();
      video.dataset.loaded = '1';
    }
    if (!reduceMotion) video.play().catch(() => {});
  };
  if (!('IntersectionObserver' in window)) { videos.forEach(start); return; }
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.isIntersecting ? start(entry.target) : entry.target.pause();
  }), { rootMargin: '200px 0px' });
  videos.forEach(v => io.observe(v));
})();
