# Azyl Piękna · strona salonu

Strona salonu kosmetologicznego i trychologicznego Julii Wróbel w Lubinie: Head Spa, konsultacje trychologiczne,
zabiegi na twarz, manicure i pedicure, brwi i rzęsy. Rezerwacje, ceny i terminy prowadzi Booksy
(https://azylpieknajw.booksy.com/); strona przedstawia salon i kieruje do rezerwacji.

Projekt i realizacja: **Paweł Hejna** · https://github.com/m4hazar

## Strony

| Adres                      | Zawartość                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/`                        | intro z lotem ptaka, o salonie, oferta, Head Spa, Julia, pierwsza wizyta, (galeria), opinie, kontakt |
| `/head-spa-i-trychologia/` | rytuały Head Spa krok po kroku i konsultacja trychologiczna                                          |
| `/zabiegi-na-twarz/`       | PCA Skin, oczyszczanie wodorowe, peeling kawitacyjny, zabiegi Hydro                                  |
| `/manicure-i-pedicure/`    | manicure hybrydowy, japoński i klasyczny, przedłużanie żelem, pedicure                               |
| `/brwi-i-rzesy/`           | architektura i laminacja brwi, lifting i henna rzęs                                                  |
| `/polityka-prywatnosci/`   | polityka prywatności i cookies                                                                       |
| `/404.html`                | strona błędu (Apache pokazuje ją dzięki `ErrorDocument` w `.htaccess`)                               |

## Wymagania

- Node.js 24 LTS (wersja w `.node-version`) i pnpm 10: `corepack enable`, potem `pnpm install`.
- Przed pierwszymi testami: `pnpm exec playwright install chromium`. Lighthouse używa zainstalowanego Chrome albo
  ścieżki ze zmiennej `CHROME_PATH` (tę samą zmienną czyta konfiguracja Playwright).

## Polecenia

| Polecenie       | Co robi                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------ |
| `pnpm dev`      | serwer deweloperski z podglądem na żywo (http://localhost:4321)                            |
| `pnpm build`    | gotowa strona w `dist/` (to wgrywa się na serwer)                                          |
| `pnpm preview`  | podgląd zbudowanej strony                                                                  |
| `pnpm format`   | formatowanie kodu (Prettier)                                                               |
| `pnpm lint`     | ESLint (JS, TS, Astro, dostępność) i Stylelint (CSS)                                       |
| `pnpm check`    | sprawdzenie typów i szablonów Astro                                                        |
| `pnpm validate` | walidacja HTML zbudowanej strony (html-validate)                                           |
| `pnpm links`    | czy wszystkie wewnętrzne linki i pliki istnieją                                            |
| `pnpm test`     | Playwright na komputerze i telefonie: konsola, CSP, WCAG 2.2 AA (axe), Booksy, menu, intro |
| `pnpm lhci`     | Lighthouse CI dla wszystkich stron: wydajność, dostępność, dobre praktyki, SEO             |
| `pnpm qa`       | wszystko powyżej po kolei                                                                  |

## Zdjęcia i treści

Wszystkie dane, które mogą się zmieniać, są w `src/data/`:

- `salon.ts`: nazwa, adres, telefon, Instagram, link do Booksy, NIP i REGON, ocena z Booksy (z datą).
- `oferta.ts`: cztery kategorie zabiegów z opisami, wariantami i czasem trwania (bez cen), teksty podstron.
- `galeria.ts`: opisy zdjęć galerii.

**Zdjęcia sekcji.** Dopóki nie ma prawdziwego zdjęcia, w ramce jest grafika marki (satyna w kolorach salonu,
`src/assets/grafiki/`). Zdjęcie wystarczy wrzucić do `src/assets/zdjecia/` pod jedną z nazw (jpg, png lub webp):

| Plik       | Gdzie się pojawi                                               |
| ---------- | -------------------------------------------------------------- |
| `julia`    | sekcja „Poznaj Julię” (jest)                                   |
| `head-spa` | sekcja Head Spa na stronie głównej, oferta, podstrona Head Spa |
| `twarz`    | oferta, podstrona „Zabiegi na twarz”                           |
| `dlonie`   | oferta, podstrona „Manicure i pedicure”                        |
| `brwi`     | oferta, podstrona „Brwi i rzęsy”                               |

Astro przytnie i zmniejszy zdjęcie przy budowaniu (AVIF i WebP). Najlepiej pionowe, co najmniej 1600 px w dłuższym
boku. Tylko zdjęcia z salonu: grafik ze stocku ani generowanych nie pokazujemy jako salonu ani Julii.

**Galeria.** Zdjęcia do `src/assets/galeria/`, a w `src/data/galeria.ts` opis każdego pliku. Sekcja galerii
i pozycja „Galeria” w menu pojawią się same przy pierwszym zdjęciu; zdjęcie bez opisu zatrzyma budowanie.

## Jak to działa

- **Astro 7** (Vite 8): strona statyczna, obrazy z `astro:assets` (sharp), mapa strony (`@astrojs/sitemap`),
  Content-Security-Policy w `<meta>` z hashami skryptów i stylów (`security.csp` w `astro.config.mjs`).
- **Style**: zwykły CSS. Tokeny (kolory, kroje, odstępy, rytm) w `src/styles/tokens.css`, wspólne klasy
  w `src/styles/global.css`, reszta w `<style>` komponentów. Lightning CSS dodaje prefiksy według `.browserslistrc`.
- **Kroje pisma**: Cormorant Garamond (nagłówki), Source Sans 3 (tekst), Tenor Sans (etykiety), z paczek Fontsource,
  hostowane razem ze stroną.
- **Ruch**: `src/scripts/boot.js` (inline w `<head>`) ustawia klasy stanu przed pierwszym malowaniem. Intro ptaka
  (`src/scripts/intro/`) gra tylko przy wejściu na stronę główną z zewnątrz, nie po powrocie z podstrony ani
  przyciskiem „wstecz”; przycisk „Odtwórz lot ponownie” powtarza je na życzenie. Animacje przy przewijaniu
  (`motion.ts`) używają GSAP. Przy ograniczonym ruchu w systemie wszystko jest statyczne, a bez JavaScriptu
  treść jest widoczna od razu.
- **Nagłówek** zmienia kolor zależnie od sekcji pod nim (atrybut `data-theme` sekcji), chowa się przy przewijaniu
  w dół. Na telefonie menu jest w oknie dialogowym, a po przewinięciu pojawia się pasek „Umów wizytę”.
- **Serwer**: `public/.htaccess` dla Apache na OVH (strona 404, przekierowanie starej polityki prywatności,
  nagłówki bezpieczeństwa, kompresja, długa pamięć podręczna dla plików z `/_astro/`).

### Lighthouse

Progi są w `lighthouserc.json`: dostępność 100, dobre praktyki i SEO co najmniej 95, wydajność co najmniej 90
na podstronach. Na stronie głównej próg wydajności to 85, bo intro celowo pokazuje treść dopiero po wylądowaniu
ptaka (ok. 3,5 s), a Lighthouse czeka 5 s po wczytaniu, żeby uczciwie zmierzyć tę chwilę jako LCP.

## Publikacja

`pnpm build` i wgranie zawartości `dist/` na serwer (FTP, katalog `www/`). Workflow `.github/workflows/ci.yml`
przy każdym pushu i pull requeście uruchamia kontrolę jakości, a na gałęzi `main` może też publikować na OVH:

1. Settings → Environments → środowisko `produkcja` z sekretami `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.
2. Settings → Variables → `DEPLOY_ENABLED` = `true`. Opcjonalnie `FTP_PROTOCOL` (domyślnie `ftps`) i
   `FTP_SERVER_DIR` (domyślnie `./www/`).

Bez zmiennej `DEPLOY_ENABLED` nic nie jest publikowane automatycznie.

## Struktura

```
src/pages/              strony (index, cztery kategorie, polityka prywatności, 404)
src/layouts/            Base.astro (meta, Open Graph, kroje, nagłówek, stopka), CategoryPage.astro
src/components/         nagłówek, stopka, pasek rezerwacji, komunikat o cookies, Visual (obraz w ramce)
src/components/home/    sekcje strony głównej
src/components/category/ sekcje podstron z zabiegami
src/components/intro/   logo z animowanym ptakiem
src/data/               dane salonu, oferta, obrazy, galeria
src/scripts/            boot.js, intro, nagłówek, animacje, lightbox, elementy stałe
src/styles/             tokens.css, global.css
src/assets/             grafiki marki, zdjęcia, galeria (przetwarzane przy budowaniu)
public/                 pliki kopiowane bez zmian (.htaccess, sygnet, favicony, obraz Open Graph)
tests/                  testy Playwright + axe
```

## Licencje

- GSAP 3.15: licencja standardowa GreenSock (bezpłatna, także komercyjnie).
- Cormorant Garamond, Tenor Sans, Source Sans 3: SIL Open Font License 1.1.
- Skille GSAP w `.claude/skills/`: MIT, © GreenSock.
- Logo, zdjęcia i treści: Azyl Piękna, Julia Wróbel.
