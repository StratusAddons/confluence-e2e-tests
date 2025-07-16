import Page from "./page";

export default class PagesPage extends Page {
  get pageTitle() {
    return $('textarea[data-test-id="editor-title"]');
  }

  public async publish(title: string) {
    await this.pageTitle.waitForExist();
    await this.pageTitle.setValue(title);
  }
}
