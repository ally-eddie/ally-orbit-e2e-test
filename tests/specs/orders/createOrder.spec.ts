import { test } from '@playwright/test';
import { login } from '@utils/authHelper';
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';
import { config } from '../../config/orders/S/config';

test.describe('訂單功能', () => {
  test('使用者可以成功創建新訂單', async ({ page }) => {
    // 執行組織
    await login(page);
    // 點擊新增訂單
    await page.getByText('客戶訂單').click();    
    await page.locator('a[href="/uploadOrders"] p:has-text("新增訂單")').click();
    // 確認進入新增訂單頁面    
    await page.waitForSelector('button:has-text("上傳訂單")');

    // 點擊"上傳訂單"按鈕
    await page.locator('button:has-text("上傳訂單")').click();

    // 等待包含"上傳訂單"的 <p> 元素出現在指定的 <div> 中
    await page.waitForSelector('div.MuiDialog-container p:has-text("上傳訂單")', { state: 'visible' });

    const directoryPath = path.resolve(__dirname, '../../files/S');
    const files = fs.readdirSync(directoryPath);
    const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
    if (xlsxFiles.length === 0) {
      throw new Error('No .xlsx files found in the directory');
    }
    const filePath = path.join(directoryPath, xlsxFiles[0]);

    // 讀取 Excel 文件
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // 獲取當前日期
    const currentDate = new Date();

    // 格式化日期為 YYYY/MM/DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份從0開始，所以需要加1
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}/${month}/${day}`;

    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    const columnIndices: Record<string, number> = {};

    // 找到配置文件中指定的列
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: range.s.r });
      const cell = worksheet[cellAddress];
      if (cell && config.autoModifyDateColumns.includes(cell.v)) {
        columnIndices[cell.v] = C;
      }
    }

    // 修改指定的列
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (const columnName of config.autoModifyDateColumns) {
        const colIndex = columnIndices[columnName];
        if (colIndex !== undefined) {
          const cell = worksheet[XLSX.utils.encode_cell({ c: colIndex, r: R })];
          if (cell) {
            cell.v = formattedDate;
          }
        }
      }
    }

    // 确保目录存在
    const modifiedDirPath = path.resolve(__dirname, '../../files/S/Modified');
    if (!fs.existsSync(modifiedDirPath)) {
      fs.mkdirSync(modifiedDirPath, { recursive: true });
    }

    const modifiedFilePath = path.join(modifiedDirPath, `${formattedDate}_S-銷售單.xlsx`);
    XLSX.writeFile(workbook, modifiedFilePath);
    // 上傳修改後的文件
    await page.setInputFiles('input[type="file"]', modifiedFilePath);

    if (!config.keepUploadFile) {
      fs.unlinkSync(modifiedFilePath);
    }

    // 點擊位於對話框中的"上傳"按鈕
    await page.locator('div.MuiDialog-container button:has-text("上傳")').click();
    // 等待 10 秒時間
    await page.waitForTimeout(10000);
  });
}); 
