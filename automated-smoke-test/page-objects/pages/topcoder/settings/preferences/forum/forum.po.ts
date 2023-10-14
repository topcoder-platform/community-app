import { logger } from '../../../../../../logger/logger';
import { BrowserHelper } from 'topcoder-testing-lib';
import { SettingsPage } from '../../settings.po';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { CommonHelper } from '../../../common-page/common.helper';

export class ForumPage extends SettingsPage {
  /**
   * Gets the Forum page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getPreferencesUrl());
    await this.navigateToPreferences('FORUM');
    logger.info('User navigated to Forum Page');
  }
}
