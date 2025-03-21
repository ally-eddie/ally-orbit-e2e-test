import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { baseConfig } from '@configs/index';

const customerOrderType = 'S';

test.describe('批量拒絕訂單', () => {
  test('可以拒絕訂單', async ({ page }) => {
    await page.goto(`${baseConfig.baseUrl}/uploadOrders`);    
    // 动态导入配置
    const { config } = require(`@configs/batchOrders/rejectBatchOrder/${customerOrderType}`);    
    // 获取 searchKey 或最新文件名
    let searchKey = config.searchKey;
    if (!searchKey) {
      const directoryPath = path.resolve(__dirname, `../../../../testFiles/batchOrders/createOrders/${customerOrderType}/Modified`);
      const files = fs.readdirSync(directoryPath);
      const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
      if (xlsxFiles.length === 0) {
        throw new Error('No .xlsx files found in the directory');
      }
      // 获取最新文件名
      xlsxFiles.sort((a, b) => fs.statSync(path.join(directoryPath, b)).mtime.getTime() - fs.statSync(path.join(directoryPath, a)).mtime.getTime());
      searchKey = xlsxFiles[0];
    }    
    // 在输入框中输入 searchKey
    await page.fill('input[name="searchKey"]', searchKey);
    // 搜尋檔案
    await page.click('div.MuiBox-root button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.waitForSelector('div[data-rowindex="0"]', { state: 'visible' });
    await page.click('div[data-rowindex="0"] button:has-text("批次作廢")');  
    // 等待 <h5> 元素出現在 class="MuiDialog-container" 中
    await page.waitForSelector('div.MuiDialog-container h5:has-text("批次作廢")', { state: 'visible' });
    // 點擊確定按鈕
    await page.click('div.MuiDialog-container button:has-text("確認")');
    // 等待2秒
    await page.waitForTimeout(2000);
  });
});