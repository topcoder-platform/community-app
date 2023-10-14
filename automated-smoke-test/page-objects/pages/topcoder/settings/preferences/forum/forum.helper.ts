import { BrowserHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../../../logger/logger';
import { ForumPage } from './forum.po';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { CommonHelper } from '../../../common-page/common.helper';

export class ForumPageHelper {
  /**
   * sets the Forum page object
   */
  public static setForumPage(forumPage) {
    this.forumPageObject = forumPage;
  }

  /**
   * Opens the forum page in the browser
   */
  public static async open() {
    this.forumPageObject = new ForumPage();
    await this.forumPageObject.open();
  }

  /**
   * Verify forum setting page
   */
  public static async verifyForumSetting() {
    const windowHandles = await BrowserHelper.getAllWindowHandles();
    for (let i = 0; i < windowHandles.length; i++) {
      await BrowserHelper.switchToWindow(windowHandles[i]);
      await BrowserHelper.sleep(2000)
      if (await BrowserHelper.getCurrentUrl() == ConfigHelper.getForumSettingUrl()) {
        logger.info('redirected to forum settings page');
        return
      }
      await BrowserHelper.switchToWindow(windowHandles[0]);
    }
  }

  private static forumPageObject: ForumPage;
}
