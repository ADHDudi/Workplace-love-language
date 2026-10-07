import { test, expect } from '@playwright/test';

// Regression tests for mobile layout bugs (JUS-446, JUS-447).

test.describe('Mobile layout', () => {
  test('JUS-446: no blank band between the top bar and the app card', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const topBar = page.locator('div.fixed.top-0').first();
    const card = page.locator('div.max-w-5xl').first();
    await expect(card).toBeVisible();

    const bar = (await topBar.boundingBox())!;
    const cardBox = (await card.boundingBox())!;
    expect(cardBox.y - (bar.y + bar.height), 'gap below the top bar (px)').toBeLessThanOrEqual(1);
  });

  // Short phone screens (iPhone SE, or any phone once Safari's toolbars take their share)
  test('JUS-447: the full question text is visible, not squashed by the answers below it', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.addInitScript(() => {
      (window as any).__E2E_MOCK_USER__ = { uid: 'test-user-123', email: 'test-user@example.com', displayName: 'Test User' };
    });
    await page.goto('/');
    await page.locator('button:has-text("English")').click({ force: true });
    await page.getByRole('button', { name: 'Individual Contributor', exact: true }).click();
    await page.click('button:has-text("Start Free Analysis")');

    // Question 2 is the long one from the ticket screenshot.
    await page.locator('button.w-full.text-start').first().click();
    await expect(page.getByText('Question 2 of 9')).toBeVisible();
    const questionCard = page.locator('div:has(> h2)').filter({ hasText: 'outperformed' });
    await expect(questionCard).toBeVisible();
    await page.waitForTimeout(400); // let the enter animation settle

    const hiddenPx = await questionCard.evaluate((el) => el.scrollHeight - el.clientHeight);
    expect(hiddenPx, 'question text hidden inside the card (px)').toBeLessThanOrEqual(1);
  });

  test('JUS-446: the quiz header cannot scroll up under the top bar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.addInitScript(() => {
      (window as any).__E2E_MOCK_USER__ = { uid: 'test-user-123', email: 'test-user@example.com', displayName: 'Test User' };
    });
    await page.goto('/');
    await page.locator('button:has-text("English")').click({ force: true });
    await page.getByRole('button', { name: 'Individual Contributor', exact: true }).click();
    await page.click('button:has-text("Start Free Analysis")');
    const counter = page.getByText('Question 1 of 9');
    await expect(counter).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const bar = (await page.locator('div.fixed.top-0').first().boundingBox())!;
    const counterBox = (await counter.boundingBox())!;
    expect(counterBox.y, 'question counter top vs. top bar bottom (px)').toBeGreaterThanOrEqual(bar.y + bar.height);
  });
});
