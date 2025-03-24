import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { baseConfig } from '@configs/index';
import { getLatestBatchOrderFileName } from '@utils/index';
const customerOrderType = 'N';

test.describe('批量接受訂單', () => {
  test('可以接受訂單', async ({ page }) => {
    await page.goto(`${baseConfig.baseUrl}/uploadOrders`);    
    // 动态导入配置
    const { config } = require(`@configs/batchOrders/acceptBatchOrder/${customerOrderType}`);    
    // 获取 searchKey 或最新文件名
    let searchKey = config.searchKey;
    if (!searchKey) {
      const fileName = getLatestBatchOrderFileName(customerOrderType);
      searchKey = fileName;      
    }    
    // 在输入框中输入 searchKey
    await page.fill('input[name="searchKey"]', searchKey);
    // 搜尋檔案
    await page.click('div.MuiBox-root button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.waitForSelector('div[data-rowindex="0"]', { state: 'visible' });
    await page.click('div[data-rowindex="0"] button:has-text("批次接單")');  
    // 等待 <h5> 元素出現在 class="MuiDialog-container" 中
    await page.waitForSelector('div.MuiDialog-container h5:has-text("批次接單")', { state: 'visible' });
    // 點擊確定按鈕
    await page.click('div.MuiDialog-container button:has-text("確認")');
    // 等待2秒
    await page.waitForTimeout(2000);
  });
});