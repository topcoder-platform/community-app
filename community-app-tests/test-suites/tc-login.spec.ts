import { browser } from "protractor";
import { LoginPage, LoginPageHelper } from "topcoder-ui-testing-lib";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper.js";

describe("Topcoder Login Page Tests: ", () => {
  /**
   * Sets up browser login page
   */
  beforeEach(async () => {
    browser.driver
      .manage()
      .window()
      .maximize();
    browser.ignoreSynchronization = false;
    const loginpage = new LoginPage();
    await loginpage.setUrls({
      homePageUrl: ConfigHelper.getHomePageURL(),
      loginUrl: ConfigHelper.getLoginURL(),
      logoutUrl: ConfigHelper.getLogoutURL()
    });
    await loginpage.get();
    LoginPageHelper.setLoginPage(loginpage);
  });

  /**
   * Restarts browser
   */
  afterEach(() => {
    browser.restart();
  });

  /**
   * Verifies User can login using valid credentials
   */
  it("should Verify User can login using valid credentials", async () => {
    const username = ConfigHelper.getUserName();
    const password = ConfigHelper.getPassword();
    await LoginPageHelper.login(username, password);
  });

  /**
   * Verifies User cannot login using invalid username
   */
  it("should Verify User cannot login using invalid username", async () => {
    const invalidUsername = testData.login.invalidUsername;
    const password = ConfigHelper.getPassword();
    await LoginPageHelper.loginWithInvalidUserName(invalidUsername, password);
  });

  /**
   * Verifies User cannot login using invalid password
   */
  it("should Verify User cannot login using invalid password", async () => {
    const username = ConfigHelper.getUserName();
    const inavlidPassword = testData.login.invalidPassword;
    await LoginPageHelper.loginWithInvalidPassword(username, inavlidPassword);
  });

  /**
   * Verifies User ccan logout
   */
  it("should Verify User can logout", async () => {
    await LoginPageHelper.logout();
  });
});
