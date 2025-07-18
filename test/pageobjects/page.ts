export default abstract class Page {
  /**
   * Open a sub-path relative to baseUrl
   * @param path e.g. '/login' or '/wiki/home'
   */
  public async open(path: string): Promise<void> {
    await browser.url(path);
  }

  /**
   * Returns the current URL
   */
  public async getCurrentUrl(): Promise<string> {
    return await browser.getUrl();
  }

  /**
   * Pause for a given time (ms)
   * Useful for debug; remove in production tests
   */
  public async pause(ms: number): Promise<void> {
    await browser.pause(ms);
  }

  public async click(element: ChainablePromiseElement): Promise<void> {
    const el = await element;
    await el.waitForExist({ timeout: 20000 });
    await el.click();
  }
}
