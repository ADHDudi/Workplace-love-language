import { test, expect, devices, type Page, type APIRequestContext } from '@playwright/test';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

// The app icon (JUS-458 master SVGs, JUS-459 browser/home-screen wiring, JUS-460 in-app logo),
// checked on a desktop and on two mobile viewports. Everything runs in Chromium, so the mobile
// profiles drop their default browser and keep only viewport, touch and user agent.

const BRAND_VIOLET = '#8c50f0';
const HEART_GRADIENT = ['#a014f0', '#8c50f0', '#5078ff', '#3cdcf0'];
const OLD_BLUE = '#2563eb';

const withoutBrowser = ({ defaultBrowserType: _, ...rest }: (typeof devices)[string]) => rest;
const VIEWPORTS = {
  desktop: withoutBrowser(devices['Desktop Chrome']),
  'iPhone SE': withoutBrowser(devices['iPhone SE (3rd gen)']),
  'Pixel 7': withoutBrowser(devices['Pixel 7']),
};

const LOGO_NAME = { en: 'Workplace Love Language logo', he: 'הלוגו של שפת האהבה בעבודה' };

const MASTER_SVGS = ['icon.svg', 'icon-maskable.svg', 'icon-small.svg', 'icon-mark.svg'];

// A dev server answers unknown paths with index.html and a 200, so every asset check also asserts its type.
async function fetchAsset(request: APIRequestContext, url: string, type: string | RegExp) {
  const res = await request.get(url);
  expect(res.status(), url).toBe(200);
  expect(res.headers()['content-type'], url).toMatch(type);
  return res;
}

function pngInfo(buf: Buffer) {
  expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG');
  // IHDR: width, height, bit depth, color type (2 = RGB, 6 = RGBA)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), colorType: buf[25] };
}

function icoSizes(buf: Buffer) {
  expect(buf.readUInt16LE(0)).toBe(0);
  expect(buf.readUInt16LE(2)).toBe(1);
  return Array.from({ length: buf.readUInt16LE(4) }, (_, i) => buf[6 + i * 16] || 256);
}

// Draws an image URL into a canvas on the app's origin and returns its RGBA pixels.
async function rasterize(page: Page, url: string, size: number) {
  return page.evaluate(async ({ url, size }) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, size, size);
    return Array.from(ctx.getImageData(0, 0, size, size).data);
  }, { url, size });
}

// A pixel that is clearly part of the colored mark: opaque enough and saturated (not white/grey).
const isColored = (px: number[], i: number) =>
  px[i + 3] > 128 && Math.max(px[i], px[i + 1], px[i + 2]) - Math.min(px[i], px[i + 1], px[i + 2]) > 60;

function coloredShare(px: number[], size: number, region: (x: number, y: number) => boolean) {
  let colored = 0, total = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!region(x, y)) continue;
      total++;
      if (isColored(px, (y * size + x) * 4)) colored++;
    }
  }
  return colored / total;
}

test.describe('App icon artwork (JUS-458)', () => {
  for (const file of MASTER_SVGS) {
    test(`${file} is a square, vector-only SVG in the brand colors`, async ({ request }) => {
      const svg = await (await fetchAsset(request, `/icons/${file}`, /image\/svg\+xml/)).text();

      const [, w, h] = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/) ?? [];
      expect(w, 'has a viewBox').toBeTruthy();
      expect(w).toBe(h);
      expect(svg).not.toMatch(/<image\b|data:image/i);
      expect(svg.toLowerCase()).not.toContain(OLD_BLUE);
      for (const color of HEART_GRADIENT) expect(svg.toLowerCase()).toContain(color);
    });
  }

  test('the maskable icon keeps the mark inside the 80% safe zone', async ({ page }) => {
    await page.goto('/');
    const size = 256;
    const px = await rasterize(page, '/icons/icon-maskable.svg', size);
    const c = size / 2;
    const outsideSafeZone = (x: number, y: number) => Math.hypot(x + 0.5 - c, y + 0.5 - c) > size * 0.4;

    expect(coloredShare(px, size, outsideSafeZone)).toBe(0);
    // Full bleed: the corners are the opaque white tile, not transparent.
    for (const [x, y] of [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]) {
      const i = (y * size + x) * 4;
      expect(px.slice(i, i + 4)).toEqual([255, 255, 255, 255]);
    }
    // The mark still fills a good part of the safe zone rather than shrinking to a dot.
    expect(coloredShare(px, size, (x, y) => !outsideSafeZone(x, y))).toBeGreaterThan(0.2);
  });

  for (const size of [16, 32]) {
    test(`the small icon still reads as a heart held by two hands at ${size}px`, async ({ page }) => {
      await page.goto('/');
      const px = await rasterize(page, '/icons/icon-small.svg', size);
      const third = size / 3;

      expect(coloredShare(px, size, () => true), 'mark fills the tile').toBeGreaterThan(0.3);
      expect(coloredShare(px, size, (x, y) => x >= third && x < 2 * third && y < size / 2), 'heart').toBeGreaterThan(0.4);
      expect(coloredShare(px, size, (x, y) => x < third && y >= size / 2), 'left hand').toBeGreaterThan(0.2);
      expect(coloredShare(px, size, (x, y) => x >= 2 * third && y >= size / 2), 'right hand').toBeGreaterThan(0.2);
    });
  }
});

