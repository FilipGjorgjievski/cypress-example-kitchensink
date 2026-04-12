import { test as base } from "@playwright/test";
import { TodoPage } from "../pages/TodoPage";
import { step } from "allure-js-commons";

type MyFixtures = {
  todoPageCleanState: TodoPage;
  todoPageWithDefaults: TodoPage;
};

export const test = base.extend<MyFixtures>({
  // Opens the ToDo app and removes any pre-existing tasks,
  // giving each test a guaranteed empty starting state.
  todoPageCleanState: async ({ page }, use) => {
    const todoPage = new TodoPage(page);

    await step("Given the user navigates to the ToDo application", async () => {
      await todoPage.open();
    });
    await todoPage.actions.clearAllTasks();
    await use(todoPage);
  },

  // Opens the ToDo app without clearing tasks,
  // preserving the hardcoded default tasks for bug-report tests.
  todoPageWithDefaults: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await step("Given the user navigates to the ToDo application", async () => {
      await todoPage.open();
    });
    await use(todoPage);
  },
});

export { expect } from "@playwright/test";
