import { BrowserHelper } from "topcoder-testing-lib";
import { logger } from "../../../../../../logger/logger";
import { ForumPage } from "./forum.po";
import { ConfigHelper } from "../../../../../../utils/config-helper";

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
    await BrowserHelper.waitUntilUrlIs(ConfigHelper.getForumSettingUrl());
    logger.info("redirected to forum settings page");
  }
  
  private static forumPageObject: ForumPage;
}