import { test as base, Page } from "@playwright/test";
import { TodoPage } from "../pages/TodoPage";
import { step } from "allure-js-commons";

type MyFixtures = {
  todoPageCleanState: TodoPage;
  todoPageWithDefaults: TodoPage;
};

export const test = base.extend<MyFixtures>({
  todoPageCleanState: async ({ page }, use) => {
    const todoPage = new TodoPage(page);

    await step("Given the user navigates to the ToDo application", async () => {
      await todoPage.open();
    });

    await step(
      "And the default tasks are removed to ensuder a clean state",
      async () => {
        const items = page.locator(".todo-list li");
        const count = await items.count();
        for (let i = 0; i < count; i++) {
          const firstItem = items.first();
          await firstItem.hover();
          await firstItem.locator(".destroy").click();
        }
      },
    );

    await use(todoPage);
  },

  todoPageWithDefaults: async ({ page }, use) => {
    const todoPage = new TodoPage(page);

    await step("Given the user navigates to the ToDo application", async () => {
      await todoPage.open();
    });

    await use(todoPage);
  },
});

export { expect } from "@playwright/test";
