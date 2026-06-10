import { test, expect } from '@playwright/test';

test.describe('Workplace Love Language E2E Tests', () => {
  
  test('should load the welcome page in Hebrew and display the login card, and support switching to English', async ({ page }) => {
    await page.goto('/');

    // 1. Check default Hebrew titles
    await expect(page.locator('h1')).toContainText('שפת האהבה');
    await expect(page.locator('h1')).toContainText('בעבודה');

    // Confirm that the login interface is shown (Verify Google Sign In button is present)
    await expect(page.locator('text=Sign in with Google')).toBeVisible();

    // 2. Switch to English (use force: true due to animations)
    const englishButton = page.locator('button:has-text("English")');
    await expect(englishButton).toBeVisible();
    await englishButton.click({ force: true });

    // Check English titles are updated
    await expect(page.locator('h1')).toContainText('Workplace');
    await expect(page.locator('h1')).toContainText('Love Language');
  });

  test('should allow a logged-in user to complete the quiz and view results in English', async ({ page }) => {
    // Inject mock user before the page loads
    await page.addInitScript(() => {
      (window as any).__E2E_MOCK_USER__ = {
        uid: 'test-user-123',
        email: 'test-user@example.com',
        displayName: 'Test User',
      };
    });

    await page.goto('/');

    // Switch to English first (use force: true due to animations)
    const englishButton = page.locator('button:has-text("English")');
    await expect(englishButton).toBeVisible();
    await englishButton.click({ force: true });

    // Verify the mock email is displayed in the TopBar (meaning auth context loaded the mock user successfully)
    await expect(page.locator('text=test-user@example.com')).toBeVisible();

    // Verify the role selector title is visible
    await expect(page.locator('text=What is your role?')).toBeVisible();

    // Select "Individual Contributor" (Employee) role
    await page.click('button:has-text("Individual Contributor")');

    // Click "Start Free Analysis"
    await page.click('button:has-text("Start Free Analysis")');

    // Quiz screen should be loaded now
    await expect(page.locator('text=Question 1 of 9')).toBeVisible();

    // Complete the 9 questions by selecting the first option for all
    for (let q = 1; q <= 9; q++) {
      await expect(page.locator(`text=Question ${q} of 9`)).toBeVisible();
      // Click the first button in the option list
      const optionButtons = page.locator('button.w-full.text-start');
      await optionButtons.first().click();
    }

    // Results screen should be loaded
    await expect(page.locator('text=Primary Language')).toBeVisible();
    // Since we clicked Option A for all, the result should be Words of Affirmation
    await expect(page.locator('text=Words of Affirmation')).toBeVisible();

    // Verify visual concentric radial SVG element is present
    const svgElement = page.locator('svg.w-full.h-full.max-w-\\[320px\\]');
    await expect(svgElement).toBeVisible();

    // Interact with Result Tabs
    // 1. Playbook Tab
    await page.click('button:has-text("Playbook")');
    await expect(page.locator('text=How I act during Crunch Time')).toBeVisible();

    // 2. User Manual Tab
    await page.click('button:has-text("User Manual")');
    await expect(page.locator('button:has-text("Copy text")')).toBeVisible();

    // 3. Analysis Tab
    await page.click('button:has-text("Analysis")');
    await expect(page.locator('text=What That Means at Work')).toBeVisible();

    // Verify Inline Feedback button is present
    const feedbackBtn = page.locator('button:has-text("Provide Feedback")');
    await expect(feedbackBtn).toBeVisible();
    
    // Click button to open the modal dialog (use force: true)
    await feedbackBtn.click({ force: true });

    // Verify the modal title
    await expect(page.locator('h3:has-text("Give us feedback")')).toBeVisible();

    // Locate the rating stars - we want to select 5 stars (which corresponds to the 5th star button)
    const starButtons = page.locator('button.p-1.transition-colors');
    await expect(starButtons).toHaveCount(5);
    await starButtons.nth(4).click(); // click the 5th star (0-indexed 4)

    // Fill in feedback text
    await page.fill('textarea[placeholder="We\'d love to hear your thoughts..."]', 'E2E testing is working flawlessly!');

    // Submit feedback
    await page.click('button[type="submit"]:has-text("Submit")');

    // Verify success message
    await expect(page.locator('text=Thank you for the feedback!')).toBeVisible();
  });

  test('should support language switching (LTR / RTL) on the fly and verify direction attributes', async ({ page }) => {
    await page.goto('/');

    // Defaults to Hebrew (RTL)
    await expect(page.locator('h1')).toContainText('שפת האהבה');
    
    // Check HTML tag dir attribute
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // Switch to English (use force: true due to animations)
    const switchLangBtn = page.locator('button:has-text("English")');
    await expect(switchLangBtn).toBeVisible();
    await switchLangBtn.click({ force: true });

    // Title should be English now
    await expect(page.locator('h1')).toContainText('Workplace');

    // Check HTML tag dir attribute is now ltr
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    // Switch back to Hebrew (use force: true due to animations)
    const switchBackBtn = page.locator('button:has-text("עברית")');
    await expect(switchBackBtn).toBeVisible();
    await switchBackBtn.click({ force: true });

    // Check title is Hebrew again
    await expect(page.locator('h1')).toContainText('שפת האהבה');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
