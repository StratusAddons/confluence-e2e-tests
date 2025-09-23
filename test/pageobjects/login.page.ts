import { $ } from "@wdio/globals";
import Page from "./page";
import { TOTPGenerator } from "../utils/totp";

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

  get totpInput() {
    return $('input:not([name="username"]):not([id="password"])');
  }

  get submitBtn() {
    return $(
      'button[type="submit"], [data-testid="login-submit-idf-testid"], #login-submit'
    );
  }

  public async login(email: string, password: string) {
    await this.emailInput.setValue(email);
    await this.continueBtn.click();

    await this.passwordInput.waitForDisplayed();
    await this.passwordInput.setValue(password);
    await this.continueBtn.click();

    // Handle TOTP if required
    await this.handleTOTP();

    await expect($("body")).toHaveText(/Your apps/);
  }

  private async handleTOTP() {
    try {
      await this.totpInput.waitForDisplayed({ timeout: 5000 });
      const totpCode = TOTPGenerator.generateCode();
      await this.totpInput.setValue(totpCode);
      await this.submitBtn.click();
      console.log("TOTP authentication completed");
    } catch (error) {
      const bodyText = await $("body").getText();
      if (
        bodyText.includes("verification code") ||
        bodyText.includes("two-step")
      ) {
        throw new Error("TOTP required but authentication failed");
      }
    }
  }

  public open() {
    return super.open("https://id.atlassian.com/login");
  }
}

export default new LoginPage();
