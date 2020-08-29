import { BrowserHelper } from 'topcoder-testing-lib';
import { LoginPageHelper } from '../page-objects/pages/topcoder/login/login.helper';
import { ConfigHelper } from '../utils/config-helper';
import { ChallengeListingPageHelper } from '../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper';
import { ChallengeDetailPageHelper } from '../page-objects/pages/topcoder/challenge-detail/challenge-detail.helper';

describe('Topcoder Challenge Detail Page Tests: ', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    await BrowserHelper.maximize();
  });

  it('[TC_003] should verify whether the  error message is displayed on clicking the Challenge Terms link', async () => {
    await ChallengeDetailPageHelper.open();
    await ChallengeDetailPageHelper.clickOnTermsLink();
    await ChallengeDetailPageHelper.verifyTermsAuthenticationError();
  });

  /**
   * Verifies all tests with login functionality
   */
  describe('Pre-condition of login', () => {
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
     * Open challenge detail page and unregister challenge
     */
    beforeEach(async () => {
      await ChallengeDetailPageHelper.open();
      // unregister after finish test case
      await ChallengeDetailPageHelper.unregisterIfAlreadyRegistered();
    });

    /**
     * Open challenge detail page and unregister challenge
     */
    afterEach(async () => {
      await ChallengeDetailPageHelper.open();
      // unregister after finish test case
      await ChallengeDetailPageHelper.unregisterIfAlreadyRegistered();
    });

    it('[TC-001] should verify that back button redirects user to challenge', async () => {
      await ChallengeListingPageHelper.open();
      await ChallengeListingPageHelper.navigateToFirstChallenge();
      await ChallengeDetailPageHelper.clickOnBackButton();
      const url = await BrowserHelper.getCurrentUrl();
      expect(url).toEqual(ConfigHelper.getChallengeListingUrl());
    });

    it('[TC-002] should verify that a user is able to successfully enter a submission to a code challenge', async () => {
      await ChallengeDetailPageHelper.open();
      await ChallengeDetailPageHelper.registerIfNotAlreadyRegistered();
      await ChallengeDetailPageHelper.uploadSubmission();
    });

    it('[TC_004] should verify whether the user is registered to the particular challenge on clicking the Register button', async () => {
      await ChallengeDetailPageHelper.register();
      await ChallengeDetailPageHelper.verifyChallengeForumLink();
    });

    it('[TC_005] should verify whether the user is unregistered into particular challenge on clicking the UnRegister button', async () => {
      await ChallengeDetailPageHelper.register();
      await ChallengeDetailPageHelper.unregister();
    });

    it('[TC_006] should verify whether the user is redirected to the Submission page on clicking the Submit button', async () => {
      await ChallengeDetailPageHelper.register();
      await ChallengeDetailPageHelper.clickOnSubmitButton();
      await ChallengeDetailPageHelper.verifySubmissionPage();
    });

    it('[TC_007] should verify whether the deadlines(time zone) for the particular challenge on clicking the show Deadlines', async () => {
      await ChallengeDetailPageHelper.verifyDeadlines();
    });

    it('[TC_008] should verify whether the details of the challenges are displayed on clicking the Details tab', async () => {
      await ChallengeDetailPageHelper.switchToDetailsTab();
      await ChallengeDetailPageHelper.verifyDetailsTab();
    });

    it('[TC_009] should verify whether the registered members of the challenges are displayed on clicking the Registrants tab', async () => {
      await ChallengeDetailPageHelper.switchToRegistrantsTab();
      await ChallengeDetailPageHelper.verifyRegistrantsTab();
    });

    it('[TC_010] should verify whether the  Solution submitted members  are displayed on clicking the Submissions tab', async () => {
      await ChallengeDetailPageHelper.switchToSubmissionsTab();
      await ChallengeDetailPageHelper.verifySubmissionsTab();
    });

    it('[TC_011] should verify whether the  user is redirected to the Review Scorecard page on clicking the Review Scorecard link', async () => {
      await ChallengeDetailPageHelper.clickOnReviewScorecardLink();
      await ChallengeDetailPageHelper.verifyScorecardPage();
    });

    it('[TC_012] should verify whether the  user is redirected to the Challenge Terms page on clicking the Challenge Terms link', async () => {
      await ChallengeDetailPageHelper.clickOnTermsLink();
      await ChallengeDetailPageHelper.verifyTermsPage();
    });
  });
});
