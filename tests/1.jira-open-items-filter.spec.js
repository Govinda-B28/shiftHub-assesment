import { test, expect } from '@playwright/test';

test.describe('Navigate and click My Software Team', () => {
  test('Click My Software Team and first sidebar item', async ({ page }) => {
    test.setTimeout(90000);
    await page.goto('/');

    await page.waitForTimeout(3000);

    const mySoftwareTeam = page
      .locator('p')
      .filter({ hasText: 'My Software Team' });

    await expect(mySoftwareTeam).toBeVisible({ timeout: 15000 });
    await mySoftwareTeam.click();

    await page.waitForLoadState('domcontentloaded');

    await expect(page).not.toHaveURL(/dashboard/i);

    const expandSidebar = page
      .locator('span')
      .filter({ hasText: 'Expand sidebar' })
      .first();

    //await expandSidebar.click();

    await page.waitForTimeout(2000);

    const moreButton = await page.getByRole('button', { name: 'More', exact: true });

    await expect(moreButton).toBeVisible({ timeout: 10000 });
    await moreButton.click();

    // First checking the doen work items by clicking on the all work and then applying the Done filter then traversing through each row and checking the results fetched are of applied filter not not...
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.getByTestId('NAV4_filt_-4').click();
    await page.waitForTimeout(2000);
    await page.getByTestId('jql-builder-basic.ui.jql-editor.picker.filter-button.status').click();
    await page.waitForTimeout(2000);
    await page.locator('._1e0c1txw._4cvr1h6o._1o9zidpf._y4ti1b66._16cu892t').first().click();
    await page.locator('.css-yqddl5').click();
    await page.waitForTimeout(2000);

    const table = page.locator('table[aria-label="Work"]');
    await expect(table).toBeVisible({ timeout: 15000 });

    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`Found ${rowCount} rows in issue table`);

    for (let i = 0; i < rowCount; i++) {
  const row = rows.nth(i);

  const resolutionCell = row
    .locator('td')
    .nth(6)
    .locator('div[data-vc="native-issue-table-ui-resolution-cell"]');


  const resolutionText = await resolutionCell.innerText();
  console.log(`Row ${i} - Resolution value: "${resolutionText}"`);

  await expect(
    resolutionCell,
    `Row ${i} resolution should be Done`
  ).toHaveText('Done', { timeout: 10000 });
}

// Changing the filter again to check the open work items by clicking again on the filter and clearing the existing filter this will be a continuous flow...
await page.getByTestId('issue-navigator.ui.jql-builder.reset-button').click();

await page.waitForTimeout(2000);
await page.getByTestId('jql-builder-basic.ui.jql-editor.picker.filter-button.status').click();
await page.waitForTimeout(2000);
await page.locator('._16jlkb7n._1o9zkb7n._i0dl1wug._nd5l1sux').click();
await page.getByRole('combobox', { name: 'Search Status' }).fill('TO DO');
await page.waitForTimeout(2000);
await page.locator('._1e0c1txw._4cvr1h6o._1o9zidpf._y4ti1b66._16cu892t').click();
await page.waitForTimeout(2000);
await page.locator('.css-yqddl5').click();

await expect(table).toBeVisible({ timeout: 15000 });

const updatedRows = table.locator('tbody tr');
const updatedRowCount = await updatedRows.count();

console.log(`Found ${updatedRowCount} rows after filter reset`);

for (let i = 0; i < updatedRowCount; i++) {
  const row = updatedRows.nth(i);

  const resolutionCell = row
    .locator('td')
    .nth(6)
    .locator('div[data-vc="native-issue-table-ui-resolution-cell"]');

  const resolutionText = await resolutionCell.innerText();
  console.log(`Row ${i} - Resolution value (after reset): "${resolutionText}"`);

  await expect(
    resolutionCell,
    `Row ${i} resolution should be Unresolved`
  ).toHaveText('Unresolved', { timeout: 10000 });
}


// Saving the filter and checking if the saved filter appears in the sidebar
await page.getByTestId('save-filter-dialog.ui.save-filter-dialog.button').click();
await page.waitForTimeout(2000);
const filterName = `Done work items - ${Date.now()}`;
await page
  .getByTestId('shareable-entity-dialog.text-field')
  .fill(filterName);
await page.getByTestId('modal-dialog--footer').getByRole('button', { name: 'Save' }).click();

await page.waitForTimeout(2000);



const expectedText = filterName;

const element = page.locator(
  "(//div[contains(@class,'_zulpv77o') and contains(@class,'_2lx21bp4')])[8]"
);

await expect(element).toBeVisible({ timeout: 10000 });

const actualText = (await element.innerText()).trim();

console.log(`Fetched text from XPath element: "${actualText}"`);

await expect(
  actualText,
  `Displayed filter name does not match expected value`
).toBe(expectedText);

await element.click();



    await page.waitForTimeout(5000);
  });
});