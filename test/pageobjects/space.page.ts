import Page from "./page";
import Pages from "./pages.page";

export default class SpacePage extends Page {
  get nameField() {
    return $('textbox[name="Name this space"], input[name="name"]');
  }
  get keyField() {
    return $('input[name="key"]');
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

    await this.nameField.setValue(name);

    await this.click($("button=Next"));

    await this.click($("button=Create space"));

    await $(`*=${name}`).waitForDisplayed();
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
