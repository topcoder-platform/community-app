import { browser } from "protractor";
import { LoginPage, LoginPageHelper } from "topcoder-ui-testing-lib";
import { ToolsPageHelper } from "../page-objects/pages/topcoder/tools/tools.helper";
import { ToolsPage } from "../page-objects/pages/topcoder/tools/tools.po";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper";

describe("Topcoder Tools Page Tests: ", () => {
  /**
   * Sets up the browser and logs in
   */
  beforeAll(async () => {
    await browser.restart();
    await browser.driver
      .manage()
      .window()
      .maximize();
    const loginpage = new LoginPage();
    await loginpage.setUrls({
      homePageUrl: ConfigHelper.getHomePageURL(),
      loginUrl: ConfigHelper.getLoginURL(),
      logoutUrl: ConfigHelper.getLogoutURL()
    });
    await loginpage.get();
    LoginPageHelper.setLoginPage(loginpage);
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
      await browser.restart();
    }
  });

  /**
   * Verifies Add/Update/Delete Subscriptions functionalty
   */
  it("should Verify User can Add/Update/Delete Subscriptions", async () => {
    const toolsPage = new ToolsPage();
    await toolsPage.get();
    await toolsPage.switchTab("subscriptions");
    await toolsPage.deleteAll();
    ToolsPageHelper.setToolsPage(toolsPage);
    await ToolsPageHelper.verifyAddSubscription(testData.tools.subscription);
    await ToolsPageHelper.verifyEditSubscription(
      testData.tools.subscription,
      testData.tools.newSubscription
    );
    await ToolsPageHelper.verifyDeleteSubscription(
      testData.tools.newSubscription
    );
  });
});
