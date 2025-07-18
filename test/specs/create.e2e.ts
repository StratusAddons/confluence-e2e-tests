import LoginPage from "../pageobjects/login.page";
import { Space } from "../pageobjects/space.page";
import testData from "../data.json";

describe("Create Diagram Regression", () => {
  const today = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("-");
  let spaceKey: string;
  let spaceName: string;

  before(async () => {
    await LoginPage.open();
    await LoginPage.login(
      process.env.CONFLUENCE_USER_EMAIL!,
      process.env.CONFLUENCE_USER_PASSWORD!
    );

    await browser.url(`${process.env.CONFLUENCE_BASE_URL}/wiki/home`);
    spaceName = `Regression Test Space: ${today}-1`;
    spaceKey = `RTS${today.replace(/-/g, "")}`.slice(0, 10).toUpperCase();

    await Space.create(spaceName, spaceKey);
  });

  describe("creates a diagram for each test diagram", async () => {
    const basePageName = "TST-001";

    testData.forEach((test) => {
      it(test.description, async () => {
        const page = await Space.createPage();
        const pageTitle = `${basePageName}-${test.id}`;

        await page.publish(pageTitle);
        await page.openInEditMode();
      });
    });
  });
});
