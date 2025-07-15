import LoginPage from "../pageobjects/login.page";

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open();
    await LoginPage.login(
      process.env.CONFLUENCE_USER_EMAIL!,
      process.env.CONFLUENCE_USER_PASSWORD!
    );

    await browser.url(`${process.env.CONFLUENCE_BASE_URL}/wiki/home`);

    await browser.pause(10000);
  });
});
