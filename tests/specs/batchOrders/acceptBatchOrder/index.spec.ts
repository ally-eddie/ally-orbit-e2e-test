import { test } from '@playwright/test';

test.describe('批量接受訂單', () => {
  test('應該可以接受訂單', async ({ page }) => {
    await page.getByText('客戶訂單').click();    
    await page.locator('a[href="/uploadOrders"] p:has-text("新增訂單")').click();
    // 等待元素显示
    await page.waitForSelector('input[name="searchKey"]');
    // 输入文本
    await page.fill('input[name="searchKey"]', 'qq123');
  });
});