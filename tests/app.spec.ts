import { test, expect, type Page } from '@playwright/test';

// The single test suite for the app: every behavior is checked through the UI.
// Signed-in tests use the `__E2E_MOCK_USER__` hook, which makes dbService return
// canned data and skip all Firestore writes, so the suite is safe to run against production.

type OptionId = 'A' | 'B' | 'C' | 'D' | 'E';

const ADMIN = { uid: 'admin-user', email: 'tsur.david@gmail.com', displayName: 'Admin' };
const MEMBER = { uid: 'test-user-123', email: 'test-user@example.com', displayName: 'Test User' };

const OPTION_INDEX: Record<OptionId, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };

const RESULT_TITLES_EN: Record<OptionId, string> = {
  A: 'Words of Affirmation',
  B: 'Quality Time',
  C: 'Receiving Gifts',
  D: 'Acts of Service',
  E: 'Physical Touch',
};

async function signInAs(page: Page, user: typeof ADMIN) {
  await page.addInitScript((mockUser) => {
    (window as any).__E2E_MOCK_USER__ = mockUser;
  }, user);
}

async function switchToEnglish(page: Page) {
  await page.locator('button:has-text("English")').click({ force: true });
  await expect(page.locator('h1')).toContainText('Workplace');
}

async function startQuiz(page: Page, role: 'Individual Contributor' | 'Manager' = 'Individual Contributor') {
  await page.getByRole('button', { name: role, exact: true }).click();
  await page.click('button:has-text("Start Free Analysis")');
}

const optionButtons = (page: Page) => page.locator('button.w-full.text-start');

// Answers questions starting at `firstQuestion`, checking the "Question N of 9" counter and that each question offers 5 choices.
async function answerQuestions(page: Page, picks: OptionId[], { firstQuestion = 1, counter = (n: number) => `Question ${n} of 9` } = {}) {
  for (const [i, pick] of picks.entries()) {
    await expect(page.getByText(counter(firstQuestion + i))).toBeVisible();
    await expect(optionButtons(page)).toHaveCount(5);
    await optionButtons(page).nth(OPTION_INDEX[pick]).click();
  }
}

const primaryTitle = (page: Page) => page.getByRole('heading', { level: 2 }).first();
const breakdownRows = (page: Page) => page.locator('div.flex.justify-between.items-center.text-sm');

test.describe('Welcome and language', () => {
  test('visitor lands on a Hebrew RTL welcome page, can switch to English LTR and back', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('שפת האהבה');
    await expect(page.locator('h1')).toContainText('בעבודה');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await switchToEnglish(page);
    await expect(page.locator('h1')).toContainText('Love Language');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    await page.locator('button:has-text("עברית")').click({ force: true });
    await expect(page.locator('h1')).toContainText('שפת האהבה');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('visitor must sign in before taking the quiz', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Sign in with Google')).toBeVisible();
    await expect(page.getByRole('button', { name: /התחל|Start Free Analysis/ })).toHaveCount(0);
  });
});

test.describe('Quiz and scoring', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, MEMBER);
    await page.goto('/');
  });

  for (const option of Object.keys(RESULT_TITLES_EN) as OptionId[]) {
    test(`choosing only "${option}" answers leads to ${RESULT_TITLES_EN[option]}`, async ({ page }) => {
      await switchToEnglish(page);
      await startQuiz(page);
      await answerQuestions(page, Array(9).fill(option));

      await expect(page.locator('text=Primary Language')).toBeVisible();
      await expect(primaryTitle(page)).toContainText(RESULT_TITLES_EN[option]);
    });
  }

  test('the Hebrew quiz has 9 questions with 5 choices each and a Hebrew result', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('שפת האהבה');
    await page.getByRole('button', { name: 'עובד/ת', exact: true }).click();
    await page.getByRole('button', { name: 'התחל/י ניתוח בחינם' }).click();

    await answerQuestions(page, Array(9).fill('B'), { counter: (n) => `שאלה ${n} מתוך 9` });

    await expect(primaryTitle(page)).toContainText('זמן איכות');
  });

  test('a clear majority wins and the breakdown shows each language share, highest first', async ({ page }) => {
    await switchToEnglish(page);
    await startQuiz(page);
    await answerQuestions(page, ['C', 'C', 'C', 'C', 'C', 'A', 'B', 'D', 'E']);

    await expect(primaryTitle(page)).toContainText('Receiving Gifts');
    // 5/9 = 56%, 1/9 = 11%; ties keep A–E order.
    await expect(breakdownRows(page)).toHaveText([/Gifts\s*56%/, /Words\s*11%/, /Time\s*11%/, /Acts\s*11%/, /Touch\s*11%/]);
  });

  test('a tie goes to the earlier language, and the runner-up is shown as the secondary trait', async ({ page }) => {
    await switchToEnglish(page);
    await startQuiz(page);
    await answerQuestions(page, ['B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'C']);

    await expect(primaryTitle(page)).toContainText('Words of Affirmation');
    await expect(page.getByText('Secondary Trait: Quality Time')).toBeVisible();
    await expect(breakdownRows(page)).toHaveText([/Words\s*44%/, /Time\s*44%/, /Gifts\s*11%/, /Acts\s*0%/, /Touch\s*0%/]);
  });
});

