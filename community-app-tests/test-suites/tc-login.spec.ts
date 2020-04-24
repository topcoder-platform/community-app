import { BrowserHelper } from "topcoder-testing-lib";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { LoginPage } from "../page-objects/pages/topcoder/login/login.po";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper";

describe("Topcoder Login Page Tests: ", () => {
  /**
   * Sets up browser login page
   */
  beforeEach(async () => {
    await BrowserHelper.initialize();
    // This line is to bypass https://github.com/topcoder-platform/community-app/issues/4287
    await BrowserHelper.open(ConfigHelper.getHomePageUrl());
    const loginpage = new LoginPage();
    LoginPageHelper.setLoginPage(loginpage);
    await LoginPageHelper.open();
  });

  /**
   * Restarts browser
   */
  afterEach(async () => {
    await BrowserHelper.restart();
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
