import { test } from "../fixtures/fixtures";
import { multipleTasks } from "playwright-tests/utils/testData";

test.describe("ToDO App - Update Tasks", () => {
  test.describe("single task operations", () => {
    // Shared precondition: all tests in this group operate on one existing task
    test.beforeEach(async ({ todoPageCleanState }) => {
      await todoPageCleanState.addTask("Fix the flux capacitor");
    });

    test("Mark a task as completed", async ({ todoPageCleanState }) => {
      await todoPageCleanState.checkTask("Fix the flux capacitor");
      await todoPageCleanState.expectTaskCompleted("Fix the flux capacitor");
    });

    test("Unmark a completed task", async ({ todoPageCleanState }) => {
      // Step 1 — mark as completed and verify
      await todoPageCleanState.checkTask("Fix the flux capacitor");
      await todoPageCleanState.expectTaskCompleted("Fix the flux capacitor");

      // Step 2 — unmark and verify it's active again
      await todoPageCleanState.checkTask("Fix the flux capacitor");
      await todoPageCleanState.expectTaskActive("Fix the flux capacitor");
    });

    test("Edit an existing task", async ({ todoPageCleanState }) => {
      await todoPageCleanState.editTask(
        "Fix the flux capacitor",
        "Replace the flux capacitor",
      );
      await todoPageCleanState.verifyTaskVisible("Replace the flux capacitor");
    });
  });

  test("Mark all tasks as completed", async ({ todoPageCleanState }) => {
    await todoPageCleanState.addMultipleTasks(multipleTasks);
    await todoPageCleanState.markAllCompleted();
    await todoPageCleanState.expectAllTasksCompleted();
  });
});
