const {
  BeforeAll,
  AfterAll,
  Before,
  After,
  AfterStep,
  Status,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { Browser, BrowserContext, chromium } = require("@playwright/test");
let browser = Browser,
  context = BrowserContext;
setDefaultTimeout(30 * 1000);

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true });
});

Before(async function () {
  context = await browser.newContext();
  this.page = await context.newPage();
});

AfterStep(async function ({ result, pickle }) {
  if (result.status === Status.FAILED) {
    const images = await this.page.screenshot({
      path: `./reports/failure-screenshots/${pickle.name}.png`,
      type: "png",
    });
    this.attach(images, "image/png");
  }
});

After(async function () {
  await this.page.close();
  await context.close();
});

AfterAll(async function () {
  await browser.close();
});