test.describe('Quiz progress', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, MEMBER);
    await page.goto('/');
    await switchToEnglish(page);
  });

  test('an unfinished quiz resumes at the next question after a reload', async ({ page }) => {
    await startQuiz(page);
    await answerQuestions(page, ['A', 'B', 'C']);
    await expect(page.getByText('Question 4 of 9')).toBeVisible();

    await page.reload();
    await switchToEnglish(page);
    await startQuiz(page);

    await expect(page.getByText('Question 4 of 9')).toBeVisible();
  });

  test('saved progress is only resumed for the same role', async ({ page }) => {
    await startQuiz(page, 'Individual Contributor');
    await answerQuestions(page, ['A', 'B']);

    await page.reload();
    await switchToEnglish(page);
    await startQuiz(page, 'Manager');

    await expect(page.getByText('Question 1 of 9')).toBeVisible();
  });

  test('finishing the quiz clears saved progress, so a retake starts from question 1', async ({ page }) => {
    await startQuiz(page);
    await answerQuestions(page, Array(9).fill('A'));
    await expect(page.locator('text=Primary Language')).toBeVisible();

    await page.getByRole('button', { name: 'Retake' }).click();
    await startQuiz(page);

    await expect(page.getByText('Question 1 of 9')).toBeVisible();
  });
});

test.describe('Result screen', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, MEMBER);
    await page.goto('/');
    await switchToEnglish(page);
    await startQuiz(page);
    await answerQuestions(page, Array(9).fill('A'));
    await expect(page.locator('text=Primary Language')).toBeVisible();
  });

  test('a signed-in result is saved and can be shared', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Share My Profile' })).toBeVisible();
    await expect(page.locator('svg.w-full.h-full.max-w-\\[320px\\]')).toBeVisible();
  });

  test('result tabs show the playbook and the user manual', async ({ page }) => {
    await page.click('button:has-text("Playbook")');
    await expect(page.locator('text=How I act during Crunch Time')).toBeVisible();

    await page.click('button:has-text("User Manual")');
    await expect(page.locator('button:has-text("Copy text")')).toBeVisible();

    await page.click('button:has-text("Analysis")');
    await expect(page.locator('text=What That Means at Work')).toBeVisible();
  });

  test('user can rate the result and send feedback', async ({ page }) => {
    await page.locator('button:has-text("Provide Feedback")').click({ force: true });
    await expect(page.locator('h3:has-text("Give us feedback")')).toBeVisible();

    const starButtons = page.locator('button.p-1.transition-colors');
    await expect(starButtons).toHaveCount(5);
    await starButtons.nth(4).click();
    await page.fill('textarea[placeholder="We\'d love to hear your thoughts..."]', 'E2E testing is working flawlessly!');
    await page.click('button[type="submit"]:has-text("Submit")');

    await expect(page.locator('text=Thank you for the feedback!')).toBeVisible();
  });
});

test.describe('Shared result link', () => {
  test('opens the shared profile read-only', async ({ page }) => {
    await signInAs(page, MEMBER);
    await page.goto('/?shared=some-result-id');
    await switchToEnglish(page);

    // The mock data layer returns a result whose primary style is A.
    await expect(primaryTitle(page)).toContainText('Words of Affirmation');
    await expect(page.getByRole('button', { name: 'Retake' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Share My Profile' })).toHaveCount(0);
  });
});

test.describe('Toolbar (JUS-425)', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, ADMIN);
  });

  test('signed-in user sees a single account bar on the welcome screen', async ({ page }) => {
    await page.goto('/');
    await switchToEnglish(page);
    await expect(page.locator('text=What is your role?')).toBeVisible();
    await expect(page.locator(`text=${ADMIN.email}`)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Sign Out' })).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Manage Feedback' })).toHaveCount(1);
  });

  test('result screen has a single toolbar holding the account actions', async ({ page }) => {
    await page.goto('/');
    await switchToEnglish(page);
    await startQuiz(page);
    await answerQuestions(page, Array(9).fill('A'));
    await expect(page.locator('text=Primary Language')).toBeVisible();

    const resultToolbar = page.getByRole('banner').filter({ has: page.getByRole('button', { name: 'Retake' }) });
    await expect(resultToolbar).toHaveCount(1);

    for (const name of ['Sign Out', 'Dashboard', 'Manage Feedback']) {
      await expect(page.getByRole('button', { name })).toHaveCount(1);
      await expect(resultToolbar.getByRole('button', { name })).toBeVisible();
    }
  });
});

test.describe('Admin', () => {
  test('the Team Dashboard summarizes all saved assessments', async ({ page }) => {
    await signInAs(page, ADMIN);
    await page.goto('/');
    await switchToEnglish(page);
    await page.getByRole('button', { name: 'Dashboard' }).click();

    await expect(page.locator('text=Team Dashboard')).toBeVisible();
    // The mock data layer returns two assessments: one Words of Affirmation (A), one Quality Time (B).
    await expect(page.getByText('Total Assessments').locator('..')).toContainText('2');
    await expect(page.getByText('Words of Affirmation').first()).toBeVisible();
    await expect(page.getByText('Quality Time').first()).toBeVisible();
  });

  test('regular users do not get admin tools', async ({ page }) => {
    await signInAs(page, MEMBER);
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dashboard' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Manage Feedback' })).toHaveCount(0);
  });
});
