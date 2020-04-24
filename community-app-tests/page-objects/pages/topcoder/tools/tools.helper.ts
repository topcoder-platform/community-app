import { ElementHelper } from "topcoder-testing-lib";
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
   * Opens the tools page in the browser
   */
  public static async open() {
    await this.toolsPageObject.open();
  }

  /**
   * Switches tab to given tab name
   * @param {String} tabName
   */
  public static async switchTab(tabName: string) {
    await this.toolsPageObject.switchTab(tabName);
  }

  /**
   * deletes all entries in the current tab
   */
  public static async deleteAll() {
    await this.toolsPageObject.deleteAll();
  }

  /**
   * verifyies that user can add subscription
   */
  public static async verifyAddSubscription(name) {
    await this.toolsPageObject.addSubscription(name);
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("subcription added: " + name);
  }

  /**
   * verifyies that user can edit subscription
   */
  public static async verifyEditSubscription(name, newName) {
    await this.toolsPageObject.editSubscription(name, newName);
    const el = await ElementHelper.getTagElementContainingText("div", newName);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("subcription edited from: " + name + " to " + newName);
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

  private static toolsPageObject: ToolsPage;
}
