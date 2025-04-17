import { test } from '@playwright/test';
import { baseConfig } from '@configs/index';
import { stringify, getRowColumnValueFromLatestBatchOrderFile } from '@utils/index';

const customerOrderType= 'RA';

test.describe('拒絕訂單', () => {
  test('可以拒絕訂單', async ({ page }) => {
    const { config: { query } } = require(`@configs/orders/rejectOrders/${customerOrderType}`);        
    if (!query.searchKey) {
      query.searchKey = getRowColumnValueFromLatestBatchOrderFile(customerOrderType, '出貨單號');
    }
    await page.goto(`${baseConfig.baseUrl}/orders?${stringify(query)}`);
    // 动态导入配置
    await page.waitForTimeout(5000);
    await page.click('div.MuiBox-root button[type="submit"]');        
    await page.waitForSelector('div[data-rowindex="0"]', { state: 'visible' });
    await page.click('div[data-rowindex="0"] input[type="checkbox"]');    
    await page.locator('button:has-text("拒絕")').click();
    await page.waitForTimeout(3000);
  });
});