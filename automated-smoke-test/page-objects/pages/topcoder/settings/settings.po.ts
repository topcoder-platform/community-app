import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../logger/logger';
import { CommonHelper } from '../common-page/common.helper';
import { SettingsPageConstants } from './settings.constants';
import TcElement from 'topcoder-testing-lib/dist/src/tc-element';

export class SettingsPage {
  /**
   * Gets the page heading
   */

  public get heading() {
    return CommonHelper.findElementByText('h1', 'Settings');
  }

  /**
   * Gets the success message
   */

  public get successMsg() {
    return CommonHelper.findElementByText(
      'div',
      SettingsPageConstants.Messages.SuccessMessage
    );
  }

  /**
   * Gets the delete confirmation button
   */
  public get deleteConfirmation() {
    return CommonHelper.findElementByText('button', 'Yes, Delete');
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
    // wait for showing page + tab name
    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText('span', tabName),
      'Wait for tab ' + tabName,
      true
    );

    await CommonHelper.switchTabByClickingOnTagWithText('span', tabName);
    await BrowserHelper.sleep(3000); // wait 3 second to show the tab
    logger.info('tab Switched to ' + tabName);
  }

  /**
   * Deletes all records on the tools page
   * @param {String} yourItemName
   */
  public async deleteAll(yourItemName: string) {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.heading,
      'Wait for heading',
      false
    );
    await CommonHelper.waitUntilPresenceOf(
      () => CommonHelper.findElementByText('div', yourItemName),
      'wait for ' + yourItemName,
      false
    );
    const delIcons = await this.getDeleteIcons();
    for (let { } of delIcons) {
      await this.deleteIcon.click();
      await this.deleteConfirmation.click();
      await this.waitForDefaultSuccessMessage();
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
    return CommonHelper.findElementByText(
      'button',
      'Add ' + type + ' to your list'
    );
  }

  /**
   * Gets the edit button for the given type
   * @param {String} type
   */
  protected getEditButton(type: string) {
    return CommonHelper.findElementByText(
      'button',
      'Edit ' + type + ' to your list'
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

  /**
   * Perform select suggestion dropdown
   * @param element element field
   * @param getElement get element function, use if have problem with element
   * @param value value to select
   */
  protected async performSelection(
    element: TcElement,
    getElement: () => any,
    value: any
  ) {
    let queryElement = getElement ? await getElement() : element;
    await CommonHelper.waitUntilVisibilityOf(
      () => queryElement,
      'Wait for query element selection',
      false
    );
    queryElement = getElement ? await getElement() : element;
    await queryElement.sendKeys(value);
    await CommonHelper.waitUntilVisibilityOf(
      () => this.selectOption,
      'Wait for select option',
      false
    );
    await this.selectOption.click();
  }

  protected get selectOption() {
    // first option
    return ElementHelper.getElementByClassName('Select-option');
  }

  /**
   * Waits for visibility and invisibility of success message
   */
  public async waitForDefaultSuccessMessage() {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.successMsg,
      'Wait for success message',
      false
    );

    await CommonHelper.waitUntilInVisibilityOf(
      () => this.successMsg,
      'wait for success message',
      false
    );
  }

  public async navigateToPreferences(tabName: string) {
    // wait for showing page + tab name
    await CommonHelper.waitUntilVisibilityOf(
      () => ElementHelper.getElementByXPath(`//span[contains(., "GO TO ${tabName}")]`),
      'Wait for tab ' + tabName,
      true
    );
    await ElementHelper.getElementByXPath(`//span[contains(., "GO TO ${tabName}")]`).click()
  }
}
