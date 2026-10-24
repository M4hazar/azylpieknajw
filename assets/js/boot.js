/*!
 * Azyl Piękna · strona w budowie
 * boot.js: klasy stanu ustawiane przed pierwszym malowaniem strony (ładowany synchronicznie w <head>)
 * Autor: Paweł Hejna, https://github.com/m4hazar
 */
(() => {
  'use strict';

  const doc = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Przejścia między podstronami robi CSS (@view-transition w site.css). Przeglądarki bez tej funkcji dostają
  // zamiennik: klasa .no-vt włącza w site.js płynne znikanie treści, a .page-in jej pojawianie się.
  const viewTransitions = 'CSSViewTransitionRule' in window;
  if (!viewTransitions) doc.classList.add('no-vt');

  // Lot ptaka tylko na stronie głównej, i to nie po powrocie: ani z innej podstrony tej witryny,
  // ani przyciskiem „wstecz” / „dalej” przeglądarki.
  const navigation = performance.getEntriesByType('navigation')[0];
  const historyStep = navigation?.type === 'back_forward';
  let fromThisSite = false;
  try {
    const ref = new URL(document.referrer);
    fromThisSite = ref.origin === location.origin && ref.pathname !== location.pathname;
  } catch {
    // brak referrera: wejście z zewnątrz albo wpisany adres
  }

  if (doc.classList.contains('home') && !fromThisSite && !historyStep) {
    doc.classList.add('intro');
    // zabezpieczenie: jeśli intro.js nie wystartuje (np. nie wczyta się), treść pokaże się po 4 s
    setTimeout(() => {
      if (!doc.classList.contains('animated')) doc.classList.remove('intro');
    }, 4000);
  } else if (!viewTransitions) {
    doc.classList.add('page-in');
  }
})();
