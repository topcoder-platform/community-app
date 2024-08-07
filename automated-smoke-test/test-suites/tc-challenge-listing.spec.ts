import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { ChallengeListingPageHelper } from '../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper';
import { LoginPageHelper } from '../page-objects/pages/topcoder/login/login.helper';
import { ConfigHelper } from '../utils/config-helper';
import { HeaderHelper } from '../page-objects/pages/topcoder/header/header.helper';
import * as testData from '../test-data/test-data.json';
import { ChallengeDetailPageHelper } from '../page-objects/pages/topcoder/challenge-detail/challenge-detail.helper';

describe('Topcoder Challenge Listing Page Tests: ', () => {
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
  describe('Before Login Test Cases', () => {
    beforeEach(async () => {
      // do refresh the browser to avoid caching in site
      await BrowserHelper.initialize();
      await BrowserHelper.maximize();
      HeaderHelper.initialize();
      ChallengeListingPageHelper.initialize();
      await ChallengeListingPageHelper.open();
    });

    it('[TC_002] should verify whether the current page is redirected to Registration page on clicking the Log in button', async () => {
      await ChallengeListingPageHelper.verifyLoginLink();
    });
/*
    it('[TC_003] should verify whether the user is able to search the member by their username/skill using the search icon', async () => {
      await HeaderHelper.verifySearchByUsername(testData.search.username);
      await ChallengeListingPageHelper.open();
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });
*/
    it('[TC_004] should verify whether all the open for registration are listed on clicking the Challenge tab', async () => {
      await ChallengeListingPageHelper.verifyOpenForRegistrationChallenges();
    });

    it('[TC_006] should verify whether the user is able to search for a challenge by using the Search challenges textbox', async () => {
      await ChallengeListingPageHelper.fillAndVerifySearchResults();
    });

    it('[TC-008] should verify that the "Filter" option "keywords" is working correctly', async () => {
      await ChallengeListingPageHelper.verifyFilterByKeywordSearch();
    });

    it('[TC-009] should verify that the "Filter" option "Type" is working correctly', async () => {
      await ChallengeListingPageHelper.verifyFilterByType();
    });

    it('[TC-010] should verify that the "Filter" option "Sub Community" is working correctly', async () => {
      await ChallengeListingPageHelper.verifyFilterBySubCommunity();
    });

    it('[TC-011] should verify that the "Filter" option for "Date range" is working correctly', async () => {
      await ChallengeListingPageHelper.selectDateRange();
      await ChallengeListingPageHelper.verifyPastChallenges();
    });

    it('[TC_012] should verify whether the challenges are filtered according to the keyword/Type/Sub community/Date range fields selected under the Filter function', async () => {
      await ChallengeListingPageHelper.verifyFilterByKeywordsAndType();
    });

    it('[TC_013] should verify whether the user is able to select more than one keyword/Type under the filter function', async () => {
      await ChallengeListingPageHelper.verifyFilterByMultipleTypes();
    });

    it('[TC_018] should verify whether the Sort by select option under the Open for registration list sorts the challenges according to the selected option', async () => {
      await ChallengeListingPageHelper.verifySortingFunctionality();
    });

    it('[TC_019] should verify whether the View more challenges link under the Open for registration list displays all the Open for registration', async () => {
      await ChallengeListingPageHelper.verifyViewMoreChallenges();
    });

    it('[TC-020] should verify that when user selects a challenge "tag", only challenges under the selected tag are shown', async () => {
      await ChallengeListingPageHelper.verifyChallengesByChallengeTag();
    });

    it('[TC-021] should verify that the challenge count matches the number of challenges displayed', async () => {
      await ChallengeListingPageHelper.verifyChallengeCountByTogglingDevelopment();
    });

    it('[TC-022] should verify that the challenge count remains the same when switching to the challenge details and then back to the challenge listings page', async () => {
      const beforeAllChallengesCount = await ChallengeListingPageHelper.getAllChallengesCount();
      const beforeOpenForRegistrationChallengesCount = await ChallengeListingPageHelper.getOpenForRegistrationChallengesCount();
      await ChallengeListingPageHelper.navigateToFirstChallenge();
      await ChallengeDetailPageHelper.clickOnBackButton();
      const afterAllChallengesCount = await ChallengeListingPageHelper.getAllChallengesCount();
      const afterOpenForRegistrationChallengesCount = await ChallengeListingPageHelper.getOpenForRegistrationChallengesCount();
      expect(beforeAllChallengesCount).toBe(
        afterAllChallengesCount,
        'All challenge count is not same as before '
      );
      expect(beforeOpenForRegistrationChallengesCount).toBe(
        afterOpenForRegistrationChallengesCount,
        'Open for registration challenge count is not same as before '
      );
    });

    it('[TC-023] should verify All Challenges link functionality with the design, development, data science and QA toggle switches on', async () => {
      await ChallengeListingPageHelper.verifyAllChallenges();
      await ChallengeListingPageHelper.verifyOpenForRegistrationChallengesOnly();
      await ChallengeListingPageHelper.verifyOpenForReviewChallengesOnly();
    });

    it('[TC-024] should verify All Challenges link functionality with the design, development, data science and QA toggle switches Off', async () => {
      await ChallengeListingPageHelper.verifyWithAllSwitchesTurnedOff();
    });
    
    //Commented as the RSS Feed link is currently hidden

    /*it('[TC_025] should verify whether the page is redirected to the RSS Feed page on clicking the RSS feed link', async () => {
      await ChallengeListingPageHelper.clickOnRssLink();
      await ChallengeListingPageHelper.verifyRssPage();
    });*/

    // Commented as the links are hidden
    /*it('[TC_026] should verify whether the page is redirected to the respective page on clicking the link(About, Contact, Help, Privacy, Terms)', async () => {
       await ChallengeListingPageHelper.verifyLinksUnderRss();
     });*/
  });

  /**
   * Verifies all tests with login functionality
   */
  describe('With Login tests', () => {
    /**
     * Sets up the browser and logs in
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
     * Open challenge listing page
     */
    beforeEach(async () => {
      ChallengeListingPageHelper.initialize();
      HeaderHelper.initialize();
      await ChallengeListingPageHelper.open();
    });

    it('[TC_028] should verify whether the current page is redirected to my profile page on clicking the my profile under the Username menu.', async () => {
      await HeaderHelper.verifyUserMenuProfileLink();
    });

    it('[TC_030] should verify whether the current page is redirected to the settings page on clicking the settings under the Username menu', async () => {
      await HeaderHelper.verifyUserMenuSettingsLink();
    });

    it('[TC_031] should verify whether the logout happens on clicking the logout under the Username menu', async () => {
      await HeaderHelper.verifyUserMenuLogoutLink();
    });

    it('[TC_032] should verify whether the user is able to search the member by their username/skill using the search icon', async () => {
      await HeaderHelper.verifySearchByUsername(testData.search.username);
      await ChallengeListingPageHelper.open();
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });

    it('[TC_033] should verify whether all the my challenges, open for registration are listed on clicking the Challenge tab', async () => {
      await ChallengeListingPageHelper.verifyChallengesAfterLogin();
    });
  });
});
