import { Page } from "@playwright/test";
import { step } from "allure-js-commons";

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract open(): Promise<void>;

  async navigateTo(path: string) {
    await step(`Given the user navigates to "${path}"`, async () => {
      await this.page.goto(path);
    });
  }

  async reloadPage() {
    await step("When the user reloads the page", async () => {
      await this.page.reload();
    });
  }
}
