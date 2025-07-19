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
  let setupSuccessful = false;

  const checkIfLoggedIn = async (): Promise<boolean> => {
    try {
      await browser.url(`${process.env.CONFLUENCE_BASE_URL}/wiki/home`);
      await browser.pause(2000);

      // Check for login indicators - adjust these selectors based on your Confluence instance
      const loginIndicators = [
        '[name="username"]',
        "#login-submit",
        "button*=Log in",
        'input[type="email"]',
        '[data-testid="username"]',
      ];

      // Check for logged-in indicators (indicates logged in)
      const loggedInIndicators = [
        "button=Spaces",
        '[data-item-title="true"]',
        'span[role="img"][aria-label="Create"]',
        '[data-testid="user-avatar"]',
        '[aria-label="User avatar"]',
        'nav[aria-label="Site"]',
        'body:has-text("Your apps")',
        '[data-testid="space-list"]',
      ];

      // First check if we see any login form elements
      for (const selector of loginIndicators) {
        const element = await $(selector);
        if (await element.isExisting()) {
          console.log(`🔍 Found login indicator: ${selector} - Not logged in`);
          return false;
        }
      }

      // Then check if we see logged-in indicators
      for (const selector of loggedInIndicators) {
        const element = await $(selector);
        if (await element.isExisting()) {
          console.log(
            `🔍 Found logged-in indicator: ${selector} - Already logged in`
          );
          return true;
        }
      }

      // If we can't determine, check the URL
      const currentUrl = await browser.getUrl();
      if (
        currentUrl.includes("id.atlassian.com/login") ||
        currentUrl.includes("/login")
      ) {
        console.log(
          `🔍 URL indicates login page: ${currentUrl} - Not logged in`
        );
        return false;
      }

      // Default to not logged in if we can't determine
      console.log("🔍 Cannot determine login status, assuming not logged in");
      return false;
    } catch (error) {
      console.log(
        "🔍 Error checking login status, assuming not logged in:",
        error
      );
      return false;
    }
  };

  const performSetup = async (attempt: number): Promise<void> => {
    try {
      console.log(`🔄 Attempting setup (attempt ${attempt}/2)...`);

      // Check if already logged in
      const isLoggedIn = await checkIfLoggedIn();

      if (!isLoggedIn) {
        console.log("🔐 Not logged in, proceeding with login...");
        await LoginPage.open();
        await LoginPage.login(
          process.env.CONFLUENCE_USER_EMAIL!,
          process.env.CONFLUENCE_USER_PASSWORD!
        );
        console.log("✅ Login successful");
        // Navigate to home
        await browser.url(`${process.env.CONFLUENCE_BASE_URL}/wiki/home`);
        console.log("✅ Navigation to home successful");
      } else {
        console.log("✅ Already logged in, skipping login step");
      }

      // Set space name with attempt suffix
      spaceName = `Regression Test Space: ${today}-${attempt}`;
      spaceKey = `RTS${today.replace(/-/g, "")}${attempt}`
        .slice(0, 10)
        .toUpperCase();

      // Create space
      await Space.create(spaceName, spaceKey);
      console.log(`✅ Space created: ${spaceName} (${spaceKey})`);

      setupSuccessful = true;
      console.log("🎉 Setup completed successfully!");
    } catch (error) {
      console.error(`❌ Setup failed on attempt ${attempt}:`, error);

      // Create special report for setup failure
      const failureReport = {
        timestamp: new Date().toISOString(),
        attempt: attempt,
        spaceName: spaceName,
        spaceKey: spaceKey,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };

      // Log the failure report (you can also write to file or send to reporting service)
      console.log(
        "📋 Setup Failure Report:",
        JSON.stringify(failureReport, null, 2)
      );

      // If this was the last attempt, throw the error
      if (attempt === 2) {
        throw new Error(
          `Setup failed after ${attempt} attempts. Last error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  };

  before(async () => {
    for (let attempt = 1; attempt <= 2; attempt++) {
      if (setupSuccessful) break;

      await performSetup(attempt);

      if (!setupSuccessful && attempt === 1) {
        console.log("⏳ Waiting 3 seconds before retry...");
        await browser.pause(3000);
      }
    }

    if (!setupSuccessful) {
      throw new Error("Setup failed after all retry attempts");
    }
  });

  describe("creates a diagram for each test diagram", async () => {
    const basePageName = "TST-001";

    // Skip all tests if setup failed
    beforeEach(function () {
      if (!setupSuccessful) {
        this.skip();
      }
    });

    testData.forEach((test) => {
      it(test.description, async () => {
        let page = null;
        try {
          page = await Space.createPage();
          const pageTitle = `${basePageName}-${test.id}`;

          await page.publish(pageTitle);
          await page.openInEditMode();
        } catch (error) {
          console.error(
            `❌ Page creation failed for test: ${test.description}:`,
            error
          );
          throw error;
        }

        if (page) {
          await page.createMacro();

          const macroFrame = await $("iframe");
          await macroFrame.waitForExist();
          await browser.switchFrame(macroFrame);

          // Remove when not testing on local machine
          const visitBtn = await $("button*=Visit Site");
          await visitBtn.waitForExist();
          await visitBtn.click();

          const editorTextArea = await $(
            'textarea[aria-roledescription="editor"]'
          );
          await editorTextArea.waitForExist();
          await editorTextArea.setValue(test.diagram);

          await browser.keys(["Control", "Enter", "NULL"]);

          const svg = await $("svg.leaflet-image-layer");
          await svg.waitForExist();

          await expect(svg).toHaveText(
            expect.stringContaining(test.validation)
          );

          await browser.saveScreenshot(
            `./screenshots/test-${test.id}-browser.png`
          );

          const publishDiagramButton = await $("button*=Publish");
          await publishDiagramButton.waitForClickable();
          await publishDiagramButton.click();

          const diagramName = await $('input[name="fname"]');
          await diagramName.waitForExist();
          await diagramName.setValue(`${basePageName}-${test.id}`);

          const publishDiagramButtonModal = await $(
            'button[id="selectsaveAsPopup"]'
          );
          await publishDiagramButtonModal.waitForClickable();
          await publishDiagramButtonModal.click();

          await browser.pause(3000);

          //   await browser.switchToParentFrame();

          const updateBtn = await $("button*=Update");
          await updateBtn.waitForClickable();
          await updateBtn.click();

          const rootSpaceMenuItem = await $(`a*=${spaceName}`);
          await rootSpaceMenuItem.waitForClickable();
          await rootSpaceMenuItem.click();

          await browser.pause(10000);
        }
      });
    });
  });

  after(async () => {
    if (setupSuccessful && spaceKey) {
      // Cleanup if neded
    }
  });
});
