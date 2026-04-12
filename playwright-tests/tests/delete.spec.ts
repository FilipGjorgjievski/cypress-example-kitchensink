import { test } from "../fixtures/fixtures";
import { TASKS } from "../utils/testData";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Delete Tasks", async () => {
  test.beforeEach(async () => {
    await epic("ToDo Application");
    await feature("Task Deletion");
  });

  test("Delete a single task", async ({ todoPageCleanState }) => {
    await severity(Severity.CRITICAL);

    await todoPageCleanState.actions.addTask(TASKS.single);
    await todoPageCleanState.actions.deleteTask(TASKS.single);
    await todoPageCleanState.expect.taskNotVisible(TASKS.single);
  });

  test("Clear all completed tasks", async ({ todoPageCleanState }) => {
    await severity(Severity.NORMAL);

    await todoPageCleanState.actions.addMultipleTasks(TASKS.multiple);
    await todoPageCleanState.actions.markAllCompleted();
    await todoPageCleanState.actions.clearCompleted();
    await todoPageCleanState.expect.taskCount(0);
  });
});
