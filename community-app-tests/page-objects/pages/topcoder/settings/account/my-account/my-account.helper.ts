import { logger } from "../../../../../../logger/logger";
import { MyAccountPage } from "./my-account.po";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";

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
    await BrowserHelper.waitUntilPresenceOf(
      this.myAccountPageObject.consentLabel
    );
    await this.myAccountPageObject.consentLabel.click();
    await this.myAccountPageObject.waitForSuccessMsg();
    try {
      const errorPopup = ElementHelper.getTagElementContainingText(
        "p",
        "Failed to add user trait"
      );
      const isDisplayed = await errorPopup.isDisplayed();
      if (isDisplayed) {
        logger.info("Error popup was shown, dismissing it");
        const okButton = await ElementHelper.getElementByButtonText("OK");
        await okButton.click();
      }
    } catch (ex) {}
    const consentStatus = await this.myAccountPageObject.isConsentGiven();
    await this.myAccountPageObject.toggleConsent();
    await this.myAccountPageObject.waitForSuccessMsg();
    const expectedConsentStatus = !consentStatus;
    const actualConsentStatus = await this.myAccountPageObject.isConsentGiven();
    expect(actualConsentStatus).toBe(expectedConsentStatus);
    logger.info(
      `consent toggled from ${consentStatus} to ${expectedConsentStatus}`
    );
  }
  private static myAccountPageObject: MyAccountPage;
}
