import { logger } from "../../../../logger/logger";
import { ConfigHelper } from "../../../../utils/config-helper";
import { CommonHelper } from "../common-page/common.helper";
import { HomePage } from "../home-page/home.po";
import { LoginPageConstants } from "./login.constants";
import { LoginPage } from "./login.po";
import { SplashPage } from "../splash/splash.po";

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
    this.loginPageObject = new LoginPage();
    this.loginPageObject.open();
  }

  /**
   * Login
   * @param {String} username
   * @param {String} password
   */
  public static async login(username: string, password: string) {
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(username, password);
    await this.loginPageObject.waitForHomePage();
  }

  /**
   * Logout
   */
  public static async logout() {
    this.loginPageObject.logout();
    await this.loginPageObject.waitForHomePage();
  }

  /**
   * Verify Login
   * @param {String} username
   * @param {String} password
   */
  public static async verifyLogin(username: string, password: string) {
    await CommonHelper.verifyCurrentUrl(ConfigHelper.getLoginUrl());
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(username, password);
    const homePage = await this.loginPageObject.waitForHomePage();
    await this.verifyHomePage(homePage);
  }

  /**
   * Verify Login with invalid username
   * @param {String} invalidUsername
   * @param {String} password
   */
  public static async verifyLoginWithInvalidUserName(
    invalidUsername: string,
    password: string
  ) {
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(invalidUsername, password);
    await this.loginPageObject.waitForErrorMessage();
    expect(await this.loginPageObject.errorMessage.getText()).toEqual(
      LoginPageConstants.errors.MemberNotPresent
    );
    logger.info("Member not found error displayed");
  }

  /**
   * Verify Login with invalid password
   * @param {String} username
   * @param {String} invalidPassword
   */
  public static async verifyLoginWithInvalidPassword(
    username: string,
    invalidPassword: string
  ) {
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(username, invalidPassword);
    await this.loginPageObject.waitForErrorMessage();
    expect(await this.loginPageObject.errorMessage.getText()).toEqual(
      LoginPageConstants.errors.InvalidPassword
    );
    logger.info("Invalid Password error message displayed");
  }

  /**
   * Verify Logout
   */
  public static async verifyLogout() {
    this.loginPageObject.logout();
    const homePage = await this.loginPageObject.waitForHomePage();
    await this.verifyHomePage(homePage);
  }

  /**
   * Verify the current page is the home page
   * @param {HomePage} homePage
   */
  public static async verifyHomePage(homePage: HomePage) {
    CommonHelper.verifyCurrentUrl(ConfigHelper.getHomePageUrl());
    logger.info("User redirected to home-page");
  }

  /**
   * Verify the current page is the splash page
   * @param {SplashPage} splashPage
   */
  public static async verifySplashPage(splashPage: SplashPage) {
    CommonHelper.verifyCurrentUrl(ConfigHelper.getSplashPageUrl());
    logger.info("User redirected to splash-page");
  }

  private static loginPageObject: LoginPage;
}
