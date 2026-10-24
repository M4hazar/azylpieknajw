/*!
 * Azyl Piękna · strona w budowie
 * site.js: wspólne elementy stron (informacja o cookies, strzałka „na górę”, przejścia między podstronami)
 * Autor: Paweł Hejna, https://github.com/m4hazar
 */
(() => {
  'use strict';

  const doc = document.documentElement;

  /* Informacja o cookies. Strona nie zapisuje cookies; to, że komunikat zamknięto, pamiętamy w localStorage.
     Na stronie głównej pojawia się po intro (zdarzenie „intro:end” z intro.js). */
  const notice = document.querySelector('.cookie-notice');
  const NOTICE_KEY = 'ap-info';

  function noticeDismissed() {
    try {
      return localStorage.getItem(NOTICE_KEY) === '1';
    } catch {
      return false;
    }
  }

  if (notice && !noticeDismissed()) {
    document.addEventListener('intro:end', () => {
      notice.hidden = false;
      notice.classList.add('show');
    }, { once: true });

    notice.querySelector('button').addEventListener('click', () => {
      notice.hidden = true;
      try {
        localStorage.setItem(NOTICE_KEY, '1');
      } catch {
        // tryb prywatny lub zablokowany localStorage: komunikat wróci przy następnej wizycie
      }
    });
  }

  /* Strzałka „na górę”: pojawia się w rogu po przewinięciu o pół ekranu. */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const update = () => toTop.classList.toggle('show', scrollY > innerHeight * 0.5);
    addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Przejścia między podstronami w przeglądarkach bez View Transitions (klasa .no-vt z boot.js): treść płynnie
     znika, zanim przeglądarka przejdzie na inną podstronę tej witryny. */
  if (doc.classList.contains('no-vt')) {
    const LEAVE_MS = 250;                 // tyle trwa znikanie treści (.leaving w site.css)

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      doc.classList.add('leaving');
      setTimeout(() => location.assign(url.href), LEAVE_MS);
    });

    // powrót przyciskiem „wstecz” z pamięci podręcznej przeglądarki: strona musi być znowu widoczna
    addEventListener('pageshow', (e) => {
      if (e.persisted) doc.classList.remove('leaving');
    });
  }
})();
