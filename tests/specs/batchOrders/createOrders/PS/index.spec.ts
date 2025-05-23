import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { baseConfig } from '@configs/index';

const customerOrderType = 'PS';

test.describe(`訂單功能 - ${customerOrderType} 類型`, () => {
  test(`使用者可以成功創建 ${customerOrderType} 類型訂單`, async ({ page }) => {
    // 动态导入配置
    const { config } = require(`@configs/batchOrders/createOrders/${customerOrderType}`);    
    await page.goto(`${baseConfig.baseUrl}/uploadOrders` );
    await page.waitForSelector('button:has-text("上傳訂單")');
    await page.locator('button:has-text("上傳訂單")').click();
    await page.waitForSelector('div.MuiDialog-container p:has-text("上傳訂單")', { state: 'visible' });

    const directoryPath = path.resolve(__dirname, `../../../../testFiles/batchOrders/createOrders/${customerOrderType}`);
    const files = fs.readdirSync(directoryPath);
    const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
    if (xlsxFiles.length === 0) {
      throw new Error('No original .xlsx files found in the directory');
    }
    const filePath = path.join(directoryPath, xlsxFiles[0]);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];        
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    const columnIndices: Record<string, number> = {};

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: range.s.r });
      const cell = worksheet[cellAddress];
      if (cell && config.autoModifyColumns.some(column => column.name === cell.v)) {
        columnIndices[cell.v] = C;
      }
    }    

    console.log('修改以下欄位');
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      console.log(`Row: ${R}`);
      for (const column of config.autoModifyColumns) {
        const colIndex = columnIndices[column.name];
        if (colIndex !== undefined) {
          const cell = worksheet[XLSX.utils.encode_cell({ c: colIndex, r: R })];
          if (cell) {
            const originalValue = cell.v;
            cell.v = typeof column.value === 'function' ? column.value(cell.v) : column.value;
            const paddedColumnName = column.name.padEnd(10, ' ');
            console.log(`${paddedColumnName} ${originalValue} => ${cell.v}`);
          }
        }
      }
    }   
    
    const modifiedDirPath = path.resolve(__dirname, `../../../../testFiles/batchOrders/createOrders/${customerOrderType}/Modified`);
    if (!fs.existsSync(modifiedDirPath)) {
      fs.mkdirSync(modifiedDirPath, { recursive: true });
    }
    const createdDate = dayjs().format('YYYYMMDD_HHmm');
    const modifiedFilePath = path.join(modifiedDirPath, `${customerOrderType}-${createdDate}.xlsx`);
    XLSX.writeFile(workbook, modifiedFilePath);
    await page.setInputFiles('input[type="file"]', modifiedFilePath);    

    await page.locator('div.MuiDialog-container button:has-text("上傳")').click();
    await page.waitForTimeout(10000);

    if (!config.keepUploadFile) {
      fs.unlinkSync(modifiedFilePath);
    }
  });
}); 
