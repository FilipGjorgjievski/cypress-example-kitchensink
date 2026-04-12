import { test } from "../fixtures/fixtures";
import { TASKS } from "../utils/testData";
import { epic, feature, Severity, severity } from "allure-js-commons";

test.describe("ToDo App - Create tasks", () => {
  test.beforeEach(async () => {
    await epic("ToDo Application");
    await feature("Task Creation");
  });

  test("Add single new task", async ({ todoPageCleanState }) => {
    await severity(Severity.CRITICAL);

    await todoPageCleanState.actions.addTask(TASKS.single);
    await todoPageCleanState.expect.taskVisible(TASKS.single);
  });

  test("Add multiple new tasks", async ({ todoPageCleanState }) => {
    await severity(Severity.CRITICAL);

    await todoPageCleanState.actions.addMultipleTasks(TASKS.multiple);
    await todoPageCleanState.expect.taskCount(TASKS.multiple.length);
  });

  for (const input of TASKS.invalid) {
    test(`Task input validation - input: "${input}"`, async ({
      todoPageCleanState,
    }) => {
      await severity(Severity.NORMAL);

      await todoPageCleanState.actions.addTask(input);
      await todoPageCleanState.expect.taskCount(0);
    });
  }
});
