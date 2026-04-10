import { test } from "../fixtures/fixtures";
import { multipleTasks } from "playwright-tests/utils/testData";

test.describe("ToDo App - Filter Tasks", () => {
  test.beforeEach(async ({ todoPageCleanState }) => {
    // Setup: add tasks and mark the first one as completed
    await todoPageCleanState.addMultipleTasks(multipleTasks);
    await todoPageCleanState.checkTask(multipleTasks[0]);
  });

  test("Filter by Active tasks", async ({ todoPageCleanState }) => {
    // Apply Active filter
    await todoPageCleanState.clickFilterActive();

    // Only active tasks should be visible — completed one should be hidden
    await todoPageCleanState.verifyTaskVisible(multipleTasks[1]);
    await todoPageCleanState.verifyTaskVisible(multipleTasks[2]);
    await todoPageCleanState.expectTaskNotVisible(multipleTasks[0]);
  });

  test("Filter by Completed tasks", async ({ todoPageCleanState }) => {
    // Apply Completed filter
    await todoPageCleanState.clickFilterCompleted();

    // Only completed task should be visible — active ones should be hidden
    await todoPageCleanState.verifyTaskVisible(multipleTasks[0]);
    await todoPageCleanState.expectTaskNotVisible(multipleTasks[1]);
    await todoPageCleanState.expectTaskNotVisible(multipleTasks[2]);
  });

  test("Filter by All tasks", async ({ todoPageCleanState }) => {
    await todoPageCleanState.clickFilterActive();

    // Switch back to All — every task must be visible again
    await todoPageCleanState.clickFilterAll();

    // Verify ALL tasks are visible regardless of completion state
    for (const task of multipleTasks) {
      await todoPageCleanState.verifyTaskVisible(task);
    }
  });
});
