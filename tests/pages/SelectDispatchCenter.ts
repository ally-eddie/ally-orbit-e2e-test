import { Page } from '@playwright/test';
import { authConfig } from '../configs/auth.config';

export class SelectDispatchCenterPage {
  constructor(private page: Page) {}

  // 選擇器
  private selectors = {
    title: 'p:has-text("選擇 DC")',
    dispatchCenterOption: (name: string) => `li:has-text("${name}")`,
    selectDropdown: '.MuiSelect-select',
    organizationText: '.MuiSelect-select'
  };

  async waitForPage() {
    // 等待標題出現
    await this.page.waitForSelector(this.selectors.title);
  }

  async selectDispatchCenter(dispatchCenterName: string) {
    await this.page.locator(this.selectors.selectDropdown).click();
    await this.page.locator(this.selectors.dispatchCenterOption(dispatchCenterName)).click();
  }

  async isVisible() {
    return await this.page.locator(this.selectors.title).isVisible();
  }

  async selectDispatchCenterIfNeeded() {
    await this.page.getByText('客戶訂單').click();    
    await this.page.locator('a[href="/uploadOrders"] p:has-text("新增訂單")').click();
    await this.waitForPage();
    const organizationText = this.page.locator(this.selectors.organizationText);
    const nextElement = organizationText.locator(`xpath=following-sibling::*[contains(text(), "${authConfig.dispatchCenter.name}")]`);

    if (!(await nextElement.isVisible())) {
      await this.page.locator(this.selectors.selectDropdown).click();
      await this.page.locator(this.selectors.dispatchCenterOption(authConfig.dispatchCenter.name)).click();
    }
  }
}
