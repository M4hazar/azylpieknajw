// Obrazy przetwarzane przy budowaniu (astro:assets). Grafiki marki są w src/assets/grafiki, prawdziwe zdjęcia
// w src/assets/zdjecia. Komponent Visual pokazuje zdjęcie, gdy plik o danej nazwie istnieje, a w przeciwnym razie
// grafikę zastępczą, więc nowe zdjęcie wystarczy wrzucić do folderu pod właściwą nazwą.
import type { ImageMetadata } from 'astro';

type ImageModule = { default: ImageMetadata };

const byName = (files: Record<string, ImageModule>) =>
  new Map(Object.entries(files).map(([path, mod]) => [path.replace(/^.*\/|\.\w+$/g, ''), mod.default]));

const art = byName(import.meta.glob<ImageModule>('../assets/grafiki/*.jpg', { eager: true }));
const photos = byName(import.meta.glob<ImageModule>('../assets/zdjecia/*.{jpg,jpeg,png,webp}', { eager: true }));

export function artImage(name: string): ImageMetadata {
  const image = art.get(name);
  if (!image) throw new Error(`Nie ma grafiki „${name}” w src/assets/grafiki`);
  return image;
}

export const photo = (name: string): ImageMetadata | undefined => photos.get(name);
