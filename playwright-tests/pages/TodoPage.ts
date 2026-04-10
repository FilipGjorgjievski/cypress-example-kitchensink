import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { todoPath } from '../utils/constants';
import { step } from 'allure-js-commons';

export class TodoPage extends BasePage {
    private readonly newTodoInput: Locator;
    private readonly todoItems: Locator;

    constructor(page: Page) {
        super(page);
        this.newTodoInput = this.page.locator('[data-test="new-todo"]');
        this.todoItems = this.page.locator('.todo-list').getByRole('listitem');;
    }

    async open(): Promise<void> {
        await this.navigateTo(todoPath);
    }

    async addTask(taskName: string) {
        await step(`When the user types "${taskName}" in the input field and presses Enter`, async () => {
            await this.newTodoInput.fill(taskName);
            await this.newTodoInput.press('Enter');
        });
    }

    async verifyTaskVisible(taskName: string) {
        await step(`Then the task "${taskName}" should appear in the list`, async () => {
            await expect(this.todoItems.filter({ hasText: taskName })).toBeVisible();
        })
    }
}