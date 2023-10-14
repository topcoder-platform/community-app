import { logger } from '../../../../../../logger/logger';
import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { SettingsPage } from '../../settings.po';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { SettingsPageConstants } from '../../settings.constants';
import { CommonHelper } from '../../../common-page/common.helper';

export class EmailPreferencesPage extends SettingsPage {
  /**
   * Gets the Community page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getPreferencesUrl());
    await this.switchTab('e-mail');
    logger.info('User navigated to Preferences Page');
  }

  /**
   * Gets the preference  label
   * @param pref
   */
  private getPrefLabel(pref: String) {
    return ElementHelper.getElementByXPath(
      `//label[@for='pre-onoffswitch-${pref}']`
    );
  }

  /**
   * Gets the preference switch used for toggling
   */
  private async getPrefSwitch(pref) {
    const el = await ElementHelper.getElementByXPath(
      `//label[@for='pre-onoffswitch-${pref}']//child::span[@class='onoffswitch-switch']`
    );
    return el;
  }

  /**
   * Returns whether a given pref is enabled or not
   * @param pref
   */
  public async isPrefEnabled(pref): Promise<boolean> {
    const prefLabel = this.getPrefLabel(pref);
    const bgColor = await prefLabel.getCssValue('background-color');
    return bgColor === SettingsPageConstants.Colors.GreyColor ? false : true;
  }

  /**
   * Updates a pref if enabled from config
   * @param pref
   */
  public async updatePref(pref: string) {
    const prefSwitch = await this.getPrefSwitch(pref);
    await prefSwitch.click();
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
  /**
   * Gets the pref success message
   */
  public get successMsg() {
    return CommonHelper.findElementByText(
      'div',
      SettingsPageConstants.Messages.EmailPrefSuccessMessage
    );
  }
}
