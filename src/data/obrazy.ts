// Zdjęcia z salonu przetwarzane przy budowaniu (astro:assets). Leżą w src/assets/zdjecia pod stałymi nazwami
// (julia, head-spa, twarz, dlonie, brwi). Miejsce na zdjęcie pojawia się na stronie dopiero wtedy, gdy plik
// istnieje, więc nowe zdjęcie wystarczy wrzucić do folderu pod właściwą nazwą.
import type { ImageMetadata } from 'astro';

type ImageModule = { default: ImageMetadata };

const photos = new Map(
  Object.entries(import.meta.glob<ImageModule>('../assets/zdjecia/*.{jpg,jpeg,png,webp}', { eager: true })).map(
    ([path, mod]) => [path.replace(/^.*\/|\.\w+$/g, ''), mod.default],
  ),
);

export const photo = (name: string): ImageMetadata | undefined => photos.get(name);
