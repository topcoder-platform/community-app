import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import * as appconfig from "../../../../app-config.json";
import { logger } from "../../../../logger/logger";
import { CommonHelper } from "../common-page/common.helper";
import { SettingsPageConstants } from "./settings.constants";

export class SettingsPage {
  /**
   * Gets the page heading
   */

  public get heading() {
    return ElementHelper.getTagElementContainingText("h1", "Settings");
  }

  /**
   * Gets the success message
   */

  public get successMsg() {
    return ElementHelper.getTagElementContainingText(
      "div",
      SettingsPageConstants.Messages.SuccessMessage
    );
  }

  /**
   * Gets the delete confirmation button
   */
  public get deleteConfirmation() {
    return ElementHelper.getTagElementContainingText("button", "Yes, Delete");
  }

  /**
   * Gets the delete icon
   */
  protected get deleteIcon() {
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
      this.heading,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    const delIcons = await this.getDeleteIcons();
    for (let {} of delIcons) {
      await this.deleteIcon.click();
      await this.deleteConfirmation.click();
      await this.waitForSuccessMsg();
    }
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
   */
  protected getAddButton(type: string) {
    return ElementHelper.getTagElementContainingText(
      "button",
      "Add " + type + " to your list"
    );
  }

  /**
   * Gets the edit button for the given type
   * @param {String} type
   */
  protected getEditButton(type: string) {
    return ElementHelper.getTagElementContainingText(
      "button",
      "Edit " + type + " to your list"
    );
  }

  /**
   * Gets the edit icon for the given name
   * @param {String} name
   */
  protected getEditIconbyName(name: string) {
    return ElementHelper.getElementByXPath(
      `//*[text()='${name}']//following::img[@alt='edit-icon']`
    );
  }

  /**
   * Gets the delete icon for the given name
   * @param {String} name
   */
  protected getDeleteIconbyName(name: string) {
    return ElementHelper.getElementByXPath(
      `//*[text()='${name}']//following::img[@alt='delete-icon']`
    );
  }

  protected async performSelection(element, value) {
    await BrowserHelper.sleep(1000);
    await element.sendKeys(value);
    await BrowserHelper.waitUntilVisibilityOf(this.selectOption);
    const selectOptions = await this.selectOptions();
    await selectOptions[0].click();
    await BrowserHelper.sleep(1000);
  }

  protected get selectOption() {
    return ElementHelper.getElementByClassName("Select-option");
  }

  protected async selectOptions() {
    return ElementHelper.getAllElementsByClassName("Select-option");
  }

  /**
   * Waits for visibility and invisibility of success message
   */
  public async waitForSuccessMsg(message = this.successMsg) {
    await BrowserHelper.waitUntilVisibilityOf(
      message,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );

    await BrowserHelper.waitUntilInVisibilityOf(
      message,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
  }
}
