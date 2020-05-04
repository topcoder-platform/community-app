import { BrowserHelper } from "topcoder-testing-lib";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper";
import { SubscriptionsPageHelper } from "../page-objects/pages/topcoder/settings/tools/subscriptions/subscriptions.helper";

describe("Topcoder Tools Page Tests: ", () => {
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
   * Verifies Add/Update/Delete Subscriptions functionalty
   */
  it("should Verify User can Add/Update/Delete Subscriptions", async () => {
    await SubscriptionsPageHelper.open();
    await SubscriptionsPageHelper.deleteAll();
    await SubscriptionsPageHelper.verifyAddSubscription(
      testData.tools.subscription
    );
    await SubscriptionsPageHelper.verifyEditSubscription(
      testData.tools.subscription,
      testData.tools.newSubscription
    );
    await SubscriptionsPageHelper.verifyDeleteSubscription(
      testData.tools.newSubscription
    );
  });
});
