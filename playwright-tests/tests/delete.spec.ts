import { test } from "../fixtures/fixtures";
import { multipleTasks } from "playwright-tests/utils/testData";

test.describe("ToDo App - Delete Tasks", async () => {
  test("Delete a single task", async ({ todoPageCleanState }) => {
    await todoPageCleanState.addTask("Fix the flux capacitor");
    await todoPageCleanState.deleteTask("Fix the flux capacitor");
    await todoPageCleanState.expectTaskNotVisible("Fix the flux capacitor");
  });
});

test("Clear all completed tasks", async ({ todoPageCleanState }) => {
  await todoPageCleanState.addMultipleTasks(multipleTasks);
  await todoPageCleanState.markAllCompleted();
  await todoPageCleanState.clearCompleted();
  await todoPageCleanState.expectTaskCount(0);
});
