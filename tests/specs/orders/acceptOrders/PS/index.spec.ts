import { test } from '@playwright/test';
import { baseConfig } from '@configs/index';
import { stringify, getRowColumnValueFromLatestBatchOrderFile } from '@utils/index';

const customerOrderType = 'PS';

test.describe('接受訂單', () => {
  test('可以接受訂單', async ({ page }) => {
    const { config: { query } } = require(`@configs/orders/acceptOrders/${customerOrderType}`);        
    if (!query.searchKey) {
      query.searchKey = getRowColumnValueFromLatestBatchOrderFile(customerOrderType, '出貨單號');
    }
    await page.goto(`${baseConfig.baseUrl}/orders?${stringify(query)}`);
    // 动态导入配置
    await page.waitForTimeout(5000);
    await page.click('div.MuiBox-root button[type="submit"]');        
    await page.waitForSelector('div[data-rowindex="0"]', { state: 'visible' });
    await page.click('div[data-rowindex="0"] input[type="checkbox"]');    
    await page.locator('button:has-text("接單")').click();
    await page.waitForTimeout(3000);
  });
});