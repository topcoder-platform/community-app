import { BrowserHelper } from 'topcoder-testing-lib';
import * as testData from '../test-data/test-data.json';
import { ConfigHelper } from '../utils/config-helper';
import { LoginPageHelper } from '../page-objects/pages/topcoder/login/login.helper';
import { HeaderHelper } from '../page-objects/pages/topcoder/header/header.helper';

describe('Topcoder Header Tests: ', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    await BrowserHelper.maximize();
  });

  /**
   * Verifies all tests without logging in
   */
  describe('Without Login tests', () => {
    beforeEach(async () => {
      HeaderHelper.initialize();
      await HeaderHelper.open(false);
    });

    /**
     * Verifies the functionality of clicking on topcoder logo in header
     */
    it('[TC_001] should check the logo link functionality', async () => {
      await HeaderHelper.verifyLogoLink(false);
    });

    /**
     * Verifies the functionality of clicking on BUSINESS link in header
     */
    it('[TC_002] should check the business link functionality', async () => {
      await HeaderHelper.verifyBusinessLink();
    });

    /**
     * Verifies the links under 'COMMUNITY' menu in header are working correctly
     */
    it('[TC_003 - TC_005] should check Community menu functionality', async () => {
      await HeaderHelper.verifyMenu('Community');
    });

    /**
     * Verifies the links under 'Compete' menu in header are working correctly
     */
    it('[TC_006 - TC_009] should check Compete menu functionality', async () => {
      await HeaderHelper.verifyMenu('Compete');
    });

    /**
     * Verifies the links under 'Tracks' menu in header are working correctly
     */
    it('[TC_010 - TC_015] should check Tracks menu functionality', async () => {
      await HeaderHelper.verifyMenu('Tracks');
    });

    /**
     * Verifies the links under 'Explore' menu in header are working correctly
     */
    it('[TC_016 - TC_020] should check Explore menu functionality', async () => {
      await HeaderHelper.verifyMenu('Explore');
    });

    /**
     * Verifies that the Login link in header is working correctly
     */
    it('[TC_021] should check the Login button functionality', async () => {
      await HeaderHelper.verifyLoginLink();
    });

    /**
     * Verifies that user is able to search by username/skill using the search bar
     */
    it('[TC_022] should verify whether the user is able to search the member by their username/skill using the search icon.', async () => {
      await HeaderHelper.verifySearchByUsername(testData.search.username);
      await HeaderHelper.open(false);
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });
  });

  describe('With Login tests', () => {
    /**
     * Logs in
     */
    beforeAll(async () => {
      await LoginPageHelper.open();
      await LoginPageHelper.login(
        ConfigHelper.getUserName(),
        ConfigHelper.getPassword()
      );
    });

    /**
     * Logs out
     */
    afterAll(async () => {
      try {
        await LoginPageHelper.logout();
      } catch (e) {
        await BrowserHelper.restart();
      }
    });

    /**
     * Open overview page
     */
    beforeEach(async () => {
      HeaderHelper.initialize();
      await HeaderHelper.open(true);
    });

    /**
     * Verifies the functionality of clicking on topcoder logo in header
     */
    it('[TC_023] should check the logo link functionality', async () => {
      await HeaderHelper.verifyLogoLink(true);
    });

    /**
     * Verifies the functionality of clicking on BUSINESS link in header
     */
    it('[TC_024] should check the business link functionality', async () => {
      await HeaderHelper.verifyBusinessLink();
    });

    /**
     * Verifies the links under 'COMMUNITY' menu in header are working correctly
     */
    it('[TC_025 - TC_028] should check Community menu functionality', async () => {
      await HeaderHelper.verifyMenu('Community', true);
    });

    /**
     * Verifies the links under 'Compete' menu in header are working correctly
     */
    it('[TC_029 - TC_032] should check Compete menu functionality', async () => {
      await HeaderHelper.verifyMenu('Compete', true);
    });

    /**
     * Verifies the links under 'Tracks' menu in header are working correctly
     */
    it('[TC_033 - TC_038] should check Tracks menu functionality', async () => {
      await HeaderHelper.verifyMenu('Tracks', true);
    });

    /**
     * Verifies the links under 'Explore' menu in header are working correctly
     */
    it('[TC_039 - TC_045] should check Explore menu functionality', async () => {
      await HeaderHelper.verifyMenu('Explore', true);
    });

    /**
     * Verifies the user info section link in avatar user menu
     */
    it('[TC_048] should verify that clicking inside the user info section directs user to profile page', async () => {
      await HeaderHelper.verifyUserMenuProfileLink();
    });

    /**
     * Verifies the 'SWITCH TO BUSINESS' link in avatar user menu
     */
    it('[TC_049] should verify that clicking Switch To Business link directs user to topcoder home page', async () => {
      await HeaderHelper.verifyUserMenuBusinessLink();
    });

    /**
     * Verifies the 'Settings' link in avatar user menu
     */
    it('[TC_050] should verify that clicking Settings link directs user to settings page', async () => {
      await HeaderHelper.verifyUserMenuSettingsLink();
    });

    /**
     * Verifies the 'Help' link in avatar user menu
     */
    it('[TC_051] should verify that clicking Help link directs user to help page', async () => {
      await HeaderHelper.verifyUserMenuHelpLink();
    });

    /**
     * Verifies that notifications popup is opening correctly
     */
    it('[TC_046] should verify that Bell icon opens the notifications popup', async () => {
      await HeaderHelper.verifyNotificationPopup();
    });

    /**
     * Verifies the 'View All Notifications' link inside notifications menu
     */
    it('[TC_047] should verify that View All Notifictaions Link opens the Notifications page', async () => {
      await HeaderHelper.verifyAllNotificationsLink();
    });

    /**
     * Verifies that user is able to search by username/skill using the search bar
     */
    it('[TC_053] should verify whether the user is able to search the member by their username/skill using the search icon.', async () => {
      await HeaderHelper.verifySearchByUsername(testData.search.username);
      await HeaderHelper.open(true);
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });

    /**
     * Verifies the 'Log Out' link in avatar user menu
     */
    it('[TC_052] should verify that clicking Logout button logouts the user from topcoder', async () => {
      await HeaderHelper.verifyUserMenuLogoutLink();
    });
  });
});
