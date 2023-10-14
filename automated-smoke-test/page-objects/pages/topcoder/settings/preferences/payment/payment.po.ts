import { logger } from '../../../../../../logger/logger';
import { BrowserHelper } from 'topcoder-testing-lib';
import { SettingsPage } from '../../settings.po';
import { ConfigHelper } from '../../../../../../utils/config-helper';

export class PaymentPage extends SettingsPage {
  /**
   * Gets the Payment page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getPreferencesUrl());
    await this.navigateToPreferences('PAYMENTS');
    logger.info('User navigated to Payment Page');
  }
}
