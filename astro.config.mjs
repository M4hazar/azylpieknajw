// @ts-check
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Skrypt startowy (src/scripts/boot.js) jest wstawiany inline w <head>, bo musi zadziałać przed pierwszym
// malowaniem strony. Astro nie liczy hashy dla skryptów inline, więc jego hash dopisujemy do CSP sami.
const boot = readFileSync(new URL('./src/scripts/boot.js', import.meta.url), 'utf8');
const bootHash = /** @type {const} */ (`sha256-${createHash('sha256').update(boot).digest('base64')}`);

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://azylpieknajw.pl',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  // Content-Security-Policy w <meta> każdej strony: hashe skryptów i stylów (bez 'unsafe-inline') plus reszta zasad
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: { hashes: [bootHash] },
    },
  },
  // bez kolorowania kodu (Shiki wymaga stylów inline, które CSP blokuje)
  markdown: { syntaxHighlight: false },
  image: {
    // AVIF i WebP generowane przy budowaniu (sharp)
    layout: 'constrained',
    responsiveStyles: true,
  },
  vite: {
    css: {
      // Lightning CSS: prefiksy i minifikacja według .browserslistrc
      transformer: 'lightningcss',
    },
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
