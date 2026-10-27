// Ruch przy przewijaniu (GSAP + ScrollTrigger + SplitText), tylko gdy boot.js ustawił klasę .motion
// (ruch dozwolony i skrypty ruszyły na czas). Bez niej cała treść jest widoczna od razu.
//   [data-reveal]    element wyłania się od dołu; sąsiednie elementy w jednej chwili idą jeden po drugim,
//   [data-split]     nagłówek: wiersze wysuwają się spod maski,
//   [data-parallax]  obraz w ramce przesuwa się wolniej niż strona.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export function initMotion() {
  const doc = document.documentElement;
  if (!doc.classList.contains('motion')) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  doc.classList.add('motion-ready');

  gsap.set('[data-reveal]', { y: 28 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (elements) =>
      gsap.to(elements, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
  });

  // nagłówki dzielone na wiersze dopiero po wczytaniu krojów, żeby podział zgadzał się z tym, co widać
  document.fonts.ready.then(() => {
    for (const heading of gsap.utils.toArray<HTMLElement>('[data-split]')) {
      const split = SplitText.create(heading, { type: 'lines', mask: 'lines' });
      gsap.set(heading, { visibility: 'visible' });
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
        onComplete: () => split.revert(),
      });
    }
    ScrollTrigger.refresh();
  });

  for (const frame of gsap.utils.toArray<HTMLElement>('[data-parallax]')) {
    const image = frame.querySelector('img');
    if (!image) continue;
    gsap.fromTo(
      image,
      { yPercent: -5, scale: 1.12 },
      {
        yPercent: 5,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }
}
