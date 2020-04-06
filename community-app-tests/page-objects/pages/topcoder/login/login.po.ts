import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import * as appconfig from "../../../../app-config.json";
import { logger } from "../../../../logger/logger";
import { ConfigHelper } from "../../../../utils/config-helper";
import { HomePage } from "../home-page/home.po.js";

export class LoginPage {
  /**
   * Get login page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getLoginUrl());
    await logger.info("User navigated to Topcoder Login Page");
  }

  /**
   * Get login form
   */
  public get loginForm() {
    return ElementHelper.getElementByName("vm.loginForm");
  }

  /**
   * Get Username field
   */
  public get userNameField() {
    return ElementHelper.getElementById("username");
  }

  /**
   * Get Password field
   */
  public get passwordField() {
    return ElementHelper.getElementByName("currentPassword");
  }

  /**
   * Get Login button
   */
  public get loginButton() {
    return ElementHelper.getElementByCss("button[type = 'submit']");
  }

  /**
   * Get Error message
   */
  public get errorMessage() {
    return ElementHelper.getElementByClassName("form-error");
  }

  /**
   * Logout the user
   */
  public async logout() {
    await BrowserHelper.setIgnoreSync(true);
    await BrowserHelper.open(ConfigHelper.getLogoutUrl());
    logger.info("user logged out");
  }

  /**
   * Wait for the login form to be displayed
   */
  public async waitForLoginForm() {
    await BrowserHelper.waitUntilVisibilityOf(
      this.loginForm,
      appconfig.Timeout.SubmitForm,
      appconfig.LoggerErrors.PageLoad
    );
    await logger.info("Login Form Displayed");
  }

  /**
   * Fill and submit the login form
   */
  public async fillLoginForm(username, password) {
    await BrowserHelper.waitUntilPresenceOf(
      this.userNameField,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementPresence
    );

    await this.userNameField.sendKeys(username);
    await this.passwordField.sendKeys(password);
    logger.info(
      "Login form filled with values: username - " +
        username +
        ", password - " +
        password
    );
    await BrowserHelper.setIgnoreSync(true);
    await BrowserHelper.waitUntilElementToBeClickable(
      this.loginButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
    await this.loginButton.click();
    logger.info("Submitted login form");
  }

  /**
   * Wait for home page to be displayed
   */
  public async waitForHomePage() {
    const homepage = new HomePage();
    await BrowserHelper.waitUntilVisibilityOf(
      homepage.container,
      appconfig.Timeout.PageLoad,
      appconfig.LoggerErrors.PageLoad
    );
    return homepage;
  }

  /**
   * Wait for error message to be displayed
   */
  public async waitForErrorMessage() {
    await BrowserHelper.waitUntilVisibilityOf(
      this.errorMessage,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
  }
}
