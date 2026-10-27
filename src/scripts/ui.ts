// Elementy stałe: strzałka „na górę”, pasek rezerwacji na telefonie, informacja o cookies
// i płynne przejścia między podstronami w przeglądarkach bez View Transitions.

const doc = document.documentElement;

export function initUi() {
  initToTop();
  initBookingBar();
  initCookieNotice();
  initPageLeave();
}

/* Strzałka w rogu pojawia się po przewinięciu o więcej niż wysokość ekranu. */
function initToTop() {
  const toTop = document.querySelector<HTMLElement>('[data-to-top]');
  if (!toTop) return;
  const update = () => toTop.toggleAttribute('data-visible', scrollY > innerHeight);
  addEventListener('scroll', update, { passive: true });
  update();
}

/* Pasek rezerwacji: widoczny za początkiem strony, schowany przy stopce (tam jest duży przycisk rezerwacji). */
function initBookingBar() {
  const bar = document.querySelector<HTMLElement>('[data-booking-bar]');
  const footerCta = document.querySelector('.footer-cta');
  if (!bar) return;

  let nearFooter = false;
  const update = () => bar.toggleAttribute('data-visible', scrollY > innerHeight * 0.7 && !nearFooter);

  if (footerCta) {
    new IntersectionObserver(([entry]) => {
      nearFooter = entry.isIntersecting || entry.boundingClientRect.top < 0;
      update();
    }).observe(footerCta);
  }
  addEventListener('scroll', update, { passive: true });
  update();
}

/* Strona nie zapisuje cookies; to, że komunikat zamknięto, pamiętamy w localStorage. Komunikat pojawia się
   dopiero po przewinięciu początku strony, żeby nie zasłaniał przycisków na pierwszym ekranie (ani intro). */
function initCookieNotice() {
  const notice = document.querySelector<HTMLElement>('[data-cookie-notice]');
  const KEY = 'ap-info';
  if (!notice) return;

  try {
    if (localStorage.getItem(KEY) === '1') return;
  } catch {
    // tryb prywatny lub zablokowany localStorage: komunikat pokaże się przy każdej wizycie
  }

  const show = () => {
    if (scrollY < innerHeight * 0.35) return;
    notice.hidden = false;
    removeEventListener('scroll', show);
  };
  addEventListener('scroll', show, { passive: true });
  show();

  notice.querySelector('button')?.addEventListener('click', () => {
    notice.hidden = true;
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // jak wyżej: bez zapamiętania
    }
  });
}

/* Przeglądarki bez View Transitions (klasa .no-vt z boot.js): treść płynnie znika, zanim przeglądarka przejdzie
   na inną podstronę tej witryny. */
function initPageLeave() {
  if (!doc.classList.contains('no-vt')) return;
  const LEAVE_MS = 250; // tyle trwa znikanie treści (.leaving w global.css)

  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    event.preventDefault();
    doc.classList.add('leaving');
    setTimeout(() => location.assign(url.href), LEAVE_MS);
  });

  // powrót przyciskiem „wstecz” z pamięci podręcznej przeglądarki: strona musi być znowu widoczna
  addEventListener('pageshow', (event) => {
    if (event.persisted) doc.classList.remove('leaving');
  });
}
