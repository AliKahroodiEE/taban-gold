// طلا و سکه تابان — header state, the coin comparison and the motion for /about/.
// Everything is readable without this file. Nothing is pinned or scroll-jacked: the page scrolls natively.

const COINS = [
  { w: '۸٫۱۳۶', d: '۲۲' },
  { w: '۴٫۰۶۸', d: '۱۹' },
  { w: '۲٫۰۳۴', d: '۱۶' },
];

// the header turns solid once the hero is behind it
const head = document.querySelector('[data-head]');
if (head) {
  let ticking = false;
  const update = () => { head.classList.toggle('solid', window.scrollY > 40); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// the coin comparison: the coins, the three-way switch and the table all show the same choice
document.querySelectorAll('[data-coins]').forEach((stage) => {
  const all = [...stage.querySelectorAll('[data-i]')];
  const rows = document.querySelectorAll('[data-spec] tbody tr');
  const w = stage.querySelector('[data-w]');
  const dia = stage.querySelector('[data-dia]');
  const pick = (i) => {
    all.forEach((el) => el.setAttribute('aria-pressed', String(+el.dataset.i === i)));
    rows.forEach((r, n) => r.classList.toggle('on', n === i));
    w.textContent = COINS[i].w;
    dia.textContent = COINS[i].d;
  };
  all.forEach((el) => el.addEventListener('click', () => pick(+el.dataset.i)));
});

// close an open map list when the visitor taps elsewhere
document.addEventListener('click', (e) => {
  document.querySelectorAll('details.maps[open]').forEach((d) => { if (!d.contains(e.target)) d.open = false; });
});

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ease = 'expo.out';

    // first screen: the picture settles, the title rises out of its lines, the rest follows
    gsap.timeline({ defaults: { ease } })
      .from('[data-hero-media] img', { scale: 1.14, duration: 2.4 }, 0)
      .from('.hero h1 .ln > span', { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.1)
      .from('[data-hero]', { opacity: 0, y: 22, duration: 0.9, stagger: 0.08 }, 0.3)
      .from('.site-head > *', { opacity: 0, y: -10, duration: 0.8, stagger: 0.06 }, 0.4);

    // the hero picture drifts a little as it leaves (transform only, light scrub)
    gsap.to('[data-hero-media]', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // blocks arrive once, in reading order
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, { opacity: 0, y: 34, duration: 1.1, ease, scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    gsap.utils.toArray('[data-cards]').forEach((group) => {
      gsap.from(group.children, {
        opacity: 0, y: 48, duration: 1.2, ease, stagger: 0.12,
        scrollTrigger: { trigger: group, start: 'top 84%', once: true },
      });
    });
    gsap.from('.coin-btn', {
      y: 30, rotation: -30, scale: 0.85, duration: 1.3, ease, stagger: 0.1,
      scrollTrigger: { trigger: '.tray', start: 'top 85%', once: true },
    });
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
