import { logger } from '../../../../../../logger/logger';
import { MyAccountPage } from './my-account.po';
import { ElementHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../../../common-page/common.helper';

export class MyAccountPageHelper {
  /**
   * Opens the my account page in the browser
   */
  public static async open() {
    this.myAccountPageObject = new MyAccountPage();
    await this.myAccountPageObject.open();
  }

  /**
   * Verifies user consent by first toggling the consent and
   * then re-toggling the consent to ensure consistent
   * behaviour everytime
   * In case of any alert, it dismisses the error message
   */
  public static async verifyUserConsent() {
    await CommonHelper.waitUntilPresenceOf(
      () => this.myAccountPageObject.consentLabel,
      'wait for consent label',
      true
    );
    await this.myAccountPageObject.consentLabel.click();
    await this.myAccountPageObject.waitForDefaultSuccessMessage();
    try {
      const errorPopup = CommonHelper.findElementByText(
        'p',
        'Failed to add user trait'
      );
      const isDisplayed = await CommonHelper.isPresent(errorPopup);
      if (isDisplayed) {
        logger.info('Error popup was shown, dismissing it');
        await ElementHelper.getElementByButtonText('OK').click();
      }
    } catch (ex) {}
    const consentStatus = await this.myAccountPageObject.isConsentGiven();
    await this.myAccountPageObject.toggleConsent();
    await this.myAccountPageObject.waitForDefaultSuccessMessage();
    const expectedConsentStatus = !consentStatus;
    const actualConsentStatus = await this.myAccountPageObject.isConsentGiven();
    expect(actualConsentStatus).toBe(expectedConsentStatus);
    logger.info(
      `consent toggled from ${consentStatus} to ${expectedConsentStatus}`
    );
  }
  private static myAccountPageObject: MyAccountPage;
}
