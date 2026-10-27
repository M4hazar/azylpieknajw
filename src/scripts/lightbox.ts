// Powiększanie zdjęć z galerii (src/components/home/Gallery.astro) w oknie <dialog>: strzałki na ekranie
// i na klawiaturze, przesunięcie palcem, Escape zamyka. Bez JavaScriptu odnośnik po prostu otwiera zdjęcie.

export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-lightbox]')];
  if (!dialog || !links.length) return;

  const figure = dialog.querySelector<HTMLElement>('.lightbox__figure')!;
  const image = document.createElement('img');
  image.className = 'lightbox__image';
  figure.prepend(image);
  const caption = dialog.querySelector<HTMLElement>('.lightbox__caption')!;
  const count = dialog.querySelector<HTMLElement>('.lightbox__count')!;
  let current = 0;

  const show = (index: number) => {
    current = (index + links.length) % links.length;
    const link = links[current];
    const alt = link.querySelector('img')?.alt ?? '';
    image.src = link.href;
    image.alt = alt;
    caption.textContent = alt;
    count.textContent = `${current + 1} / ${links.length}`;
  };

  links.forEach((link, i) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      show(i);
      dialog.showModal();
    }),
  );

  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
  // kliknięcie w tło zamyka okno
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  let startX = 0;
  dialog.addEventListener('pointerdown', (event) => (startX = event.clientX));
  dialog.addEventListener('pointerup', (event) => {
    const dx = event.clientX - startX;
    if (event.pointerType !== 'mouse' && Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
}
