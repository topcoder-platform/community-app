import { BrowserHelper } from "topcoder-testing-lib";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { LoginPage } from "../page-objects/pages/topcoder/login/login.po";
import { ToolsPageHelper } from "../page-objects/pages/topcoder/tools/tools.helper";
import { ToolsPage } from "../page-objects/pages/topcoder/tools/tools.po";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper";

describe("Topcoder Tools Page Tests: ", () => {
  /**
   * Sets up the browser and logs in
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    const loginpage = new LoginPage();
    LoginPageHelper.setLoginPage(loginpage);
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
    const toolsPage = new ToolsPage();
    ToolsPageHelper.setToolsPage(toolsPage);
    await ToolsPageHelper.open();
    await ToolsPageHelper.switchTab("subscriptions");
    await ToolsPageHelper.deleteAll();
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
