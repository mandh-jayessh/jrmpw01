const { expect } = require("@playwright/test");

exports.JavascriptAlertsPage = class JavascriptAlertsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator(".heading");
    this.JS_Alert_button = page.locator("text=Click for JS Alert");
    this.JS_Confirm_button = page.locator("text=Click for JS Confirm");
    this.JS_Prompt_button = page.locator("text=Click for JS Prompt");
    this.JS_alerts_page_result = page.locator("#result");
  }

  async goto() {
    await this.page.goto(
      "https://the-internet.herokuapp.com/javascript_alerts"
    );
  }

  async clickForAlert() {
    await this.JS_Alert_button.click();
  }

  async clickForConfirm() {
    await this.JS_Confirm_button.click();
  }

  async clickForPrompt() {
    await this.JS_Prompt_button.click();
  }

  async result_validation(text) {
    await expect(this.JS_alerts_page_result).toHaveText(text);
  }
};
