import { $ } from "@wdio/globals";
import Page from "./page";

class LoginPage extends Page {
  get emailInput() {
    return $('[name="username"]');
  }
  get continueBtn() {
    return $("#login-submit");
  }
  get passwordInput() {
    return $("#password");
  }

  public async login(email: string, password: string) {
    await this.emailInput.setValue(email);
    await this.continueBtn.click();

    await this.passwordInput.waitForDisplayed();
    await this.passwordInput.setValue(password);
    await this.continueBtn.click();

    await expect($("body")).toHaveText(/Your apps/);
  }

  public open() {
    return super.open("https://id.atlassian.com/login");
  }
}

export default new LoginPage();
