import { Page } from '@playwright/test';

export class SelectOrganizationPage {
  constructor(private page: Page) {}

  // 選擇器
  private selectors = {
    title: 'p:has-text("請選擇服務")',
    organizationButton: (name: string) => `button:has-text("${name}")`,
    container: '#root',  // 使用 id 選擇器
    organizationList: 'button[class*="MuiButton-outlined"]'  // 使用部分類名和元素類型
  };

  async waitForPage() {
    // 等待標題和至少一個組織按鈕出現
    await this.page.waitForSelector(this.selectors.title);
    await this.page.waitForSelector(this.selectors.organizationList);
  }

  async selectOrganization(organizationName: string) {
    await this.page.locator(this.selectors.organizationButton(organizationName)).click();
  }

  async isVisible() {
    const titleVisible = await this.page.locator(this.selectors.title).isVisible();
    const hasOrganizations = await this.page.locator(this.selectors.organizationList).count() > 0;
    return titleVisible && hasOrganizations;
  }

  async getAllOrganizations() {
    return await this.page.locator(this.selectors.organizationList).allTextContents();
  }
} 