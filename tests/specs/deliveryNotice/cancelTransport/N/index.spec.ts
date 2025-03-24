import { test } from '@playwright/test';
import { baseConfig } from '@configs/index';
import { stringify, getRowColumnValueFromLatestBatchOrderFile } from '@utils/index';

const customerOrderType = 'N';

test.describe('取消運送', () => {
    test('可以取消運送', async ({ page, context }) => {
    const { config: { deliveryNoticesQuery } } = require(`@configs/deliveryNotice/cancelTransport/${customerOrderType}`);        
    if (!deliveryNoticesQuery.searchKey) {
      deliveryNoticesQuery.searchKey = getRowColumnValueFromLatestBatchOrderFile(customerOrderType, '出貨單號');
    }
    await page.goto(`${baseConfig.baseUrl}/deliveryNotices?${stringify(deliveryNoticesQuery)}`);    
    await page.waitForTimeout(5000);
    await page.click('div.MuiBox-root button[type="submit"]');        
    await page.waitForSelector('div[data-rowindex="0"]', { state: 'visible' });
    await page.click('div[data-rowindex="0"] a[href^="/pending"]');
    await page.waitForTimeout(5000);    
    const allPages = context.pages();
    const deliveryNoticePage = allPages[allPages.length - 1];
    await deliveryNoticePage.bringToFront();    
    await deliveryNoticePage.locator('button:has-text("取消運送")').click();               
    await deliveryNoticePage.waitForTimeout(3000);    
  });
});