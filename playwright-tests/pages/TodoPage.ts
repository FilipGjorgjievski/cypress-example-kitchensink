import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { APP } from "../utils/constants";
import { step } from "allure-js-commons";

// ── Shared helper ──────────────────────────────────────
function taskByName(todoItems: Locator, name: string): Locator {
  return todoItems.filter({ hasText: name });
}

// ── Actions ────────────────────────────────────────────
class TodoActions {
  constructor(
    private readonly page: Page,
    private readonly newTodoInput: Locator,
    private readonly todoItems: Locator,
    private readonly toggleAllButton: Locator,
    private readonly clearCompletedButton: Locator,
  ) {}

  async addTask(taskName: string) {
    await step(
      `When the user types "${taskName}" in the input field and presses Enter`,
      async () => {
        await this.newTodoInput.fill(taskName);
        await this.newTodoInput.press("Enter");
      },
    );
  }

  async addMultipleTasks(taskNames: readonly string[]) {
    await step(`When the user adds ${taskNames.length} tasks`, async () => {
      for (const taskName of taskNames) {
        await this.newTodoInput.fill(taskName);
        await this.newTodoInput.press("Enter");
      }
    });
  }

  async checkTask(taskName: string) {
    await step(
      `When the user clicks the checkbox next to "${taskName}"`,
      async () => {
        await taskByName(this.todoItems, taskName)
          .getByRole("checkbox")
          .click();
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

  async editTask(oldName: string, newName: string) {
    await step(
      `When the user edits "${oldName}" to "${newName}"`,
      async () => {
        const task = taskByName(this.todoItems, oldName);
        await task.getByText(oldName).dblclick();
        const editor = task.getByRole("textbox");
        await editor.fill(newName);
        await editor.press("Enter");
      },
    );
  }

  async deleteTask(taskName: string) {
    await step(`When the user deletes the task "${taskName}"`, async () => {
      const task = taskByName(this.todoItems, taskName);
      await task.hover();
      await task.getByRole("button").click();
    });
  }

  async clearCompleted() {
    await step("When the user clicks 'Clear completed'", async () => {
      await this.clearCompletedButton.click();
    });
  }

  async clickFilter(filter: "All" | "Active" | "Completed") {
    await step(`When the user clicks the '${filter}' filter`, async () => {
      await this.page.getByRole("link", { name: filter }).click();
    });
  }

  async clearAllTasks() {
    await step(
      "And the default tasks are removed to ensure a clean state",
      async () => {
        const count = await this.todoItems.count();
        for (let i = 0; i < count; i++) {
          // Always target first() because the list shrinks after each deletion
          const firstItem = this.todoItems.first();
          await firstItem.hover();
          await firstItem.getByRole("button").click();
        }
      },
    );
  }
}

// ── Assertions ─────────────────────────────────────────
class TodoAssertions {
  constructor(
    private readonly todoItems: Locator,
    private readonly todoCounter: Locator,
  ) {}

  async taskVisible(taskName: string) {
    await step(
      `Then the task "${taskName}" should appear in the list`,
      async () => {
        await expect(taskByName(this.todoItems, taskName)).toBeVisible();
      },
    );
  }

  async taskNotVisible(taskName: string) {
    await step(
      `Then the task "${taskName}" should no longer appear in the list`,
      async () => {
        await expect(taskByName(this.todoItems, taskName)).toHaveCount(0);
      },
    );
  }

  async taskCount(count: number) {
    await step(
      `Then all ${count} tasks should appear in the list`,
      async () => {
        await expect(this.todoItems).toHaveCount(count);
      },
    );
  }

  async counterText(text: string) {
    await step(`Then the counter should show "${text}"`, async () => {
      await expect(this.todoCounter).toHaveText(text);
    });
  }

  async taskCompleted(taskName: string) {
    await step(
      `Then the task "${taskName}" should be marked as completed`,
      async () => {
        await expect(taskByName(this.todoItems, taskName)).toHaveClass(
          /completed/,
        );
      },
    );
  }

  async taskActive(taskName: string) {
    await step(
      `Then the task "${taskName}" should be marked as active`,
      async () => {
        await expect(taskByName(this.todoItems, taskName)).not.toHaveClass(
          /completed/,
        );
      },
    );
  }

  async allTasksCompleted() {
    await step("Then all tasks should be marked as completed", async () => {
      const count = await this.todoItems.count();
      // toHaveClass on a multi-element locator expects an array — one pattern per item
      await expect(this.todoItems).toHaveClass(
        Array(count).fill(/completed/),
      );
    });
  }

  // ── Soft assertions ──
  async taskCountSoft(count: number) {
    await step(
      `Then the task list should have ${count} tasks (soft check)`,
      async () => {
        await expect.soft(this.todoItems).toHaveCount(count);
      },
    );
  }

  async taskVisibleSoft(taskName: string) {
    await step(
      `Then the task "${taskName}" should appear in the list (soft check)`,
      async () => {
        await expect.soft(taskByName(this.todoItems, taskName)).toBeVisible();
      },
    );
  }
}

// ── Page Object ────────────────────────────────────────
export class TodoPage extends BasePage {
  readonly actions: TodoActions;
  readonly expect: TodoAssertions;

  constructor(page: Page) {
    super(page);

    const newTodoInput = page.locator('[data-test="new-todo"]');
    const todoItems = page.locator(".todo-list").getByRole("listitem");
    const todoCounter = page.locator(".todo-count");
    const toggleAllButton = page.getByText("Mark all as complete");
    const clearCompletedButton = page.getByRole("button", {
      name: "Clear completed",
    });

    this.actions = new TodoActions(
      page,
      newTodoInput,
      todoItems,
      toggleAllButton,
      clearCompletedButton,
    );
    this.expect = new TodoAssertions(todoItems, todoCounter);
  }

  async open() {
    await this.navigateTo(APP.paths.todo);
  }
}
