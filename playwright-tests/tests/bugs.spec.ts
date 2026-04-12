/**
 * BUG REPORT TEST SUITE
 *
 * These tests document and demonstrate known application defects.
 * Due to the nature of these bugs (broken event bindings on default tasks),
 * Playwright's programmatic DOM interactions can sometimes bypass the
 * faulty behavior, causing intermittent passes in automation.
 *
 * All bugs are 100% reproducible via manual testing.
 *
 * For reliable reproduction, run with multiple iterations:
 *   npx playwright test bugs.spec.ts --headed --repeat-each=5
 *
 * Each test references its corresponding GitHub Issue for full details.
 */

import { test } from "../fixtures/fixtures";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Bug Reports", async () => {
  test.beforeEach(async () => {
    await epic("ToDo Application");
    await feature("Bug Reports");
  });

  // BUG: App initializes with hardcoded tasks and deletion does not persist
  // See GitHub Issue #1 for full bug report
  test("App should initialize with an empty task list", async ({
    todoPageWithDefaults,
  }) => {
    await severity(Severity.NORMAL);

    // Steps 1-3: Open fresh session → list should be empty but has 2 hardcoded tasks
    await todoPageWithDefaults.expect.taskCountSoft(0);

    // Steps 4-5: Delete both default tasks and refresh the page
    await todoPageWithDefaults.actions.deleteTask("Pay electric bill");
    await todoPageWithDefaults.actions.deleteTask("Walk the dog");
    await todoPageWithDefaults.expect.taskCount(0);

    // Step 6: After refresh, tasks should stay deleted
    await todoPageWithDefaults.reloadPage();
    await todoPageWithDefaults.expect.taskCount(0);
  });

  // BUG: Double-click edit mode is broken on the second default task "Walk the dog"
  // See GitHub Issue #2 for full bug report
  test("Double-click should activate edit mode on all tasks", async ({
    todoPageWithDefaults,
  }) => {
    await severity(Severity.CRITICAL);

    // Control test: "Pay electric bill" enters edit mode successfully (steps 3-4)
    await todoPageWithDefaults.actions.editTask(
      "Pay electric bill",
      "Pay electric bill edited",
    );
    await todoPageWithDefaults.expect.taskVisible("Pay electric bill edited");

    // Bug: "Walk the dog" does not enter edit mode (steps 5-6)
    await todoPageWithDefaults.actions.editTask(
      "Walk the dog",
      "Walk the dog edited",
    );
    await todoPageWithDefaults.expect.taskVisible("Walk the dog edited");
  });

  // BUG: "Toggle All" skips the second default task "Walk the dog"
  // See GitHub Issue #3 for full bug report
  test("Toggle All should mark all tasks as completed including defaults", async ({
    todoPageWithDefaults,
  }) => {
    await severity(Severity.NORMAL);

    // Step 3: Add a new task to verify toggle works on user-created tasks
    await todoPageWithDefaults.actions.addTask("Buy a milk");

    // Step 4: Click "Toggle All"
    await todoPageWithDefaults.actions.markAllCompleted();

    // Step 5: All tasks should be completed — "Walk the dog" will fail
    await todoPageWithDefaults.expect.allTasksCompleted();
  });

  // BUG: Checking "Walk the dog" also checks "Pay electric bill"
  // See GitHub Issue #4 for full bug report
  test("Checking a task should only affect that specific task", async ({
    todoPageWithDefaults,
  }) => {
    await severity(Severity.NORMAL);

    // Step 4: Check only "Walk the dog"
    await todoPageWithDefaults.actions.checkTask("Walk the dog");

    // Step 5: Only "Walk the dog" should be completed
    await todoPageWithDefaults.expect.taskActive("Pay electric bill");
  });

  // BUG: Completing "Walk the dog" is not registered by the filter system
  // See GitHub Issue #5 for full bug report
  test("Completed default task should appear in Completed filter and hide from Active", async ({
    todoPageWithDefaults,
  }) => {
    await severity(Severity.CRITICAL);

    // Step 3: Mark "Walk the dog" as done
    await todoPageWithDefaults.actions.checkTask("Walk the dog");

    // Step 5: Should appear under "Completed" filter
    await todoPageWithDefaults.actions.clickFilter("Completed");
    await todoPageWithDefaults.expect.taskVisibleSoft("Walk the dog");

    // Step 6: Should NOT appear under "Active" filter
    await todoPageWithDefaults.actions.clickFilter("Active");
    await todoPageWithDefaults.expect.taskNotVisible("Walk the dog");
  });
});
