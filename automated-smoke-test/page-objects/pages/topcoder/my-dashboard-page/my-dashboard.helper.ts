import { BrowserHelper } from 'topcoder-testing-lib';
import * as _ from 'lodash';
import { MyDashboardPageObject } from './my-dashboard.po';
import { CommonHelper } from '../common-page/common.helper';
import { ChallengeCardInfo } from '../../../../utils/config-helper';

export class MyDashboardPageHelper {
  /**
   * Open my dashboard page
   */
  public static async open() {
    await BrowserHelper.open(MyDashboardPageObject.myDashboardUrl);
    await CommonHelper.waitUntilVisibilityOf(
      () => MyDashboardPageObject.challengeCard,
      'Wait for challenge card',
      true
    );
    await BrowserHelper.sleep(1000);
  }

  /**
   * Check if tab is active
   * @param tabName name of tab
   */
  public static async checkIfTabIsActive(tabName: string) {
    const tabItem = MyDashboardPageObject.getTabWithName(tabName);
    const className = await tabItem.getAttribute('class');
    expect(className).toContain('_10EtkX'); // tab is selected
  }

  /**
   * Check if challenge card have correct info
   */
  public static async checkChallengeCardIsDisplayed() {
    const allCardsInfo = await MyDashboardPageObject.getAllChallengeCardsInfo();
    expect(
      _.some(allCardsInfo, (card: ChallengeCardInfo) =>
        _.isEqual(card, MyDashboardPageObject.myChallengeCardInfo)
      )
    ).toBe(true, 'Challenge card is not displayed');
  }

  /**
   * Select tab
   * @param tabName name of tab
   */
  public static async selectTab(tabName: string) {
    const tabItem = MyDashboardPageObject.getTabWithName(tabName);
    const button = CommonHelper.findElementByAttribute(
      'div',
      'role',
      'button',
      tabItem
    );
    await button.click();
  }

  /**
   * Verify user communities are displayed
   */
  public static async verifyUserCommunitiesAreDisplayed() {
    await CommonHelper.waitUntilVisibilityOf(
      () => MyDashboardPageObject.communityCard,
      'Wait for community card',
      true
    );
    await BrowserHelper.sleep(1000);
    const communities = await MyDashboardPageObject.getAllComunities();
    expect(
      communities.indexOf(MyDashboardPageObject.myCommunityInfo.name) >= 0
    ).toBe(true, 'Community card is not displayed');
  }

  /**
   * Verify learn more link
   */
  public static async verifyLearnMoreLink() {
    const button = await MyDashboardPageObject.getLearnMoreButtonOfMyCommunity();
    await button.click();
    CommonHelper.verifyPopupWindowWithUrl(
      MyDashboardPageObject.myCommunityInfo.learnMoreUrl
    );
  }

  /**
   * Verify srm tab is displayed
   */
  public static async verifySRMTabIsDisplayed() {
    await MyDashboardPageHelper.checkIfTabIsActive('SRMs');
    await CommonHelper.waitUntilVisibilityOf(
      () => MyDashboardPageObject.practiceOnPastProblems,
      'Wait for practice on past problems card',
      true
    );
  }
}
