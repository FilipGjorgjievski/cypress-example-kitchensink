import { test, expect } from '../fixtures/fixtures';

test.describe('ToDo App - Create tasks', () => {
    test('Add single new task', async ({ todoPage }) => {
        await todoPage.addTask('Fix the flux capacitor');
        await todoPage.verifyTaskVisible('Fix the flux capacitor');
    })
})