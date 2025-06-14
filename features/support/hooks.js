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
  browser = await chromium.launch({ channel: "chrome" });
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

After(async function ({ result, pickle }) {
  const status = result.status;
  const scenarioName = pickle.name;
  console.log(`Scenario "${scenarioName}" ended with status: ${status}`);
  await this.page.close();
  await context.close();
});

AfterAll(async function () {
  await browser.close();
});
