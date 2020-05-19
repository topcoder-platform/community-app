import { BrowserHelper } from "topcoder-testing-lib";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper";

describe("Topcoder Login Page Tests: ", () => {
  /**
   * Sets up browser login page
   */
  beforeEach(async () => {
    await BrowserHelper.initialize();
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
    await LoginPageHelper.verifyLogin(username, password);
  });

  /**
   * Verifies User cannot login using invalid username
   */
  it("should Verify User cannot login using invalid username", async () => {
    const invalidUsername = testData.login.invalidUsername;
    const password = ConfigHelper.getPassword();
    await LoginPageHelper.verifyLoginWithInvalidUserName(
      invalidUsername,
      password
    );
  });

  /**
   * Verifies User cannot login using invalid password
   */
  it("should Verify User cannot login using invalid password", async () => {
    const username = ConfigHelper.getUserName();
    const inavlidPassword = testData.login.invalidPassword;
    await LoginPageHelper.verifyLoginWithInvalidPassword(
      username,
      inavlidPassword
    );
  });

  /**
   * Verifies User can logout
   */
  it("should Verify User can logout", async () => {
    await LoginPageHelper.verifyLogout();
  });
});
