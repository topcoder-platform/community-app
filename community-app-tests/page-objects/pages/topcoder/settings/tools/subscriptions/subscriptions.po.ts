import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { logger } from "../../../../../../logger/logger";
import { ConfigHelper } from "../../../../../../utils/config-helper";
import { SettingsPage } from "../../settings.po";

export class SubscriptionsPage extends SettingsPage {
  /**
   * Gets the Tools page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getToolsUrl());
    this.switchTab("subscriptions");
    logger.info("User navigated to Subscriptions Page");
  }

  /**
   * Gets the subscription Name textbox
   */
  private get subscriptionName() {
    return ElementHelper.getElementById("name");
  }

  /**
   * Adds a subscription with the provided name
   * @param {String} name
   */
  public async addSubscription(name) {
    await BrowserHelper.sleep(1000);
    await this.setSubscription(name);
    await this.getAddButton("subscription").click();
  }

  /**
   * Edits the given subscription name with the new provided name
   * @param {String} name
   * @param {String} newname
   */
  public async editSubscription(name, newname) {
    await this.getEditIconbyName(name).click();
    await BrowserHelper.sleep(1000);
    await this.setSubscription(newname);
    await this.getEditButton("subscription").click();
  }

  /**
   * Deletes the given subscription
   * @param {String} name
   */
  public async deleteSubscription(name) {
    await this.getDeleteIconbyName(name).click();
    await this.deleteConfirmation.click();
  }

  /**
   * Fills the subscription name textbox with given name
   * @param {String} name
   */
  private async setSubscription(name: string) {
    await BrowserHelper.waitUntilClickableOf(this.subscriptionName);
    await this.subscriptionName.clear();
    await this.subscriptionName.sendKeys(name);
  }
}
