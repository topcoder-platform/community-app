import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../../../logger/logger';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { SettingsPage } from '../../settings.po';
import { SettingsPageConstants } from '../../settings.constants';
import { CommonHelper } from '../../../common-page/common.helper';

export class LinkedAccountPage extends SettingsPage {
  /**
   * Gets the LinkedAccounts page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getAccountUrl());
    await this.switchTab('linked accounts');
    logger.info('User navigated to Linked Account Page');
  }

  /**
   * Gets the external link input field
   */
  private async getExternalLinkInput() {
    const els = await ElementHelper.getAllElementsByCss(
      'input[placeholder="http://www.yourlink.com"'
    );
    return els[1];
  }

  /**
   * Gets the external link add button
   */
  private get externalLinkAddButton() {
    return ElementHelper.getElementByClassName('button-add-link');
  }

  /**
   * Gets the external link delete icon
   */
  private get deleteLink() {
    return ElementHelper.getElementByXPath(
      "//div[@role = 'link']//div[1]//div"
    );
  }

  /**
   * Gets the external link deletion message
   */
  private get externalLinkDeletionMsg() {
    return CommonHelper.findElementByText('div', 'was removed.');
  }

  /**
   * Gets the success message
   */
  public get successMsg() {
    return CommonHelper.findElementByText(
      'div',
      SettingsPageConstants.Messages.LinkSuccessMessage
    );
  }

  /**
   * Delete link
   */
  public async delete() {
    await this.deleteLink.click();
    await CommonHelper.waitUntilVisibilityOf(
      () => this.deleteConfirmation,
      'Wait for delete comfirmation',
      false
    );
    await this.deleteConfirmation.click();

    await CommonHelper.waitUntilVisibilityOf(
      () => this.externalLinkDeletionMsg,
      'Wait for external link deletion message',
      false
    );
    await CommonHelper.waitUntilInVisibilityOf(
      () => this.externalLinkDeletionMsg,
      'Wait for external link deletion message',
      false
    );
  }

  /**
   * Delete all links
   */
  public async deleteAll() {
    const deleteLinks = await ElementHelper.getAllElementsByCss(
      "div[role='link']"
    );
    for (let i = 0; i < deleteLinks.length; i++) {
      await this.delete();
    }
  }

  /**
   * Add linked account
   * @param linkedAccount
   */
  public async addLinkedAccount(linkedAccount) {
    const inputField = await this.getExternalLinkInput();
    await inputField.sendKeys(linkedAccount);
    await this.externalLinkAddButton.click();
  }
}
