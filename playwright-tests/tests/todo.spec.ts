import { test, expect } from "../fixtures/fixtures";
import { multipleTasks } from "../utils/testData";

test.describe("ToDo App - Create tasks", () => {
  test("Add single new task", async ({ todoPageCleanState }) => {
    await todoPageCleanState.addTask("Fix the flux capacitor");
    await todoPageCleanState.verifyTaskVisible("Fix the flux capacitor");
  });

  test("Add multiple new tasks", async ({ todoPageCleanState }) => {
    await todoPageCleanState.addMultipleTasks(multipleTasks);
    await todoPageCleanState.expectTaskCount(multipleTasks.length);
  });

});
