import Page from "./page";
import Pages from "./pages.page";

export default class SpacePage extends Page {
  get nameField() {
    return $('input[name="name"]');
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
    await this.click(this.createButton);
    await this.click(this.createPageButton);

    return new Pages();
  }

  public async delete(key: string) {
    // TODO: Implement cleanup via API in hooks
  }
}

// singleton export
export const Space = new SpacePage();
