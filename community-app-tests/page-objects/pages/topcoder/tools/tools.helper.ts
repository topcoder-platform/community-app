import { ElementHelper } from "topcoder-ui-testing-lib";
import { logger } from "../../../../logger/logger";
import { ToolsPage } from "./tools.po.js";

export class ToolsPageHelper {
  /**
   * gets the Tools page object
   */
  public static setToolsPage(toolspage) {
    this.toolsPageObject = toolspage;
  }

  /**
   * verifyies that user can add subscription
   */
  public static async verifyAddSubscription(name) {
    await this.toolsPageObject.addSubscription(name);
    expect(
      await ElementHelper.getTagElementContainingText("div", name).isDisplayed()
    ).toBe(true);
    logger.info("subcription added: " + name);
  }

  /**
   * verifyies that user can edit subscription
   */
  public static async verifyEditSubscription(name, newname) {
    await this.toolsPageObject.editSubscription(name, newname);
    expect(
      await ElementHelper.getTagElementContainingText(
        "div",
        newname
      ).isDisplayed()
    ).toBe(true);
    logger.info("subcription edited from: " + name + " to " + newname);
  }

  /**
   * verifyies that user can delete subscription
   */
  public static async verifyDeleteSubscription(name) {
    await this.toolsPageObject.deleteSubscription(name);
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(false);
    logger.info("deleted subcription: " + name);
  }

  private static toolsPageObject;
}
