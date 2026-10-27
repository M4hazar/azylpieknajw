# Azyl Piękna · strona salonu

Strona salonu kosmetologicznego i trychologicznego Julii Wróbel w Lubinie. Statyczna strona w Astro 7, hostowana na
OVH (Apache, wgrywana przez FTP). Autor: Paweł Hejna (https://github.com/m4hazar). Opis projektu: `README.md`.

## Polecenia

- `pnpm dev`: serwer deweloperski (http://localhost:4321). Gdy działa agent AI, Astro uruchamia go w tle
  (`pnpm astro dev stop`, `pnpm astro dev logs`).
- `pnpm build`, potem `pnpm preview --ignore-lock`: wersja produkcyjna w `dist/`.
- `pnpm qa`: komplet kontroli (Prettier, ESLint, Stylelint, `astro check`, budowanie, html-validate, linki,
  Playwright z axe, Lighthouse CI). Uruchom przed zgłoszeniem, że coś jest gotowe.

## Treści (zasady klientki)

- Teksty po polsku, głosem Julii w 1. osobie liczby pojedynczej („zapraszam”, „dobieram”). Mów „salon”, nie „gabinet”.
- Bez cen i promocji: ceny, terminy i rezerwacje są tylko w Booksy (https://azylpieknajw.booksy.com/). Każdy
  przycisk rezerwacji prowadzi do Booksy w nowej karcie (test w `tests/`).
- Nie wymyślaj kwalifikacji, nagród, stażu, opinii, efektów zabiegów ani danych kontaktowych. Nie obiecuj
  wyleczenia problemów skóry ani włosów. Opinie: tylko zweryfikowane, inaczej odnośnik do opinii w Booksy.
- Zdjęć stockowych ani generowanych nie przedstawiaj jako salonu lub Julii. Bez zdjęcia ramka pokazuje grafikę
  marki (`src/components/Visual.astro`).
- Z CEIDG publikujemy tylko: imię i nazwisko, NIP, REGON i adres działalności. Bez adresu do doręczeń.
- Pliki z danymi klientek, wizyt i SMS nigdy nie trafiają do repozytorium ani na stronę.

## Kod

- Dane w `src/data/` (salon, oferta, obrazy, galeria); komponenty nie powtarzają adresu, telefonu ani linków.
- Style: tokeny z `src/styles/tokens.css`, wspólne klasy w `global.css`, reszta w `<style>` komponentu. Klasa
  przekazana do komponentu-dziecka nie dostaje zasięgu stylów rodzica: w rodzicu pisz `.rodzic :global(.klasa)`.
- Sekcje mają `data-theme="light|dark"`; od niego zależą kolory tekstu i wygląd nagłówka nad sekcją.
- Animacje: GSAP (`[data-reveal]`, `[data-split]`, `[data-parallax]` w `src/scripts/motion.ts`), a pierwszy ekran
  podstron samym CSS (`[data-rise]`). Zawsze z obsługą `prefers-reduced-motion`; bez JavaScriptu treść widoczna.
- Content-Security-Policy generuje Astro (`security.csp`): żadnych atrybutów `style=""` ani skryptów inline poza
  `boot.js` (jego hash liczy `astro.config.mjs`), żadnych zewnętrznych skryptów i fontów.
- `compressHTML` usuwa odstęp między sąsiednimi wyrażeniami `{...}`: łącz je w jednym szablonie tekstowym albo
  wstaw `{' '}`.
- Dostępność: WCAG 2.2 AA (axe w testach), kontrast tekstu co najmniej 4,5:1, cele dotykowe od 44 px.
- Obrazy przez `Visual.astro` / `<Picture>` z AVIF i WebP; `position` musi być wartością zrozumiałą dla sharp.
- Aktualne API sprawdzaj w dokumentacji (serwery MCP `astro-docs` i `context7`), nie z pamięci.
