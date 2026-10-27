import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BOOKSY = 'https://azylpieknajw.booksy.com/';

const pages = [
  '/',
  '/head-spa-i-trychologia/',
  '/zabiegi-na-twarz/',
  '/manicure-i-pedicure/',
  '/brwi-i-rzesy/',
  '/polityka-prywatnosci/',
  '/404.html',
];

for (const path of pages) {
  test.describe(`strona ${path}`, () => {
    test('ładuje się bez błędów w konsoli i bez naruszeń CSP', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
    });

    test('spełnia WCAG 2.2 AA (axe)', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations).toEqual([]);
    });

    test('mieści się w szerokości ekranu', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('każdy odnośnik do Booksy otwiera profil salonu w nowej karcie', async ({ page }) => {
      await page.goto(path);
      const links = page.locator('a[href*="booksy.com"]');
      expect(await links.count()).toBeGreaterThan(0);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('href', BOOKSY);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', /noopener/);
      }
    });
  });
}

test('nagłówek ma przycisk „Umów wizytę” prowadzący do Booksy', async ({ page, isMobile }) => {
  test.skip(isMobile, 'na telefonie przycisk jest w menu i w pasku na dole');
  await page.goto('/zabiegi-na-twarz/');
  const cta = page.locator('header').getByRole('link', { name: /Umów wizytę/ });
  await expect(cta).toHaveAttribute('href', BOOKSY);
});

test('lot ptaka: przy wejściu z zewnątrz tak, po powrocie z podstrony nie', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\bintro\b/);
  await page.goto('/brwi-i-rzesy/');
  await page.locator('.crumbs a[href="/"]').click();
  await page.waitForURL('/');
  await expect(page.locator('html')).not.toHaveClass(/\bintro\b/);
});

test('menu na telefonie otwiera się i zamyka klawiszem Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'tylko na telefonie');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/zabiegi-na-twarz/');
  await page.getByRole('button', { name: 'Otwórz menu' }).click();
  const menu = page.locator('#menu-mobile');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link', { name: /Head Spa i trychologia/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
});

test('pasek rezerwacji pojawia się na telefonie po przewinięciu', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'tylko na telefonie');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/head-spa-i-trychologia/');
  const bar = page.locator('[data-booking-bar]');
  await expect(bar).not.toHaveAttribute('data-visible');
  await page.evaluate(() => scrollTo(0, innerHeight * 1.5));
  await expect(bar).toHaveAttribute('data-visible');
});

test('wygląd strony głównej (zrzut ekranu do porównań)', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await testInfo.attach('strona-glowna', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});
