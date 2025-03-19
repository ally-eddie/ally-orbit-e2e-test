import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // 選擇器
  private selectors = {
    accountInput: '#account',
    passwordInput: '#password',
    loginButton: 'button:has-text("登入")',
    errorMessage: '.error-message',
    heading: 'h2:has-text("登入")'
  };

  // 動作方法
  async goto() {
    await this.page.goto('/');
  }

  async login(account: string, password: string) {
    await this.page.locator(this.selectors.accountInput).fill(account);
    await this.page.locator(this.selectors.passwordInput).fill(password);
    await this.page.locator(this.selectors.loginButton).click();
  }

  async getErrorMessage() {
    return this.page.locator(this.selectors.errorMessage).textContent();
  }

  async waitForHeading() {
    await this.page.locator(this.selectors.heading).waitFor({ state: 'visible' });
  }
} 