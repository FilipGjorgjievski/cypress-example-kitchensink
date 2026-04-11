import { test } from "../fixtures/fixtures";
import { multipleTasks } from "playwright-tests/utils/testData";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Delete Tasks", async () => {
  test.beforeEach(async () => {
    await epic("ToDo Application");
    await feature("Task Deletion");
  });

  test("Delete a single task", async ({ todoPageCleanState }) => {
    await severity(Severity.CRITICAL);

    await todoPageCleanState.addTask("Fix the flux capacitor");
    await todoPageCleanState.deleteTask("Fix the flux capacitor");
    await todoPageCleanState.expectTaskNotVisible("Fix the flux capacitor");
  });

  test("Clear all completed tasks", async ({ todoPageCleanState }) => {
    await severity(Severity.NORMAL);

    await todoPageCleanState.addMultipleTasks(multipleTasks);
    await todoPageCleanState.markAllCompleted();
    await todoPageCleanState.clearCompleted();
    await todoPageCleanState.expectTaskCount(0);
  });
});
