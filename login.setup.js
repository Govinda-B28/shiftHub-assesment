require('dotenv').config();
const path = require('path');
const { chromium } = require('@playwright/test');

(async () => {
  console.log('Starting login setup script...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    if (!process.env.JIRA_URL || !process.env.JIRA_EMAIL || !process.env.JIRA_PASSWORD) {
      throw new Error('Missing JIRA_URL / JIRA_EMAIL / JIRA_PASSWORD in .env');
    }

    console.log('🔹 Going to:', process.env.JIRA_URL);
    await page.goto(process.env.JIRA_URL, { waitUntil: 'domcontentloaded' });

    console.log('🔹 Filling email...');
    await page.waitForSelector('input[type="email"]', { timeout: 20000 });
    await page.fill('input[type="email"]', process.env.JIRA_EMAIL);
    await page.click('button:has-text("Continue")');

    console.log('🔹 Filling password...');
    await page.waitForSelector('input[type="password"]', { timeout: 20000 });
    await page.fill('input[type="password"]', process.env.JIRA_PASSWORD);
    await page.click('button:has-text("Log in")');

    console.log('🔹 Waiting a bit for Jira after login...');
    await page.waitForTimeout(15000);

    try {
      await page.waitForURL(/jira/, { timeout: 30000 });
      console.log('✅ URL matched /jira/, login looks successful.');
    } catch (e) {
      console.warn('⚠️ Could not confirm /jira/ URL, but will still save state.');
    }

    const storagePath = path.resolve(__dirname, 'auth.json');
    console.log('🔹 Saving storage state to:', storagePath);
    await context.storageState({ path: storagePath });

    console.log('auth.json saved successfully at:', storagePath);
  } catch (err) {
    console.error('Error in login.setup.js:', err);
  } finally {
    await browser.close();
    console.log('Browser closed. Script finished.');
  }
})();
