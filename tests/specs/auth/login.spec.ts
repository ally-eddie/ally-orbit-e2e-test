import { test } from '@playwright/test';
import { login } from '@utils/authHelper';

test('登入', async ({ page }) => {
  await login(page);  
  await page.context().storageState({ path: 'storageState/login.json' });
}); 