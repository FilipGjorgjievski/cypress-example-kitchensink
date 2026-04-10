import { test } from "../fixtures/fixtures";
import {
  multipleTasks,
  counterTestCases,
} from "playwright-tests/utils/testData";

test.describe("ToDo App - Read / Display", async () => {
  for (const { taskCount, expectedText } of counterTestCases) {
    test(`Counter shows "${expectedText}" when ${taskCount} task(s) active`, async ({
      todoPageCleanState,
    }) => {
      await todoPageCleanState.addMultipleTasks(
        multipleTasks.slice(0, taskCount),
      );
      await todoPageCleanState.expectCounterText(expectedText);
    });
  }
});
