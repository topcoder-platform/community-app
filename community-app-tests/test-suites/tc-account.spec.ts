import { BrowserHelper } from "topcoder-testing-lib";
import * as testData from "../test-data/test-data.json";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { ConfigHelper } from "../utils/config-helper";
import { MyAccountPageHelper } from "../page-objects/pages/topcoder/settings/account/my-account/my-account.helper";
import { LinkedAccountPageHelper } from "../page-objects/pages/topcoder/settings/account/linked-account/linked-account.helper";

describe("Topcoder Account Page Tests: ", () => {
  /**
   * Sets up the browser and logs in
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    // This line is to bypass https://github.com/topcoder-platform/community-app/issues/4287
    await BrowserHelper.open(ConfigHelper.getHomePageUrl());
    await LoginPageHelper.open();
    await LoginPageHelper.login(
      ConfigHelper.getUserName(),
      ConfigHelper.getPassword()
    );
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    try {
      await LoginPageHelper.logout();
    } catch (e) {
      await BrowserHelper.restart();
    }
  });

  /**
   * Verifies User can update his/her User Consent.
   */
  it("should Verify User can update his/her User Consent", async () => {
    await MyAccountPageHelper.open();
    await MyAccountPageHelper.verifyUserConsent();
  });

  /**
   * Verifies if User can add/delete external link
   */
  it("should Verify User can Add/Delete External Link.", async () => {
    await LinkedAccountPageHelper.open();
    await LinkedAccountPageHelper.deleteAll();
    await LinkedAccountPageHelper.verifyAddLink(testData.linkedAccount);
    await LinkedAccountPageHelper.verifyDeleteLink(testData.linkedAccount);
  });
});
