import { test } from '@playwright/test';
import { baseConfig } from '@configs/index';
import { stringify, getRowColumnValueFromLatestBatchOrderFile } from '@utils/index';

const customerOrderType = 'E';

test.describe('拆分轉運單', () => {
    test('可以拆分轉運單', async ({ page, context }) => {
    const { config: { deliveryNoticesQuery } } = require(`@configs/deliveryNotice/split/${customerOrderType}`);        
    if (!deliveryNoticesQuery.searchKey) {
      deliveryNoticesQuery.searchKey = getRowColumnValueFromLatestBatchOrderFile(customerOrderType, '出貨單號');
    }
    await page.goto(`${baseConfig.baseUrl}/deliveryNotices?${stringify(deliveryNoticesQuery)}`);    
    await page.waitForTimeout(3000);
    await page.click('div.MuiBox-root button[type="submit"]');        
    await page.waitForSelector('div[data-rowindex="0"]', { state: 'visible' });
    await page.click('div[data-rowindex="0"] a[href^="/pending"]');
    await page.waitForTimeout(3000);    
    const allPages = context.pages();
    const deliveryNoticePage = allPages[allPages.length - 1];
    await deliveryNoticePage.bringToFront();    
    await deliveryNoticePage.locator('button:has-text("拆託運單")').click();                  
    await page.waitForTimeout(1000);     
    await deliveryNoticePage.click('label:has-text("趟次分頁") + div > div[role="combobox"]');    
    (await deliveryNoticePage.$('#menu-shipmentLabel li:first-child')).click();    
    (await deliveryNoticePage.waitForSelector('input[name="shipmentName"]', { state: 'visible' })).click();
    await deliveryNoticePage.click('div[role="presentation"] .MuiAutocomplete-listbox li:first-child');
    await deliveryNoticePage.locator('div.MuiDialog-container button:has-text("確認拆託運單")').click();    
    await deliveryNoticePage.waitForTimeout(3000);
  });
});