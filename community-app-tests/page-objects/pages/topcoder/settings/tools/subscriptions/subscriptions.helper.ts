import { ElementHelper, BrowserHelper } from "topcoder-testing-lib";
import * as appconfig from "../../../../../../app-config.json";
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
   * verifyies that user can add subscription
   */
  public static async verifyAddSubscription(name) {
    await this.subscriptionsPageObject.addSubscription(name);
    await BrowserHelper.waitUnitilVisibilityOf(
      this.subscriptionsPageObject.successMsg,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    await BrowserHelper.waitUnitilInVisibilityOf(
      this.subscriptionsPageObject.successMsg,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("subcription added: " + name);
  }

  /**
   * verifyies that user can edit subscription
   */
  public static async verifyEditSubscription(name, newName) {
    await this.subscriptionsPageObject.editSubscription(name, newName);
    await BrowserHelper.waitUnitilVisibilityOf(
      this.subscriptionsPageObject.successMsg,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    await BrowserHelper.waitUnitilInVisibilityOf(
      this.subscriptionsPageObject.successMsg,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
    const el = await ElementHelper.getTagElementContainingText("div", newName);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("subcription edited from: " + name + " to " + newName);
  }

  /**
   * verifyies that user can delete subscription
   */
  public static async verifyDeleteSubscription(name) {
    await this.subscriptionsPageObject.deleteSubscription(name);
    await BrowserHelper.waitUnitilVisibilityOf(
      this.subscriptionsPageObject.successMsg,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    await BrowserHelper.waitUnitilInVisibilityOf(
      this.subscriptionsPageObject.successMsg,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(false);
    logger.info("deleted subcription: " + name);
  }

  private static subscriptionsPageObject: SubscriptionsPage;
}
