document.getElementById('year').textContent = new Date().getFullYear();
// Open story disclosures before navigating to their content.
function openStory(hash) {
  const target = document.getElementById(hash.slice(1));
  if (target?.tagName === 'DETAILS') target.open = true;
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => openStory(link.hash));
});
openStory(location.hash);
window.addEventListener('hashchange', () => openStory(location.hash));
// Progressive enhancement: content stays visible without JavaScript or motion.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.documentElement.classList.add('motion-ready');
  document.querySelectorAll('.brand-story, .story-grid, .ingredient-grid, .product, .secondary-bakes, .steps > div').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}
// Decorative slideshow. Explicit pause and reduced-motion support keep control with the visitor.
const slideHost = document.querySelector('.hero-slides');
const slideToggle = document.getElementById('slideshow-toggle');
const slideCount = document.getElementById('slide-count');
if (slideHost && slideToggle) {
  const photos = [
    'https://cdn3.take.app/media/cms3qe3ho00000ajb0rvjfoza.jpeg?width=1920',
    'https://cdn3.take.app/media/cmvehk53m000202lyalt08qxw.jpeg?width=1920',
    'https://cdn3.take.app/media/cmveoeta7000002p87g1dbtkk.jpeg?width=1920',
    document.querySelector('#tiramisu .product img')?.src
  ].filter(Boolean);
  const slides = photos.map((photo, index) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (index === 0 ? ' active' : '');
    slide.style.backgroundImage = `url("${photo}")`;
    slideHost.appendChild(slide);
    return slide;
  });
  let current = 0;
  let timer;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionPreference.matches;
  const sync = () => {
    clearInterval(timer);
    slideToggle.textContent = paused ? 'Play photos' : 'Pause photos';
    slideToggle.setAttribute('aria-pressed', String(paused));
    if (!paused && !document.hidden) timer = setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      slideCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }, 6500);
  };
  slideToggle.addEventListener('click', () => { paused = !paused; sync(); });
  document.addEventListener('visibilitychange', sync);
  motionPreference.addEventListener('change', event => { paused = event.matches; sync(); });
  sync();
}
// Reveal the name's two parts in sequence as the brand chapter enters the viewport.
const journey = document.querySelector('.brand-journey');
if (journey && 'IntersectionObserver' in window) {
  const storyObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      journey.classList.add('visible');
      storyObserver.disconnect();
    }
  }, {threshold: 0.15});
  storyObserver.observe(journey);
}
