import {
  AssertionsHelper,
  BrowserHelper,
  CommonHelper,
} from "topcoder-testing-lib";
import * as appconfig from "../../../../app-config.json";
import { logger } from "../../../../logger/logger";
import { ConfigHelper } from "../../../../utils/config-helper";
import { HomePage } from "../home-page/home.po";
import { LoginPageConstants } from "./login.constants";
import { LoginPage } from "./login.po";

export class LoginPageHelper {
  /**
   * Set the page object
   * @param {LoginPage} loginPage
   */
  public static setLoginPage(loginPage) {
    this.loginPageObject = loginPage;
  }

  /**
   * Open page
   */
  public static open() {
    this.loginPageObject.open();
  }

  /**
   * Login
   * @param {String} username
   * @param {String} password
   */
  public static async login(username: string, password: string) {
    await CommonHelper.verifyCurrentUrl(ConfigHelper.getLoginUrl());
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(username, password);
    const homePage = await this.loginPageObject.waitForHomePage();
    await this.verifyHomePage(homePage);
  }

  /**
   * Login with invalid username
   * @param {String} invalidUsername
   * @param {String} password
   */
  public static async loginWithInvalidUserName(
    invalidUsername: string,
    password: string
  ) {
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(invalidUsername, password);
    await this.loginPageObject.waitForErrorMessage();
    AssertionsHelper.expectToBeEqual(
      await this.loginPageObject.errorMessage.getText(),
      LoginPageConstants.errors.MemberNotPresent
    );
    logger.info("Member not found error displayed");
  }

  /**
   * Login with invalid password
   * @param {String} username
   * @param {String} invalidPassword
   */
  public static async loginWithInvalidPassword(
    username: string,
    invalidPassword: string
  ) {
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(username, invalidPassword);
    await this.loginPageObject.waitForErrorMessage();
    AssertionsHelper.expectToBeEqual(
      await this.loginPageObject.errorMessage.getText(),
      LoginPageConstants.errors.InvalidPassword
    );
    logger.info("Invalid Password error message displayed");
  }

  /**
   * Logout
   */
  public static async logout() {
    this.loginPageObject.logout();
    const homePage = await this.loginPageObject.waitForHomePage();
    await this.verifyHomePage(homePage);
  }

  /**
   * Verify the current page is the home page
   * @param {HomePage} homePage
   */
  public static async verifyHomePage(homePage: HomePage) {
    await BrowserHelper.waitUntilVisibilityOf(
      homePage.container,
      appconfig.Timeout.PageLoad,
      appconfig.LoggerErrors.PageLoad
    );
    CommonHelper.verifyCurrentUrl(ConfigHelper.getHomePageUrl());
    logger.info("User redirected to home-page");
  }

  private static loginPageObject;
}
