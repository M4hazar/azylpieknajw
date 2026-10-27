// Nagłówek strony (src/components/Header.astro):
//   - mniejszy pasek z tłem po przewinięciu, chowanie przy przewijaniu w dół,
//   - logo na stronie głównej dopiero wtedy, gdy duży sygnet zniknie z ekranu,
//   - rozwijana oferta na komputerze i menu na telefonie (<dialog>).

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  watchScroll(header);
  watchBrand(header);
  initOfferMenu(header);
  initMobileMenu();
}

function watchScroll(header: HTMLElement) {
  let lastY = scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = scrollY;
    header.toggleAttribute('data-scrolled', y > 8);
    // chowanie dopiero za początkiem strony i przy wyraźnym ruchu, żeby nagłówek nie migał
    if (Math.abs(y - lastY) > 6) {
      header.toggleAttribute('data-hidden', y > lastY && y > innerHeight * 0.6);
      lastY = y;
    }
  };

  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

function watchBrand(header: HTMLElement) {
  const mark = document.querySelector('.hero .mark');
  if (!mark || header.dataset.brand !== 'hidden') return;
  new IntersectionObserver(
    ([entry]) => {
      header.dataset.brand = entry.isIntersecting ? 'hidden' : 'visible';
    },
    // dopiero gdy sygnet schowa się pod nagłówkiem, w nagłówku pojawia się logo
    { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` },
  ).observe(mark);
}

/* Rozwijana oferta (wzorzec „disclosure”): przycisk z aria-expanded i panel. Otwiera się kliknięciem, Enterem
   lub spacją, a myszką także po najechaniu. Zamyka Escape, kliknięcie obok i wyjście fokusem poza menu. */
function initOfferMenu(header: HTMLElement) {
  const item = header.querySelector<HTMLElement>('[data-offer]');
  const button = item?.querySelector<HTMLButtonElement>('button[aria-controls]');
  const panel = button && document.getElementById(button.getAttribute('aria-controls')!);
  if (!item || !button || !panel) return;

  let closeTimer = 0;
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean) => {
    clearTimeout(closeTimer);
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    header.classList.toggle('is-open', open);
  };

  const hoverCapable = matchMedia('(hover: hover) and (pointer: fine)');

  // kliknięcie myszką przy otwartym już (po najechaniu) panelu nie zamyka go; klawiatura przełącza
  button.addEventListener('click', (event) => setOpen(hoverCapable.matches && event.detail > 0 ? true : !isOpen()));

  item.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && hoverCapable.matches) setOpen(true);
  });
  item.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && hoverCapable.matches)
      closeTimer = window.setTimeout(() => setOpen(false), 220);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (isOpen() && !item.contains(event.target as Node)) setOpen(false);
  });
  item.addEventListener('focusout', (event) => {
    if (isOpen() && !item.contains(event.relatedTarget as Node | null)) setOpen(false);
  });
  // po wyborze odnośnika do sekcji tej samej strony panel się zamyka
  panel.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false);
  });
}

/* Menu na telefonie: <dialog> otwierany jako modalny, więc fokus zostaje w środku, a Escape go zamyka. */
function initMobileMenu() {
  const dialog = document.querySelector<HTMLDialogElement>('#menu-mobile');
  const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openButton) return;

  openButton.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) dialog.close();
  });
  // po powiększeniu okna do szerokości komputera menu nie zostaje otwarte
  matchMedia('(width >= 60rem)').addEventListener('change', (event) => {
    if (event.matches && dialog.open) dialog.close();
  });
}
