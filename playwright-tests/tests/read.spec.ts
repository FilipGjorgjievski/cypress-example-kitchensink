import { test } from "../fixtures/fixtures";
import {
  multipleTasks,
  counterTestCases,
} from "playwright-tests/utils/testData";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Read / Display", async () => {
  // Each row in counterTestCases adds a different number of tasks
  for (const { taskCount, expectedText } of counterTestCases) {
    test(`Counter shows "${expectedText}" when ${taskCount} task(s) active`, async ({
      todoPageCleanState,
    }) => {
      await epic("ToDo Application");
      await feature("Task Display");
      await severity(Severity.NORMAL);

      // Take only the first 'taskCount' tasks from the shared array
      await todoPageCleanState.addMultipleTasks(
        multipleTasks.slice(0, taskCount),
      );
      await todoPageCleanState.expectCounterText(expectedText);
    });
  }
});
