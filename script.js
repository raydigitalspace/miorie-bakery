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
