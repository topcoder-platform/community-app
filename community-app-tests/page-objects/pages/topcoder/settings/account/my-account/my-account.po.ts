import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { logger } from "../../../../../../logger/logger";
import { ConfigHelper } from "../../../../../../utils/config-helper";
import { SettingsPage } from "../../settings.po";

export class MyAccountPage extends SettingsPage {
  /**
   * Gets the MyAccounts page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getAccountUrl());
    await BrowserHelper.sleep(1000);
    logger.info("User navigated to My Account Page");
  }

  /**
   * Get the consent label element
   */
  public get consentLabel() {
    return ElementHelper.getElementByCss('label[for="pre-onoffswitch-user-consent"]');
  }

  /**
   * Helper method which tells if the consent is already checked
   */
  public async isConsentGiven() {
    const backgroundColor = await this.consentLabel.getCssValue('background-color');
    return this.getStatus(backgroundColor);
  }

  /**
   * Toggle the consent by clicking the label
   */
  public async toggleConsent() {
    await this.consentLabel.click();
  }

  /**
   * Helper method to get status basis the background color
   * @param color 
   */
  private getStatus(color: string) {
    return color == 'rgba(192, 192, 192, 1)' ? false : true;
  }
}