test.describe('App metadata colors (JUS-459)', () => {
  test('the metadata files use the brand violet instead of the old blue', async ({ request }) => {
    const served = await (await fetchAsset(request, '/metadata.json', /json/)).json();
    const root = JSON.parse(readFileSync(new URL('../metadata.json', import.meta.url), 'utf8'));

    for (const meta of [served, root]) {
      expect(meta).toMatchObject({ color: BRAND_VIOLET, iconColor: BRAND_VIOLET, themeColor: BRAND_VIOLET });
      expect(JSON.stringify(meta).toLowerCase()).not.toContain(OLD_BLUE);
    }
  });
});

for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`on ${viewportName}`, () => {
    test.use(viewport);

    test.describe('browser and home-screen icons (JUS-459)', () => {
      test('the page head links the favicon, touch icon, manifest and theme color', async ({ page, request }) => {
        await page.goto('/');
        const head = page.locator('head');

        await expect(head.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/icons/favicon.svg');
        await expect(head.locator('link[rel="icon"][sizes="32x32"]')).toHaveAttribute('href', '/icons/favicon-32.png');
        await expect(head.locator('link[rel="icon"][sizes="16x16"]')).toHaveAttribute('href', '/icons/favicon-16.png');
        await expect(head.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/apple-touch-icon.png');
        await expect(head.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
        await expect(head.locator('meta[name="theme-color"]')).toHaveAttribute('content', BRAND_VIOLET);
        await expect(head.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', 'Love Language');

        await fetchAsset(request, '/icons/favicon.svg', /image\/svg\+xml/);
        for (const [url, size] of [['/icons/favicon-32.png', 32], ['/icons/favicon-16.png', 16]] as const) {
          const png = await (await fetchAsset(request, url, 'image/png')).body();
          expect(pngInfo(png)).toMatchObject({ width: size, height: size });
        }
      });

      test('/favicon.ico holds 16, 32 and 48px images for legacy browsers', async ({ request }) => {
        const ico = await (await fetchAsset(request, '/favicon.ico', /image\/(x-icon|vnd\.microsoft\.icon)/)).body();
        expect(icoSizes(ico).sort((a, b) => a - b)).toEqual([16, 32, 48]);
      });

      test('the iOS touch icon is an opaque 180px square', async ({ request }) => {
        const png = await (await fetchAsset(request, '/icons/apple-touch-icon.png', 'image/png')).body();
        // Color type 2 is RGB with no alpha channel, so iOS never fills the corners with black.
        expect(pngInfo(png)).toEqual({ width: 180, height: 180, colorType: 2 });
      });

      test('the web manifest makes the app installable with brand colors and icons', async ({ request }) => {
        const manifest = await (await fetchAsset(request, '/manifest.webmanifest', /application\/manifest\+json/)).json();

        expect(manifest).toMatchObject({
          name: 'Workplace Love Language',
          short_name: 'Love Language',
          start_url: '/',
          display: 'standalone',
          theme_color: BRAND_VIOLET,
          background_color: '#ffffff',
        });
        expect(manifest.icons).toEqual(expect.arrayContaining([
          expect.objectContaining({ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }),
          expect.objectContaining({ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }),
          expect.objectContaining({ src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }),
        ]));
        for (const icon of manifest.icons) {
          const png = await (await fetchAsset(request, icon.src, 'image/png')).body();
          const [w, h] = icon.sizes.split('x').map(Number);
          expect(pngInfo(png), icon.src).toMatchObject({ width: w, height: h });
        }
      });
    });

    test.describe('in-app logo (JUS-460)', () => {
      for (const language of ['he', 'en'] as const) {
        test(`the welcome badge shows the new mark in ${language === 'he' ? 'Hebrew (RTL)' : 'English (LTR)'}`, async ({ page }) => {
          await page.goto('/');
          if (language === 'en') {
            await page.locator('button:has-text("English")').click({ force: true });
            await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
          } else {
            await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
          }

          const logo = page.getByRole('img', { name: LOGO_NAME[language], exact: true });
          await expect(logo).toBeVisible();
          await expect(page.locator('.lucide-heart-handshake')).toHaveCount(0);

          // Sized for the viewport: about 28px+ on phones, 40px+ from the md breakpoint up.
          const box = (await logo.boundingBox())!;
          const isDesktop = viewportName === 'desktop';
          expect(box.width).toBeGreaterThanOrEqual(isDesktop ? 40 : 28);
          expect(box.width).toBeCloseTo(box.height, 0);

          // Never mirrored by the RTL layout.
          const mirrored = await logo.evaluate((el) => {
            for (let node: Element | null = el; node; node = node.parentElement) {
              const t = getComputedStyle(node).transform;
              if (t !== 'none' && new DOMMatrix(t).a < 0) return true;
            }
            return false;
          });
          expect(mirrored).toBe(false);

          // Its gradients resolve, so it renders in brand colors rather than flat black.
          const shot = await logo.screenshot({ animations: 'disabled' });
          const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
          let violet = 0, cyan = 0;
          for (let i = 0; i < data.length; i += info.channels) {
            const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
            if (b > 180 && r > 100 && g < 120) violet++;
            if (b > 180 && g > 160 && r < 140) cyan++;
          }
          expect(violet, 'violet/indigo pixels').toBeGreaterThan(0);
          expect(cyan, 'cyan pixels').toBeGreaterThan(0);
        });
      }

      test('the badge and headline stay above the fold with no sideways scroll', async ({ page }) => {
        await page.goto('/');
        const logo = page.getByRole('img', { name: LOGO_NAME.he, exact: true });
        await expect(logo).toBeVisible();

        const viewportHeight = page.viewportSize()!.height;
        for (const el of [logo, page.locator('h1')]) {
          const box = (await el.boundingBox())!;
          expect(box.y + box.height).toBeLessThanOrEqual(viewportHeight);
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    });
  });
}
