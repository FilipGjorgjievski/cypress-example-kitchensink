import { test } from "../fixtures/fixtures";
import { multipleTasks } from "playwright-tests/utils/testData";
import { epic, feature, story, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Update Tasks", () => {
  test.beforeEach(async () => {
    await epic("ToDo Application");
    await feature("Task Update");
  });

  // Nested describe groups tests that share the same single-task precondition
  test.describe("single task operations", () => {
    test.beforeEach(async ({ todoPageCleanState }) => {
      await todoPageCleanState.addTask("Fix the flux capacitor");
    });

    test("Mark a task as completed", async ({ todoPageCleanState }) => {
      await severity(Severity.CRITICAL);

      await todoPageCleanState.checkTask("Fix the flux capacitor");
      await todoPageCleanState.expectTaskCompleted("Fix the flux capacitor");
    });

    test("Unmark a completed task", async ({ todoPageCleanState }) => {
      await severity(Severity.CRITICAL);

      // Step 1 — mark as completed and verify
      await todoPageCleanState.checkTask("Fix the flux capacitor");
      await todoPageCleanState.expectTaskCompleted("Fix the flux capacitor");

      // Step 2 — unmark and verify it's active again
      await todoPageCleanState.checkTask("Fix the flux capacitor");
      await todoPageCleanState.expectTaskActive("Fix the flux capacitor");
    });

    test("Edit an existing task", async ({ todoPageCleanState }) => {
      await severity(Severity.CRITICAL);

      await todoPageCleanState.editTask(
        "Fix the flux capacitor",
        "Replace the flux capacitor",
      );
      await todoPageCleanState.verifyTaskVisible("Replace the flux capacitor");
    });
  });

  test("Mark all tasks as completed", async ({ todoPageCleanState }) => {
    await severity(Severity.NORMAL);

    await epic("ToDo Application");
    await feature("Task Update");

    await todoPageCleanState.addMultipleTasks(multipleTasks);
    await todoPageCleanState.markAllCompleted();
    await todoPageCleanState.expectAllTasksCompleted();
  });
});
