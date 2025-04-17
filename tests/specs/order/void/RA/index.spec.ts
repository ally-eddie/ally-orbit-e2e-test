import { test } from '@playwright/test';
import { baseConfig } from '@configs/index';
import { stringify, getRowColumnValueFromLatestBatchOrderFile } from '@utils/index';

const customerOrderType= 'RA';

test.describe('作廢訂單', () => {
    test('可以作廢訂單', async ({ page, context }) => {
    const { config: { ordersQuery } } = require(`@configs/order/void/${customerOrderType}`);        
    if (!ordersQuery.searchKey) {
      ordersQuery.searchKey = getRowColumnValueFromLatestBatchOrderFile(customerOrderType, '出貨單號');
    }
    await page.goto(`${baseConfig.baseUrl}/orders?${stringify(ordersQuery)}`);    
    await page.waitForTimeout(5000);
    await page.click('div.MuiBox-root button[type="submit"]');        
    await page.waitForSelector('div[data-rowindex="0"]', { state: 'visible' });
    await page.click('div[data-rowindex="0"] a[href^="/orders"]');
    await page.waitForTimeout(5000);    
    const allPages = context.pages();
    const orderPage = allPages[allPages.length - 1];
    await orderPage.bringToFront();    
    await orderPage.locator('button:has-text("作廢")').click();           
    await orderPage.waitForSelector('div.MuiDialog-container button:has-text("確定作廢")', { state: 'visible' });    
    await orderPage.locator('div.MuiDialog-container button:has-text("確定作廢")').click();
    await orderPage.waitForTimeout(3000);    
  });
});