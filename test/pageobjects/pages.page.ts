import Page from "./page";

export default class PagesPage extends Page {
  get pageTitle() {
    return $(
      'textarea[name="editpages-title"][placeholder="Give this page a title"]'
    );
  }

  get pageText() {
    return $("p*=Type / to insert elements");
  }

  get plantUmlMacro() {
    return $("button*=PlantUML Diagrams for Confluence");
  }

  get publishButton() {
    return $("button*=Publish...");
  }

  get confirmPublish() {
    return $("button*=Publish");
  }

  get editPageButton() {
    return $('a[id="editPageLink"]');
  }

  async setTitle(title: string) {
    await this.pageTitle.waitForExist({ timeout: 20000 });
    await this.pageTitle.setValue(title);
  }

  async createMacro() {
    await this.pageText.click();

    await browser.keys(["/", "p", "l", "a", "n", "t"]);

    await this.click(this.plantUmlMacro);
  }

  async confirmPublishedPage() {
    const alert = await $("div*=was successfully published");
    await alert.waitForExist({ timeout: 20000, interval: 100 });
    await alert.waitForDisplayed();
  }

  public async publish(title: string) {
    await this.setTitle(title);

    await this.click(this.publishButton);

    await this.confirmPublish.waitForExist();
    await browser.execute(() => {
      const btn = document.querySelector('button[id="publish-button"]');
      if (!btn) throw new Error("Publish button not found");
      (btn as HTMLElement).click();
    });

    await this.confirmPublishedPage();
  }

  public async openInEditMode() {
    await this.click(this.editPageButton);
  }
}
