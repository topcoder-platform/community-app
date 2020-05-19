import { BrowserHelper } from "topcoder-testing-lib";
import { ConfigHelper } from "../utils/config-helper";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { FooterHelper } from "../page-objects/pages/topcoder/footer/footer.helper";

describe("Topcoder Footer Tests: ", () => {
  beforeAll(async () => {
    await BrowserHelper.restart();
    await BrowserHelper.maximize();
  });

  /**
   * Verifies all tests without login functionality
   */
  describe("Without Login tests", () => {
    beforeEach(() => {
      FooterHelper.initialize();
      BrowserHelper.setIgnoreSync(true);
    });

    /**
     * Verifies the links under 'COMPETE' section in footer are working correctly
     */
    it("should verify that the links under Compete are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("Compete", false);
    });

    /**
     * Verifies the links under 'TRACKS' section in footer are working correctly
     */
    it("should verify that the links under Tracks are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("Tracks", false);
    });

    /**
     * Verifies the links under 'COMMUNITY' section in footer are working correctly
     */
    it("should verify that the links under Community are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("Community", false);
    });

    /**
     * Verifies the links under 'HELP CENTER' section in footer are working correctly
     */
    it("should verify that the links under Help Center are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("HelpCenter", false);
    });

    /**
     * Verifies the links under 'ABOUT' section in footer are working correctly
     */
    it("should verify that the links under About are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("About", false);
    });

    /**
     * Verifies the links under 'FOLLOW US' section in footer are working correctly
     */
    it("should verify Footer social icons functionality", async () => {
      await FooterHelper.open();
      await FooterHelper.verifySocialIcons();
    });

    /**
     * Verifies the Policies link
     */
    it("should verify Policies link", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyPoliciesLink();
    });
  });

  /**
   * Verifies all tests with login as pre-requisite
   */
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
     * Initialize the ChallengeListingPage and turn off angular synchronization
     */
    beforeEach(() => {
      FooterHelper.initialize();
      BrowserHelper.setIgnoreSync(true);
    });

    // At present only the  Compete and  Community section links behave differently for logged in users
    /**
     * Verifies the links under 'COMPETE' section in footer are working correctly
     */
    it("should verify that the links under Compete are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("Compete", true);
    });

    /**
     * Verifies the links under 'TRACKS' section in footer are working correctly
     */
    /*it("should verify that the links under Tracks are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("Tracks", true);
    });

    /**
     * Verifies the links under 'COMMUNITY' section in footer are working correctly
     */
    it("should verify that the links under Community are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("Community", true);
    });

    /**
     * Verifies the links under 'HELP CENTER' section in footer are working correctly
     */
    /*it("should verify that the links under Help Center are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("HelpCenter", true);
    });

    /**
     * Verifies the links under 'ABOUT' section in footer are working correctly
     */
    /*it("should verify that the links under About are working from the Footer", async () => {
      await FooterHelper.open();
      await FooterHelper.verifyFooterSection("About", true);
    });*/
  });
});
