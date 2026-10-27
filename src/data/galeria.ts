// Galeria: zdjęcia z src/assets/galeria i ich opisy dla czytników ekranu i wyszukiwarek. Sekcja galerii
// i pozycja „Galeria” w menu pojawiają się same, gdy jest tu choć jedno zdjęcie. Kolejność jak w opisach.
import type { ImageMetadata } from 'astro';

const descriptions: Record<string, string> = {
  // 'stanowisko-head-spa.jpg': 'Stanowisko do Head Spa w salonie Azyl Piękna',
};

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/galeria/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

const images = new Map(Object.entries(files).map(([path, mod]) => [path.replace(/^.*\//, ''), mod.default]));

for (const name of images.keys()) {
  if (!descriptions[name]) throw new Error(`Zdjęcie src/assets/galeria/${name} nie ma opisu w src/data/galeria.ts`);
}

export const gallery = Object.entries(descriptions).flatMap(([name, alt]) => {
  const src = images.get(name);
  return src ? [{ src, alt }] : [];
});
