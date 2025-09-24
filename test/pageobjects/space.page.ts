import Page from "./page";
import Pages from "./pages.page";

export default class SpacePage extends Page {
  get nameField() {
    return $('input[name="name"]');
  }
  get keyField() {
    return $('input[name="key"]');
  }

  get customizeSpaceKeyButton() {
    return $("button=Customize space key");
  }

  get spaceKeyField() {
    return $('textbox[aria-label*="Space key"]');
  }
  get submitBtn() {
    return $('button[type="submit"]');
  }

  get spacesListGroup() {
    return $("button=Spaces");
  }

  get createSpaceMenuItem() {
    return $("button=Create a space");
  }

  get createButton() {
    return $('span[role="img"][aria-label="Create"]');
  }

  get createPageButton() {
    return $(`//span[@data-item-title="true" and .//span[text()="Page"]]`);
  }

  /**
   * Create a new space with given name/key
   */
  public async create(name: string, key: string) {
    await this.click(this.spacesListGroup);

    await this.click(this.createSpaceMenuItem);

    // Wait for the dialog to appear and try multiple selectors for the name field
    const nameFieldSelectors = [
      'input[name="name"]',
      'input[placeholder*="name"]',
      'input[aria-label*="name"]',
      '[data-testid*="space-name"]',
      'input[type="text"]',
    ];

    let nameField = null;
    for (const selector of nameFieldSelectors) {
      try {
        nameField = $(selector);
        await nameField.waitForDisplayed({ timeout: 5000 });
        console.log(`✅ Found name field using selector: ${selector}`);
        break;
      } catch (error) {
        console.log(`❌ Failed to find name field using selector: ${selector}`);
        continue;
      }
    }

    if (!nameField) {
      throw new Error("Could not find space name field with any selector");
    }

    await nameField.setValue(name);

    // Click "Customize space key" to reveal the space key input field
    console.log('Clicking "Customize space key" button...');
    await this.click(this.customizeSpaceKeyButton);

    // Wait for the space key field to appear and set the custom key
    console.log(`Setting custom space key: ${key}`);
    const spaceKeySelectors = [
      'textbox[aria-label*="Space key"]',
      'input[aria-label*="Space key"]',
      'input[name="key"]',
      'input[placeholder*="key"]',
    ];

    let spaceKeyField = null;
    for (const selector of spaceKeySelectors) {
      try {
        spaceKeyField = $(selector);
        await spaceKeyField.waitForDisplayed({ timeout: 5000 });
        console.log(`✅ Found space key field using selector: ${selector}`);
        break;
      } catch (error) {
        console.log(
          `❌ Failed to find space key field using selector: ${selector}`
        );
        continue;
      }
    }

    if (!spaceKeyField) {
      throw new Error("Could not find space key field with any selector");
    }

    await spaceKeyField.setValue(key);

    const nextButton = await $("button=Next");
    await nextButton.waitForClickable({ timeout: 10000 });
    await nextButton.click();

    await this.click($("button=Create space"));

    // Wait for space to be created and navigation to complete
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes("/spaces/") && url.includes("/overview");
      },
      {
        timeout: 30000,
        timeoutMsg:
          "Expected space to be created and navigated to overview page",
      }
    );
  }

  public async createPage() {
    // Try clicking "Add your first page" link first, otherwise use Create button
    const addFirstPageLink = $("link=Add your first page");
    if (await addFirstPageLink.isExisting()) {
      await addFirstPageLink.click();
    } else {
      await this.click(this.createButton);
      await this.click(this.createPageButton);
    }

    return new Pages();
  }

  public async delete(key: string) {
    // TODO: Implement cleanup via API in hooks
  }
}

// singleton export
export const Space = new SpacePage();
