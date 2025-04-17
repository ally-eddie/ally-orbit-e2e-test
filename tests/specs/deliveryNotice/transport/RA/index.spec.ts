import { test } from '@playwright/test';
import { baseConfig } from '@configs/index';
import { stringify, getRowColumnValueFromLatestBatchOrderFile } from '@utils/index';

const customerOrderType= 'RA';

test.describe('改成轉運單', () => {
    test('可以改成轉運單', async ({ page, context }) => {
    const { config: { deliveryNoticesQuery } } = require(`@configs/deliveryNotice/transport/${customerOrderType}`);        
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
    await deliveryNoticePage.locator('button:has-text("改成轉運單")').click();                   
    await page.waitForTimeout(1000);     
    await deliveryNoticePage.waitForSelector('div.MuiDialog-container p:has-text("改為轉運單")', { state: 'visible' });
    await deliveryNoticePage.click('label:has-text("轉運倉名稱") + div > div[role="combobox"]');    
    await deliveryNoticePage.waitForSelector('#menu-transportWarehouseName', { state: 'visible' });
    (await deliveryNoticePage.$('#menu-transportWarehouseName li:first-child')).click();    
    (await deliveryNoticePage.waitForSelector('input[name="firstTransportShipmentName"]', { state: 'visible' })).click();
    await deliveryNoticePage.click('div[role="presentation"] .MuiAutocomplete-listbox li:first-child');     
    (await deliveryNoticePage.waitForSelector('input[name="lastTransportShipmentName"]', { state: 'visible' })).click();
    await deliveryNoticePage.click('div[role="presentation"] .MuiAutocomplete-listbox li:first-child');
    await deliveryNoticePage.locator('div.MuiDialog-container button:has-text("確認改為轉運")').click();    
    await deliveryNoticePage.waitForTimeout(3000);
  });
});
