# E2E Testing Project

This project is designed for end-to-end testing using Playwright. It includes various test configurations and scripts to automate testing processes.

## Setup

1. **Install Dependencies**: Run the following command to install the necessary dependencies:
   ```bash
   npm install
   ```

2. **Configure Environment**: Ensure that your environment is set up correctly, including any necessary environment variables or configuration files.

3. **Run Tests**: You can run the tests using the following command:
   ```bash
   npm run test
   ```

## Project Structure

- **`tests/`**: Contains all the test files and configurations.
- **`storageState/`**: Directory for storing state information during tests (ignored by Git).
- **`testFiles/`**: Directory for test-related files, including modified files (ignored by Git).

## Additional Information

- **Git Ignored Files**: The following directories are ignored by Git:
  - `node_modules/`
  - `test-results/`
  - `playwright-report/`
  - `blob-report/`
  - `playwright/.cache/`
  - `tests/test-config.local.ts`
  - `tests/config/auth.config.ts`
  - `storageState/`
  - `**/Modified/**`

## Customize Configuration

To customize the configuration for your tests, you can modify the `playwright.config.ts` file located in the root of your project. This file contains various settings that you can adjust to suit your testing needs, such as:

- **Test Match**: You can specify which files to include or exclude from testing.
- **Browser Options**: Configure the browsers and their settings.
- **Environment Variables**: Set up environment variables for your tests.

## Script 

You can quickly generate all specs corresponding to the desired customerOrderType by running npm run addNewOrderType <customerOrderType>.
After execution, go to tests/testFiles/batchOrders/createOrders/<customerOrderType> and replace the original order files.

## Running Playwright UI

To run Playwright in UI mode, which provides a graphical interface for debugging and viewing test results, use the following command:

```bash
npx playwright test --ui
```

This will open the Playwright UI, allowing you to interact with your tests in a more user-friendly manner.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 