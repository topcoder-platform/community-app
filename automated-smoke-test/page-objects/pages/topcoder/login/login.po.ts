import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../../../config/app-config.json';
import { logger } from '../../../../logger/logger';
import { ConfigHelper } from '../../../../utils/config-helper';
import { HomePage } from '../home-page/home.po.js';
import { SplashPage } from '../splash/splash.po';
import { CommonHelper } from '../common-page/common.helper';
import { StartPage } from '../start/start.po';

export class LoginPage {
  /**
   * Get login page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getRedirectLoginUrl());
    logger.info('User navigated to Topcoder Login Page');
  }

  /**
   * Get login form
   */
  public get loginForm() {
    return ElementHelper.getElementByClassName('auth0-lock-widget');
  }

  /**
   * Get Username field
   */
  public get userNameField() {
    return ElementHelper.getElementByName('username');
  }

  /**
   * Get Password field
   */
  public get passwordField() {
    return ElementHelper.getElementByName('password');
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
    return ElementHelper.getElementByCss('.auth0-global-message.auth0-global-message-error .animated.fadeInUp span');
  }

  /**
   * Logout the user
   */
  public async logout() {
    await BrowserHelper.open(ConfigHelper.getLogoutUrl());
    logger.info('user logged out');
  }

  /**
   * Wait for the login form to be displayed
   */
  public async waitForLoginForm() {
    // Wait until login form appear
    await BrowserHelper.sleep(8000);
    CommonHelper.waitUntilVisibilityOf(
      () => this.loginForm,
      'Wait for login form',
      true
    );
    logger.info('Login Form Displayed');
  }

  /**
   * Fill and submit the login form
   */
  public async fillLoginForm(username, password) {
    await CommonHelper.waitUntilPresenceOf(
      () => this.userNameField,
      'wait for username field',
      false
    );
    await this.userNameField.sendKeys(username);
    await this.passwordField.sendKeys(password);
    logger.info(
      'Login form filled with values: username - ' +
        username +
        ', password - ' +
        password
    );
    await BrowserHelper.waitUntilClickableOf(
      this.loginButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
    await this.loginButton.click();
    logger.info('Submitted login form');
  }

  /**
   * Wait for home page to be displayed
   */
  public async waitForHomePage() {
    const homepage = new HomePage();
    await CommonHelper.waitUntilVisibilityOf(
      () => homepage.container,
      'Wait for home page',
      true
    );
    return homepage;
  }

  /**
   * Wait for start page to be displayed
   */
  public async waitForStartPage() {
    const startPage = new StartPage();
    await CommonHelper.waitUntilVisibilityOf(
      () => startPage.container,
      'Wait for home page',
      true
    );
    return startPage;
  }

  /**
   * Wait for home page to be displayed
   */
  public async waitForSplashPage() {
    const splashpage = new SplashPage();
    await CommonHelper.waitUntilVisibilityOf(
      () => splashpage.container,
      'Wait for splash page',
      true
    );
    return splashpage;
  }

  /**
   * Wait for error message to be displayed
   */
  public async waitForErrorMessage() {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.errorMessage,
      'Wait for error message',
      false
    );
  }
}
