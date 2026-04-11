import { test, expect } from "../fixtures/fixtures";
import { multipleTasks, invalidTaskInputs } from "../utils/testData";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Create tasks", () => {
  test.beforeEach(async () => {
    await epic("ToDo Application");
    await feature("Task Creation");
  });

  test("Add single new task", async ({ todoPageCleanState }) => {
    await severity(Severity.CRITICAL);

    await todoPageCleanState.addTask("Fix the flux capacitor");
    await todoPageCleanState.verifyTaskVisible("Fix the flux capacitor");
  });

  test("Add multiple new tasks", async ({ todoPageCleanState }) => {
    await severity(Severity.CRITICAL);

    await todoPageCleanState.addMultipleTasks(multipleTasks);
    await todoPageCleanState.expectTaskCount(multipleTasks.length);
  });

  for (const input of invalidTaskInputs) {
    test(`Task input validation - input: "${input}"`, async ({
      todoPageCleanState,
    }) => {
      await severity(Severity.NORMAL);

      await todoPageCleanState.addTask(input);
      await todoPageCleanState.expectTaskCount(0);
    });
  }
});
