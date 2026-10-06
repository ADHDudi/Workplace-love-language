import { test, expect, type APIRequestContext } from '@playwright/test';

// The "Powered by" Just AI IT logo in the footers (WelcomeScreen, LegalPage, ResultScreen).
// Its <img onError> swaps in a CSS text fallback, so a missing /logo.svg is easy to miss by eye.

// A dev server answers unknown paths with index.html and a 200, so every asset check also asserts its type.
async function fetchAsset(request: APIRequestContext, url: string, type: string | RegExp) {
  const res = await request.get(url);
  expect(res.status(), url).toBe(200);
  expect(res.headers()['content-type'], url).toMatch(type);
  return res;
}

test.describe('Powered by Just AI IT logo', () => {
  test('/logo.svg is served as an SVG image', async ({ request }) => {
    const svg = await (await fetchAsset(request, '/logo.svg', /image\/svg\+xml/)).text();
    expect(svg.trimStart()).toMatch(/^<svg\b/);
  });

  test('the welcome screen footer shows the logo', async ({ page }) => {
    await page.goto('/');

    const logo = page.getByRole('link', { name: /Powered by/ }).getByRole('img', { name: 'Just AI IT Logo' });
    await expect(logo).toBeVisible();
    // The image actually decoded; a broken one is hidden by onError, and alt text alone can look visible.
    await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
    const box = (await logo.boundingBox())!;
    expect(box.width).toBeGreaterThan(box.height);
  });
});
