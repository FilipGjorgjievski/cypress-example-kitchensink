import { test } from "../fixtures/fixtures";
import { TASKS } from "../utils/testData";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Update Tasks", () => {
  test.beforeEach(async () => {
    await epic("ToDo Application");
    await feature("Task Update");
  });

  // Nested describe groups tests that share the same single-task precondition
  test.describe("single task operations", () => {
    test.beforeEach(async ({ todoPageCleanState }) => {
      await todoPageCleanState.actions.addTask(TASKS.single);
    });

    test("Mark a task as completed", async ({ todoPageCleanState }) => {
      await severity(Severity.CRITICAL);

      await todoPageCleanState.actions.checkTask(TASKS.single);
      await todoPageCleanState.expect.taskCompleted(TASKS.single);
    });

    test("Unmark a completed task", async ({ todoPageCleanState }) => {
      await severity(Severity.CRITICAL);

      // Step 1 — mark as completed and verify
      await todoPageCleanState.actions.checkTask(TASKS.single);
      await todoPageCleanState.expect.taskCompleted(TASKS.single);

      // Step 2 — unmark and verify it's active again
      await todoPageCleanState.actions.checkTask(TASKS.single);
      await todoPageCleanState.expect.taskActive(TASKS.single);
    });

    test("Edit an existing task", async ({ todoPageCleanState }) => {
      await severity(Severity.CRITICAL);

      await todoPageCleanState.actions.editTask(
        TASKS.single,
        TASKS.singleEdited,
      );
      await todoPageCleanState.expect.taskVisible(TASKS.singleEdited);
    });
  });

  test("Mark all tasks as completed", async ({ todoPageCleanState }) => {
    await severity(Severity.NORMAL);

    await todoPageCleanState.actions.addMultipleTasks(TASKS.multiple);
    await todoPageCleanState.actions.markAllCompleted();
    await todoPageCleanState.expect.allTasksCompleted();
  });
});
