import { BrowserHelper } from "topcoder-testing-lib";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";

describe("Topcoder Header Tests: ", () => {
  /**
   * Verifies all tests without logging in
   */
  describe("Without Login tests", () => {
    /**
     * Sets up the browser
     */
    beforeAll(async () => {
      await BrowserHelper.initialize();
    });

    beforeEach(() => {
      HeaderHelper.initialize();
      BrowserHelper.setIgnoreSync(true);
    });

    /**
     * Verifies the functionality of clicking on topcoder logo in header
     */
    it("should check the logo link functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyLogoLink(false);
    });

    /**
     * Verifies the functionality of clicking on BUSINESS link in header
     */
    it("should check the business link functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyBusinessLink();
    });

    /**
     * Verifies the links under 'COMMUNITY' menu in header are working correctly
     */
    it("should check Community menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Community");
    });

    /**
     * Verifies the links under 'Compete' menu in header are working correctly
     */
    it("should check Compete menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Compete");
    });

    /**
     * Verifies the links under 'Tracks' menu in header are working correctly
     */
    it("should check Tracks menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Tracks");
    });

    /**
     * Verifies the links under 'Explore' menu in header are working correctly
     */
    it("should check Explore menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Explore");
    });

    /**
     * Verifies that the Login link in header is working correctly
     */
    it("should check the Login button functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyLoginLink();
    });

    /**
     * Verifies that user is able to search by username/skill using the search bar
     */
    it("should verify whether the user is able to search the member by their username/skill using the search icon.", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifySearchByUsername(testData.search.username);

      await HeaderHelper.open();
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });
  });

  describe("With Login tests", () => {
    /**
     * Sets up the browser and logs in
     */
    beforeAll(async () => {
      await BrowserHelper.initialize();
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
     * Initializes the ChallengeListingPage and turns off angular synchronization
     */
    beforeEach(() => {
      HeaderHelper.initialize();
      BrowserHelper.setIgnoreSync(true);
    });

    /**
     * Verifies the functionality of clicking on topcoder logo in header
     */
    it("should check the logo link functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyLogoLink(true);
    });

    /**
     * Verifies the functionality of clicking on BUSINESS link in header
     */
    it("should check the business link functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyBusinessLink();
    });

    /**
     * Verifies the links under 'COMMUNITY' menu in header are working correctly
     */
    it("should check Community menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Community", true);
    });

    /**
     * Verifies the links under 'Compete' menu in header are working correctly
     */
    it("should check Compete menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Compete", true);
    });

    /**
     * Verifies the links under 'Tracks' menu in header are working correctly
     */
    it("should check Tracks menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Tracks", true);
    });

    /**
     * Verifies the links under 'Explore' menu in header are working correctly
     */
    it("should check Explore menu functionality", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyMenu("Explore", true);
    });

    /**
     * Verifies the user info section link in avatar user menu
     */
    it("should verify that clicking inside the user info section directs user to profile page", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyUserMenuProfileLink();
    });

    /**
     * Verifies the 'SWITCH TO BUSINESS' link in avatar user menu
     */
    it("should verify that clicking Switch To Business link directs user to topcoder home page", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyUserMenuBusinessLink();
    });

    /**
     * Verifies the 'Settings' link in avatar user menu
     */
    it("should verify that clicking Settings link directs user to settings page", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyUserMenuSettingsLink();
    });

    /**
     * Verifies the 'Help' link in avatar user menu
     */
    it("should verify that clicking Help link directs user to help page", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyUserMenuHelpLink();
    });

    /**
     * Verifies that notifications popup is opening correctly
     */
    it("should verify that Bell icon opens the notifications popup", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyNotificationPopup();
    });

    /**
     * Verifies the 'View All Notifications' link inside notifications menu
     */
    it("should verify that View All Notifictaions Link opens the Notifications page", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyAllNotificationsLink();
    });

    /**
     * Verifies that user is able to search by username/skill using the search bar
     */
    it("should verify whether the user is able to search the member by their username/skill using the search icon.", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifySearchByUsername(testData.search.username);

      await HeaderHelper.open();
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });

    /**
     * Verifies the 'Log Out' link in avatar user menu
     */
    it("should verify that clicking Logout button logouts the user from topcoder", async () => {
      await HeaderHelper.open();
      await HeaderHelper.verifyUserMenuLogoutLink();
    });
  });
});
