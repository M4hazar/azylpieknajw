// Azyl Piękna · klasy stanu ustawiane przed pierwszym malowaniem strony.
// Skrypt jest wstawiany inline w <head> (src/layouts/Base.astro), a jego hash dopisuje do CSP astro.config.mjs.
// Autor: Paweł Hejna, https://github.com/m4hazar
(() => {
  const doc = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Ruch dozwolony: elementy [data-reveal] czekają, aż odsłoni je motion.ts. Gdyby skrypty się nie wczytały,
  // treść pokaże się sama po 3 s.
  doc.classList.add('motion');
  setTimeout(() => {
    if (!doc.classList.contains('motion-ready')) doc.classList.remove('motion');
  }, 3000);

  // Przejścia między podstronami robi CSS (@view-transition w global.css). Przeglądarki bez tej funkcji dostają
  // zamiennik: .no-vt włącza w ui.ts płynne znikanie treści, a .page-in jej pojawianie się.
  const viewTransitions = 'CSSViewTransitionRule' in window;
  if (!viewTransitions) doc.classList.add('no-vt');

  // Lot ptaka tylko na stronie głównej, i to nie po powrocie: ani z innej strony tej witryny (także po kliknięciu
  // logo), ani przyciskiem „wstecz” / „dalej” przeglądarki.
  const navigation = performance.getEntriesByType('navigation')[0];
  const historyStep = navigation?.type === 'back_forward';
  let fromThisSite = false;
  try {
    fromThisSite = new URL(document.referrer).origin === location.origin;
  } catch {
    // brak referrera: wejście z zewnątrz albo wpisany adres
  }

  if (doc.hasAttribute('data-intro') && !fromThisSite && !historyStep) {
    doc.classList.add('intro');
    // zabezpieczenie: jeśli intro.js nie wystartuje, treść pokaże się po 4 s
    setTimeout(() => {
      if (!doc.classList.contains('animated')) doc.classList.remove('intro');
    }, 4000);
  } else if (!viewTransitions) {
    doc.classList.add('page-in');
  }
})();
