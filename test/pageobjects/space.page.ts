import Page from "./page";
import Pages from "./pages.page";

export default class SpacePage extends Page {
  get createSpaceLink() {
    return $('a[data-test-id="create-space-link"]');
  }
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
    return $(
      "/html/body/div[1]/div[2]/div[1]/div[2]/nav/div[1]/div[1]/div/div[1]/div/div[4]/div/div"
    );
  }

  get createSpaceMenuItem() {
    return $("/html/body/div[2]/div[5]/div[1]/div/div/div/div[4]/div[2]/div");
  }

  get createContentButton() {
    return $('button[id="contextual-create-content-button"]');
  }

  get createPageButton() {
    return $(
      "/html/body/div[1]/div[2]/div/div[2]/nav/div[1]/div[1]/div/div[2]/div[5]/div[2]/div/div/div[1]/div/div[2]/div/div[3]/div/div[1]/ul/li[2]"
    );
  }

  /**
   * Create a new space with given name/key
   */
  public async create(name: string, key: string) {
    await this.spacesListGroup.waitForDisplayed();
    await this.spacesListGroup.click();

    await this.createSpaceMenuItem.waitForDisplayed();
    await this.createSpaceMenuItem.waitForClickable();
    await this.createSpaceMenuItem.click();

    await this.nameField.setValue(name);

    const nextBtn = await $("button=Next");
    await nextBtn.waitForClickable();
    await nextBtn.click();

    const createSpaceBtn = await $("button=Create space");
    await createSpaceBtn.waitForClickable();
    await createSpaceBtn.click();

    await $(`*=${name}`).waitForDisplayed();
  }

  public async createPage() {
    await this.createContentButton.click();
    await this.createPageButton.click();
    return new Pages();
  }

  public async delete(key: string) {
    // TODO: Implement cleanup via API in hooks
  }
}

// singleton export
export const Space = new SpacePage();
