import {
  BrowserHelper,
  CommonHelper,
  ElementHelper,
} from "topcoder-testing-lib";
import * as appconfig from "../../../../app-config.json";
import { logger } from "../../../../logger/logger";
import { ConfigHelper } from "../../../../utils/config-helper";
import { ToolsPageConstants } from "./tools.constants";

export class ToolsPage {
  /**
   * Gets the Tools page
   */

  public async open() {
    await BrowserHelper.open(ConfigHelper.getToolsUrl());
    logger.info("User navigated to Tools Page");
  }

  /**
   * Gets the subscription Name textbox
   */

  private get subscriptionName() {
    return ElementHelper.getElementById("name");
  }

  /**
   * Gets the success message
   */

  public get successMsg() {
    return ElementHelper.getTagElementContainingText(
      "div",
      ToolsPageConstants.Messages.SuccessMessage
    );
  }

  /**
   * Gets the delete confirmation button
   */
  private get deleteConfirmation() {
    return ElementHelper.getTagElementContainingText("button", "Yes, Delete");
  }

  /**
   * Gets the delete icon
   */
  private get deleteIcon() {
    return ElementHelper.getElementByCss('img[alt="delete-icon"]');
  }

  /**
   * Switches tab to given tab name
   * @param {String} tabName
   */
  public async switchTab(tabName: string) {
    await CommonHelper.switchTabByClickingOnTagWithText("span", tabName);
    logger.info("tab Switched to " + tabName);
  }

  /**
   * Deletes all records on the tools page
   */
  public async deleteAll() {
    await BrowserHelper.waitUntilVisibilityOf(
      this.subscriptionName,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    const delIcons = await this.getDeleteIcons();
    for (let {} of delIcons) {
      await this.deleteIcon.click();
      await this.deleteConfirmation.click();
      await BrowserHelper.waitUntilVisibilityOf(
        this.successMsg,
        appconfig.Timeout.ElementVisibility,
        appconfig.LoggerErrors.ElementVisibilty
      );
      await BrowserHelper.waitUntilInvisibilityOf(
        this.successMsg,
        appconfig.Timeout.ElementInvisibility,
        appconfig.LoggerErrors.ElementInvisibilty
      );
    }
  }

  /**
   * Adds a subscription with the provided name
   * @param {String} name
   */
  public async addSubscription(name) {
    await this.setSubsription(name);
    await this.getAddButton("subscription").click();
    await BrowserHelper.waitUntilVisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    await BrowserHelper.waitUntilInvisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
  }

  /**
   * Edits the given subscription name with the new provided name
   * @param {String} name
   * @param {String} newname
   * The edit functionality must be upadted to eidt by the provided name. At present it edits the first record
   */
  public async editSubscription(name, newname) {
    await this.getEditIconbyName(name).click();
    await this.setSubsription(newname);
    await this.getEditButton("subscription").click();
    await BrowserHelper.waitUntilVisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    await BrowserHelper.waitUntilInvisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
  }

  /**
   * Deletes the given subscription
   * @param {String} name
   * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
   */
  public async deleteSubscription(name) {
    await this.getDeleteIconbyName(name).click();
    await this.deleteConfirmation.click();
    await BrowserHelper.waitUntilVisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    await BrowserHelper.waitUntilInvisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
  }

  /**
   * Fills the subscription name textbox with given name
   * @param {String} name
   * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
   */
  private async setSubsription(name: string) {
    await this.subscriptionName.clear();
    await this.subscriptionName.sendKeys(name);
  }

  /**
   * Gets all delete icons in the page
   */
  private getDeleteIcons() {
    return ElementHelper.getAllElementsByCss('img[alt="delete-icon"]');
  }

  /**
   * Gets the add button for the given type
   * @param {String} type
   * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
   */
  private getAddButton(type: string) {
    return ElementHelper.getTagElementContainingText(
      "button",
      "Add " + type + " to your list"
    );
  }

  /**
   * Gets the edit button for the given type
   * @param {String} type
   * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
   */
  private getEditButton(type: string) {
    return ElementHelper.getTagElementContainingText(
      "button",
      "Edit " + type + " to your list"
    );
  }

  /**
   * Gets the edit icon for the given name
   * @param {String} name
   */
  private getEditIconbyName(name: string) {
    return ElementHelper.getElementByXPath(
      `//*[text()='${name}']//following::img[@alt='edit-icon']`
    );
  }

  /**
   * Gets the delete icon for the given name
   * @param {String} name
   */
  private getDeleteIconbyName(name: string) {
    return ElementHelper.getElementByXPath(
      `//*[text()='${name}']//following::img[@alt='delete-icon']`
    );
  }
}
