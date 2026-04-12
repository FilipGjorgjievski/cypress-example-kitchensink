# ToDo App - Playwright Test Suite

Automated end-to-end test suite for a ToDo application, built with [Playwright](https://playwright.dev/) and the Page Object Model (POM) pattern.

## Project Structure

```
playwright-tests/
  fixtures/
    fixtures.ts          # Custom test fixtures (clean state & default state)
  pages/
    BasePage.ts          # Abstract base class with shared navigation methods
    TodoPage.ts          # Page object split into Actions and Assertions
  tests/
    create.spec.ts       # Task creation tests
    read.spec.ts         # Task display and counter tests
    update.spec.ts       # Task completion, unchecking, and editing tests
    delete.spec.ts       # Task deletion and clear completed tests
    filter.spec.ts       # Active, Completed, and All filter tests
    bugs.spec.ts         # Known bug documentation with reproducible test cases
  test-plan/
    todo.feature         # BDD test plan in Gherkin syntax
  utils/
    constants.ts         # Application URLs and paths
    testData.ts          # Centralized test data and expected values
playwright.config.ts     # Playwright configuration with Allure reporting
```

## Tech Stack

- **Playwright** - Browser automation and test runner
- **TypeScript** - Type-safe test code
- **Allure** - Step-level reporting with screenshots and traces
- **Page Object Model** - Actions/Assertions separation for readability

## Prerequisites

- Node.js (v18 or higher)
- npm
- Java (JDK 8+) — required for Allure report generation

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

The `webServer` option in `playwright.config.ts` automatically starts the app (`npm start` on `http://localhost:8080`) before tests and stops it after. If you already have the server running locally, Playwright reuses it instead of starting a second one.

```bash
# Run all tests (auto-starts the app server)
npx playwright test

# Run in headed mode (visible browser)
npx playwright test --headed

# Run a specific test file
npx playwright test create.spec.ts

# Run bug report tests with multiple iterations for reliable reproduction
npx playwright test bugs.spec.ts --headed --repeat-each=5
```

## Test Reports

On failure, Playwright automatically captures **screenshots**, **videos**, and **traces** for debugging (configured in `playwright.config.ts`).

```bash
# Generate Allure report from test results
npx allure generate allure-results --clean -o allure-report

# Open the report in your browser
npx allure open allure-report

# View a trace file from a failed test
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Test Fixtures

The suite uses two custom fixtures to handle the app's default state:

- **`todoPageCleanState`** - Opens the app and removes all pre-existing tasks, giving each test a guaranteed empty starting state.
- **`todoPageWithDefaults`** - Opens the app without clearing tasks, preserving the hardcoded default tasks for bug-report tests.

## Page Object Architecture

`TodoPage` separates user interactions from verifications using namespaced accessors:

```typescript
// Actions — what the user does
await todoPage.actions.addTask("Buy milk");
await todoPage.actions.checkTask("Buy milk");
await todoPage.actions.clickFilter("Active");

// Assertions — what we verify
await todoPage.expect.taskVisible("Buy milk");
await todoPage.expect.taskCompleted("Buy milk");
await todoPage.expect.taskCount(3);
```

## Test Coverage

| Category | Tests | Coverage |
|----------|-------|---------|
| Create   | 4     | Add single/multiple tasks, input validation (empty, spaces) |
| Read     | 3     | Counter text for 1, 2, and 3 active tasks |
| Update   | 4     | Mark complete, unmark, edit task, mark all complete |
| Delete   | 2     | Delete single task, clear all completed |
| Filter   | 3     | Filter by Active, Completed, and All |
| Bugs     | 5     | Documented application defects with GitHub Issue references |

**Total: 21 test cases**

## Known Bugs

The `bugs.spec.ts` file documents known application defects. These tests are expected to fail as they reproduce real bugs:

1. App initializes with hardcoded tasks instead of an empty list
2. Double-click edit mode is broken on the second default task
3. "Toggle All" skips the second default task
4. Checking one task inadvertently checks another
5. Completed default task not registered by the filter system

Each test references its corresponding GitHub Issue for full bug report details.
