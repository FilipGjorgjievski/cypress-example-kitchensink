import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { todoPath } from "../utils/constants";
import { step } from "allure-js-commons";

export class TodoPage extends BasePage {
  private readonly newTodoInput: Locator;
  private readonly todoItems: Locator;
  private readonly todoCounter: Locator;
  private readonly toggleAllButton: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodoInput = this.page.locator('[data-test="new-todo"]');
    this.todoItems = this.page.locator(".todo-list").getByRole("listitem");
    this.todoCounter = this.page.locator(".todo-count");
    this.toggleAllButton = this.page.getByText("Mark all as complete");
  }

  async open(): Promise<void> {
    await this.navigateTo(todoPath);
  }

  async addTask(taskName: string) {
    await step(
      `When the user types "${taskName}" in the input field and presses Enter`,
      async () => {
        await this.newTodoInput.fill(taskName);
        await this.newTodoInput.press("Enter");
      },
    );
  }

  async verifyTaskVisible(taskName: string) {
    await step(
      `Then the task "${taskName}" should appear in the list`,
      async () => {
        await expect(
          this.todoItems.filter({ hasText: taskName }),
        ).toBeVisible();
      },
    );
  }

  async addMultipleTasks(taskNames: string[]) {
    await step(`When the user adds ${taskNames.length} tasks`, async () => {
      for (const taskName of taskNames) {
        await this.newTodoInput.fill(taskName);
        await this.newTodoInput.press("Enter");
      }
    });
  }

  async expectTaskCount(count: number) {
    await step(
      `Then all ${count} tasks should appear in the list`,
      async () => {
        await expect(this.todoItems).toHaveCount(count);
      },
    );
  }

  async expectCounterText(text: string) {
    await step(`Then the counter should show "${text}"`, async () => {
      await expect(this.todoCounter).toHaveText(text);
    });
  }

  async checkTask(taskName: string) {
    await step(
      `When the user clicks the checkbox next to "${taskName}"`,
      async () => {
        await this.todoItems
          .filter({ hasText: taskName })
          .getByRole("checkbox")
          .click();
      },
    );
  }

  async expectTaskCompleted(taskName: string) {
    await step(
      `Then the task "${taskName}" should be marked as completed`,
      async () => {
        await expect(this.todoItems.filter({ hasText: taskName })).toHaveClass(
          "completed",
        );
      },
    );
  }

  async expectTaskActive(taskName: string) {
    await step(
      `Then the task "${taskName}" should be marked as active`,
      async () => {
        await expect(
          this.todoItems.filter({ hasText: taskName }),
        ).not.toHaveClass("completed");
      },
    );
  }

  async markAllCompleted() {
    await step(
      'When the user clicks the "Mark all as complete" toggle',
      async () => {
        await this.toggleAllButton.click();
      },
    );
  }

  async expectAllTasksCompleted() {
    await step("Then all tasks should be marked as completed", async () => {
      const count = await this.todoItems.count();
      for (let i = 0; i < count; i++) {
        await expect(this.todoItems.nth(i)).toHaveClass("completed");
      }
    });
  }

  async editTask(oldName: string, newName: string) {
    await step(
      `When the user edites "${oldName}" to "${newName}"`,
      async () => {
        await this.todoItems
          .filter({ hasText: oldName })
          .getByText(oldName)
          .dblclick();
        await this.todoItems
          .filter({ hasText: oldName })
          .getByRole("textbox")
          .fill(newName);
        await this.todoItems
          .filter({ hasText: oldName })
          .getByRole("textbox")
          .press("Enter");
      },
    );
  }
}
