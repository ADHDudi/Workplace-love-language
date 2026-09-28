#!/usr/bin/env node
// Runs the Playwright E2E suite against a chosen environment.
// Asks which one interactively; set E2E_ENV=local|production to skip the prompt (e.g. in CI).
// Extra args are passed through to `playwright test`.
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';

const ENVIRONMENTS = {
  local: 'http://localhost:3000',
  production: 'https://gen-lang-client-0330602361.web.app',
};

async function askForEnvironment() {
  if (!process.stdin.isTTY) return 'local';

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('Run the E2E tests against which environment?');
    console.log(`  1) local       ${ENVIRONMENTS.local}`);
    console.log(`  2) production  ${ENVIRONMENTS.production}`);
    while (true) {
      const answer = (await rl.question('Choose 1 or 2 [1]: ')).trim().toLowerCase();
      if (answer === '' || answer === '1' || answer === 'local') return 'local';
      if (answer === '2' || answer === 'production' || answer === 'prod') return 'production';
      console.log('Please enter 1 (local) or 2 (production).');
    }
  } catch (err) {
    if (err?.code !== 'ABORT_ERR') throw err;
    console.log('\nCancelled.');
    process.exit(130);
  } finally {
    rl.close();
  }
}

const envName = process.env.E2E_ENV?.toLowerCase() || (await askForEnvironment());
const baseURL = ENVIRONMENTS[envName];
if (!baseURL) {
  console.error(`Unknown E2E_ENV "${envName}". Use one of: ${Object.keys(ENVIRONMENTS).join(', ')}.`);
  process.exit(1);
}

console.log(`\nRunning E2E tests against ${envName}: ${baseURL}\n`);

const child = spawn('npx', ['playwright', 'test', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, E2E_ENV: envName, E2E_BASE_URL: baseURL },
});
child.on('exit', (code, signal) => process.exit(signal ? 1 : code ?? 1));
