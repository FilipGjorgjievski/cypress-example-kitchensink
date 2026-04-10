import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

type MyFixtures = {
    todoPage: TodoPage;
}

export const test = base.extend<MyFixtures>({
    todoPage: async ({ page }, use) => {
        const todoPage = new TodoPage(page);
        await todoPage.open();
        await use(todoPage);
    },
});

export { expect } from '@playwright/test';