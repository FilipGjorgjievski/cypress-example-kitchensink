import { test, expect } from "../fixtures/fixtures";
import { multipleTasks, invalidTaskInputs } from "../utils/testData";

test.describe("ToDo App - Create tasks", () => {
  test("Add single new task", async ({ todoPageCleanState }) => {
    await todoPageCleanState.addTask("Fix the flux capacitor");
    await todoPageCleanState.verifyTaskVisible("Fix the flux capacitor");
  });

  test("Add multiple new tasks", async ({ todoPageCleanState }) => {
    await todoPageCleanState.addMultipleTasks(multipleTasks);
    await todoPageCleanState.expectTaskCount(multipleTasks.length);
  });

  for (const input of invalidTaskInputs) {
    test(`Task input validation - input: "${input}"`, async ({
      todoPageCleanState,
    }) => {
      await todoPageCleanState.addTask(input);
      await todoPageCleanState.expectTaskCount(0);
    });
  }
});
