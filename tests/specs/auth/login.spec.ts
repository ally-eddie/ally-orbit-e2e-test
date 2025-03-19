import { test, expect } from '@playwright/test';
import { login } from '@utils/authHelper';

test.describe('登入功能', () => {
  test('使用者可以成功登入組織', async ({ page }) => {    
    await login(page);
  });
}); 