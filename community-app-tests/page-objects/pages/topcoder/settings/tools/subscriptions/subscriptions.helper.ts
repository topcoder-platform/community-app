import { ElementHelper } from "topcoder-testing-lib";
import { logger } from "../../../../../../logger/logger";
import { SubscriptionsPage } from "./subscriptions.po";

export class SubscriptionsPageHelper {
  /**
   * gets the Tools page object
   */
  public static setSubscriptionsPage(subscriptionsPage) {
    this.subscriptionsPageObject = subscriptionsPage;
  }

  /**
   * Opens the tools page in the browser
   */
  public static async open() {
    this.subscriptionsPageObject = new SubscriptionsPage();
    await this.subscriptionsPageObject.open();
  }

  /**
   * deletes all entries in the current tab
   */
  public static async deleteAll() {
    await this.subscriptionsPageObject.deleteAll();
  }

  /**
   * verifies that user can add subscription
   */
  public static async verifyAddSubscription(name) {
    await this.subscriptionsPageObject.addSubscription(name);
    await this.subscriptionsPageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("subscription added: " + name);
  }

  /**
   * verifies that user can edit subscription
   */
  public static async verifyEditSubscription(name, newName) {
    await this.subscriptionsPageObject.editSubscription(name, newName);
    await this.subscriptionsPageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", newName);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("subscription edited from: " + name + " to " + newName);
  }

  /**
   * verifies that user can delete subscription
   */
  public static async verifyDeleteSubscription(name) {
    await this.subscriptionsPageObject.deleteSubscription(name);
    await this.subscriptionsPageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(false);
    logger.info("deleted subscription: " + name);
  }

  private static subscriptionsPageObject: SubscriptionsPage;
}
