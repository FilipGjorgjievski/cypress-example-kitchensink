import { test } from "../fixtures/fixtures";
import { TASKS } from "../utils/testData";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Filter Tasks", () => {
  test.beforeEach(async ({ todoPageCleanState }) => {
    await epic("ToDo Application");
    await feature("Task Filtering");

    // Setup: add tasks and mark the first one as completed
    await todoPageCleanState.actions.addMultipleTasks(TASKS.multiple);
    await todoPageCleanState.actions.checkTask(TASKS.multiple[0]);
  });

  test("Filter by Active tasks", async ({ todoPageCleanState }) => {
    await severity(Severity.NORMAL);

    // Apply Active filter
    await todoPageCleanState.actions.clickFilter("Active");

    // Only active tasks should be visible — completed one should be hidden
    await todoPageCleanState.expect.taskVisible(TASKS.multiple[1]);
    await todoPageCleanState.expect.taskVisible(TASKS.multiple[2]);
    await todoPageCleanState.expect.taskNotVisible(TASKS.multiple[0]);
  });

  test("Filter by Completed tasks", async ({ todoPageCleanState }) => {
    await severity(Severity.NORMAL);

    // Apply Completed filter
    await todoPageCleanState.actions.clickFilter("Completed");

    // Only completed task should be visible — active ones should be hidden
    await todoPageCleanState.expect.taskVisible(TASKS.multiple[0]);
    await todoPageCleanState.expect.taskNotVisible(TASKS.multiple[1]);
    await todoPageCleanState.expect.taskNotVisible(TASKS.multiple[2]);
  });

  test("Filter by All tasks", async ({ todoPageCleanState }) => {
    await severity(Severity.NORMAL);

    await todoPageCleanState.actions.clickFilter("Active");

    // Switch back to All — every task must be visible again
    await todoPageCleanState.actions.clickFilter("All");

    // Verify ALL tasks are visible regardless of completion state
    for (const task of TASKS.multiple) {
      await todoPageCleanState.expect.taskVisible(task);
    }
  });
});
