import { BrowserHelper } from 'topcoder-testing-lib';
import { ConfigHelper } from '../utils/config-helper';
import { LoginPageHelper } from '../page-objects/pages/topcoder/login/login.helper';
import { FooterHelper } from '../page-objects/pages/topcoder/footer/footer.helper';

describe('Topcoder Footer Tests: ', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    await BrowserHelper.maximize();
  });

  /**
   * Verifies all tests without login functionality
   */
  describe('Without Login tests', () => {
    beforeEach(async () => {
      FooterHelper.initialize();
      await FooterHelper.open();
    });

    /**
     * Verifies the links under 'COMPETE' section in footer are working correctly
     */
    it('[TC_001] should verify that the all link text are displayed from the Footer', async () => {
      await FooterHelper.verifyContentOfFooter(false);
    });

    /**
     * Verifies the links under 'COMPETE' section in footer are working correctly
     */
    it('[TC_002] should verify that the links under Compete are working from the Footer', async () => {
      await FooterHelper.verifyFooterSection('Compete', false);
    });

    /**
     * Verifies the links under 'TRACKS' section in footer are working correctly
     */
    it('[TC_003] should verify that the links under Tracks are working from the Footer', async () => {
      await FooterHelper.verifyFooterSection('Tracks', false);
    });

    /**
     * Verifies the links under 'COMMUNITY' section in footer are working correctly
     */
    it('[TC_004] should verify that the links under Community are working from the Footer', async () => {
      await FooterHelper.verifyFooterSection('Community', false);
    });

    /**
     * Verifies the links under 'HELP CENTER' section in footer are working correctly
     */
    it('[TC_005] should verify that the links under Help Center are working from the Footer', async () => {
      await FooterHelper.verifyFooterSection('HelpCenter', false);
    });

    /**
     * Verifies the links under 'ABOUT' section in footer are working correctly
     */
    it('[TC_006] should verify that the links under About are working from the Footer', async () => {
      await FooterHelper.verifyFooterSection('About', false);
    });

    /**
     * Verifies the links under 'FOLLOW US' section in footer are working correctly
     */
    it('[TC_007] should verify Footer social icons functionality', async () => {
      await FooterHelper.verifySocialIcons();
    });

    /**
     * Verifies the Policies link
     */
    it('[TC_008] should verify Policies link', async () => {
      await FooterHelper.verifyPoliciesLink();
    });
  });

  /**
   * Verifies all tests with login as pre-requisite
   */
  describe('With Login tests', () => {
    /**
     * logs in
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
     * Initialize the ChallengeListingPage and turn off angular synchronization
     */
    beforeEach(async () => {
      FooterHelper.initialize();
      await FooterHelper.open();
    });

    // At present only the  Compete and  Community section links behave differently for logged in users
    /**
     * Verifies the links under 'COMPETE' section in footer are working correctly
     */
    it('[TC_002] should verify that the links under Compete are working from the Footer', async () => {
      await FooterHelper.verifyFooterSection('Compete', true);
    });

    /**
     * Verifies the links under 'COMMUNITY' section in footer are working correctly
     */
    it('[TC_004] should verify that the links under Community are working from the Footer', async () => {
      await FooterHelper.verifyFooterSection('Community', true);
    });
  });
});
