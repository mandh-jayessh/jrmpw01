const { test, expect } = require("@playwright/test");
const { JavascriptAlertsPage } = require("../pages/JS_Alerts_page");

test.describe("Basic Interactions - Inputs, Checkboxes, Dropdowns, Drag and Drop", () => {
  test.beforeEach("Launch Internet Herokuapp", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/");
    await expect(page).toHaveTitle("The Internet");
    await expect(page).toHaveTitle(/Internet/);
    await expect(page).not.toHaveTitle(/Interanet/);
    await expect(page.getByText("Welcome to the-internet")).toBeVisible();
    await page.waitForTimeout(2000);
  });

  test("Form Authentication Login Page", async ({ page }) => {
    await page.getByRole("link", { name: "Form Authentication" }).click();

    //1. Invalid Credentials
    await page.getByLabel("username").fill("username");
    await page.getByLabel("password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    // Printing error message
    console.log(await page.locator(".flash").textContent());
    await page.waitForTimeout(2000);

    //2. Valid Credentials
    let username = await page
      .locator("//*[@class='subheader']/child::em[1]")
      .textContent();
    let password = await page
      .locator("//*[@class='subheader']/child::em[2]")
      .textContent();
    await page.getByLabel("username").fill(username);
    await page.getByLabel("password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    // Printing Login Success message
    console.log(await page.locator(".flash").textContent());
    await page.waitForTimeout(2000);
    await page.getByRole("link", { name: "Logout" }).click();
  });

  test("Checkboxes", async ({ page }) => {
    await page.getByRole("link", { name: "Checkboxes" }).click();
    await page.waitForTimeout(2000);
    // Verifying that Checkbox 2 is already Checked
    await expect(
      page.locator('//input[@type="checkbox"]').nth(1)
    ).toBeChecked();

    await page.locator('//input[@type="checkbox"]').last().uncheck();
    // Verifying that Checkbox 2 got Unchecked
    await expect(
      page.locator('//input[@type="checkbox"]').nth(1)
    ).not.toBeChecked();

    // await page.locator('#checkboxes').selectOption([' checkbox 1',' checkbox 2'])

    await page.waitForTimeout(2000);
    await page.locator('//input[@type="checkbox"]').nth(0).check();
    // Verifying that Checkbox 1 got Checked
    await expect(
      page.locator('//input[@type="checkbox"]').first()
    ).toBeChecked();
  });

  test("Dropdown", async ({ page }) => {
    await page.getByRole("link", { name: "Dropdown" }).click();
    await page.locator('select[id="dropdown"]').selectOption("Option 1");
    await page.waitForTimeout(2000);
    await page.locator('select[id="dropdown"]').selectOption({ index: 2 });
    await page.waitForTimeout(2000);
    await page.locator('select[id="dropdown"]').selectOption({ value: "1" });
    await page.waitForTimeout(2000);
    await page
      .locator('select[id="dropdown"]')
      .selectOption({ label: "Option 2" });
  });

  test("Drag and Drop", async ({ page }) => {
    await page.getByRole("link", { name: "Drag and Drop" }).click();
    //1. Using dragTo
    await page.waitForTimeout(2000);
    await page.locator("#column-a").dragTo(page.locator("#column-b"));
    await page.waitForTimeout(2000);

    //2. Using Mouse Actions
    await page.locator("#column-a").hover();
    await page.waitForTimeout(2000);
    await page.mouse.down();
    await page.waitForTimeout(2000);
    await page.locator("#column-b").hover();
    await page.waitForTimeout(2000);
    await page.mouse.up();
  });

  test.afterEach("Close everything", async ({ page }) => {
    await page.goBack();
    await page.waitForTimeout(2000);
    await page.close();
  });
});

test.describe("JavaScript Alerts with POM", () => {
  let javascriptAlerts = JavascriptAlertsPage;

  test.beforeEach(
    "Launch JS Alerts in Internet Herokuapp",
    async ({ page }) => {
      javascriptAlerts = new JavascriptAlertsPage(page);
      await javascriptAlerts.goto();
      await expect(page.locator("#content")).toBeVisible();
      await page.waitForTimeout(2000);
    }
  );

  test("JS Alert - Click OK", async ({ page }) => {
    // const javascriptAlerts = new JavascriptAlertsPage(page);
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toEqual("I am a JS Alert");
      await dialog.accept();
    });
    await javascriptAlerts.clickForAlert();
    await javascriptAlerts.result_validation(
      "You successfully clicked an alert"
    );
  });

  test("JS Confirm - Click OK", async ({ page }) => {
    // const javascriptAlerts = new JavascriptAlertsPage(page);
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toEqual("I am a JS Confirm");
      await dialog.accept();
    });
    await javascriptAlerts.clickForConfirm();
    await javascriptAlerts.result_validation("You clicked: Ok");
  });

  test("JS Confirm - Click Cancel", async ({ page }) => {
    // const javascriptAlerts = new JavascriptAlertsPage(page);
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toEqual("I am a JS Confirm");
      await dialog.dismiss();
    });
    await javascriptAlerts.clickForConfirm();
    await javascriptAlerts.result_validation("You clicked: Cancel");
  });

  test("JS Prompt - Input text in prompt, Click OK and Validate Input Text", async ({
    page,
  }) => {
    // const javascriptAlerts = new JavascriptAlertsPage(page);
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toEqual("I am a JS prompt");
      await dialog.accept("Sadda Haq");
    });
    await javascriptAlerts.clickForPrompt();
    await javascriptAlerts.result_validation("You entered: Sadda Haq");
  });

  test.afterEach("Close everything", async ({ page }) => {
    await page.goBack();
    await page.waitForTimeout(2000);
    await page.close();
  });
});
