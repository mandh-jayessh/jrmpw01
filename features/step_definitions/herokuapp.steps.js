const { Given, When, Then } = require("@cucumber/cucumber");

Given(/^I launch the Internet Heroku App$/, async function () {
  await this.page.goto("https://the-internet.herokuapp.com/");
});

When(/^I click the (.*)$/, async function (link) {
  await this.page.getByRole("link", { name: link, exact: true }).click();
});
