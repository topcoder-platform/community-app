import { logger } from "../../../../../../logger/logger";
import { EmailPreferencesPage } from "./email.po";
import { SettingsPageConstants } from "../../settings.constants";

export class EmailPreferencesPageHelper {
  /**
   * sets the Community page object
   */
  public static setEmailPreferencesPage(emailPreferencesPage) {
    this.emailPreferencesPageObject = emailPreferencesPage;
  }

  /**
   * Opens the community page in the browser
   */
  public static async open() {
    this.emailPreferencesPageObject = new EmailPreferencesPage();
    await this.emailPreferencesPageObject.open();
  }

  /**
   * Updates the preferences if enabled from config
   * @param pref
   */
  public static async verifyUpdatePreferences(prefInputs) {
    const prefs = SettingsPageConstants.getEmailPreferences();
    for (let i = 0; i < prefs.length; i++) {
      const prefInput = prefInputs[i];
      let isPrefEnabled = await this.emailPreferencesPageObject.isPrefEnabled(
        prefs[i]
      );
      if ((prefInput && !isPrefEnabled) || (!prefInput && isPrefEnabled)) {
        await this.emailPreferencesPageObject.updatePref(prefs[i]);
      }
      isPrefEnabled = await this.emailPreferencesPageObject.isPrefEnabled(
        prefs[i]
      );
      expect(isPrefEnabled).toBe(prefInput);
      logger.info(prefs[i] + " is " + isPrefEnabled);
    }
  }

  private static emailPreferencesPageObject: EmailPreferencesPage;
}
