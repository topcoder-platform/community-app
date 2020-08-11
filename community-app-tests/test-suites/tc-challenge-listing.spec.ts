import { BrowserHelper } from 'topcoder-testing-lib';
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

    it('should verify whether the current page is redirected to Registration page on clicking the Log in button [TC_002]', async () => {
      await ChallengeListingPageHelper.verifyLoginLink();
    });

    it('should verify whether the user is able to search the member by their username/skill using the search icon. [TC_003]', async () => {
      await HeaderHelper.verifySearchByUsername(testData.search.username);
      await ChallengeListingPageHelper.open();
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });

    it('should verify whether all the open for registration and Ongoing challenges are listed on clicking the Challenge tab. [TC_004]', async () => {
      await ChallengeListingPageHelper.verifyOpenForRegistrationChallenges();
      await ChallengeListingPageHelper.verifyOngoingChallenges();
    });

    it('should verify whether the user is able to search for a challenge by using the Search challenges textbox. [TC_006]', async () => {
      await ChallengeListingPageHelper.fillAndVerifySearchResults();
    });

    it('should verify that the "Filter" button is working correctly [TC-007]', async () => {
      await ChallengeListingPageHelper.verifyFilterToggle();
    });

    it('should verify that the "Filter" option "keywords" is working correctly [TC-008]', async () => {
      await ChallengeListingPageHelper.verifyFilterByKeywords();
    });

    it('should verify that the "Filter" option "Subtrack" is working correctly [TC-009]', async () => {
      await ChallengeListingPageHelper.verifyFilterBySubtrack();
    });

    it('should verify that the "Filter" option "Sub Community" is working correctly [TC-010]', async () => {
      await ChallengeListingPageHelper.verifyFilterBySubCommunity();
    });

    it('should verify that the "Filter" option for "Date range" is working correctly [TC-011]', async () => {
      await ChallengeListingPageHelper.openFiltersPanel();
      await ChallengeListingPageHelper.selectDateRange();
      await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(1);
    });

    it('should verify whether the challenges are filtered according to the keyword/Subtrack/Sub community/Date range fields selected under the Filter function. [TC_012]', async () => {
      await ChallengeListingPageHelper.openFiltersPanel();
      await ChallengeListingPageHelper.verifyFilterByKeywordsAndSubTrack();
      await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(2);
    });

    it('should verify whether the user is able to select more than one keyword/Subtrack under the filter function. [TC_013]', async () => {
      await ChallengeListingPageHelper.openFiltersPanel();
      await ChallengeListingPageHelper.verifyFilterByMultipleKeywords();
      await ChallengeListingPageHelper.verifyFilterByMultipleSubtracks();
    });

    it('should verify whether the cross symbol inside the textbox keyword/Subtrack filters removes the selected keyword/Subtrack. [TC_014]', async () => {
      await ChallengeListingPageHelper.openFiltersPanel();
      await ChallengeListingPageHelper.verifyFilterByMultipleKeywords();
      await ChallengeListingPageHelper.verifyFilterByMultipleSubtracks();
      await ChallengeListingPageHelper.verifyRemovalOfKeyword();
      await ChallengeListingPageHelper.verifyRemovalOfSubtrack();
    });

    it('should verify whether the number of filters applied are shown into Filter button according to the keyword/Subtrack/Sub community/Date range fields selected. [TC_015]', async () => {
      await ChallengeListingPageHelper.openFiltersPanel();
      await ChallengeListingPageHelper.selectKeyword('Java');
      await ChallengeListingPageHelper.selectSubtrack('Code');
      await ChallengeListingPageHelper.selectSubCommunity(1);
      await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(3);
    });

    it('should verify whether the clear filter button clears all the filters selected and all the challenges are displayed. [TC_016]', async () => {
      await ChallengeListingPageHelper.openFiltersPanel();
      await ChallengeListingPageHelper.selectKeyword('Java');
      await ChallengeListingPageHelper.selectSubtrack('Code');
      await ChallengeListingPageHelper.selectSubCommunity(1);
      await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(3);
      await ChallengeListingPageHelper.clearFilters();
      await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(0);
    });

    it('should verify whether the Clear filter button is deactivated into filter function. [TC_017]', async () => {
      await ChallengeListingPageHelper.openFiltersPanel();
      await ChallengeListingPageHelper.dropdownForKeywordIsDisplayed();
      await ChallengeListingPageHelper.dropdownForSubtrackIsDisplayed();
      await ChallengeListingPageHelper.dropdownForSubCommunityIsDisplayed();
      await ChallengeListingPageHelper.dropdownForDateRangeIsDisplayed();
      await ChallengeListingPageHelper.verifyClearFilterState(false);
    });

    it('should verify whether the Sort by select option under the Open for registration/Ongoing Challenges list sorts the challenges according to the selected option. [TC_018]', async () => {
      await ChallengeListingPageHelper.verifySortingFunctionality();
    });

    it('should verify whether the View more challenges link under the Open for registration/Ongoing Challenges list displays all the Open for registration/Ongoing challenges. [TC_019]', async () => {
      await ChallengeListingPageHelper.verifyViewMoreChallenges();
    });

    it('should verify that when user selects a challenge "tag", only challenges under the selected tag are shown. [TC-020]', async () => {
      await ChallengeListingPageHelper.verifyChallengesByChallengeTag();
    });

    it('should verify that the challenge count matches the number of challenges displayed [TC-021]', async () => {
      await ChallengeListingPageHelper.verifyChallengeCountByTogglingDevelopment();
    });

    it('should verify that the challenge count remains the same when switching to the challenge details and then back to the challenge listings page [TC-022]', async () => {
      const beforeOngoingChallengesCount = await ChallengeListingPageHelper.getOngoingChallengesCount();
      const beforeAllChallengesCount = await ChallengeListingPageHelper.getAllChallengesCount();
      const beforeOpenForRegistrationChallengesCount = await ChallengeListingPageHelper.getOpenForRegistrationChallengesCount();
      await ChallengeListingPageHelper.navigateToFirstChallenge();
      await ChallengeDetailPageHelper.clickOnBackButton();
      const afterOngoingChallengesCount = await ChallengeListingPageHelper.getOngoingChallengesCount();
      const afterAllChallengesCount = await ChallengeListingPageHelper.getAllChallengesCount();
      const afterOpenForRegistrationChallengesCount = await ChallengeListingPageHelper.getOpenForRegistrationChallengesCount();
      expect(beforeOngoingChallengesCount).toBe(
        afterOngoingChallengesCount,
        'Ongoing challenge count is not same as before '
      );
      expect(beforeAllChallengesCount).toBe(
        afterAllChallengesCount,
        'All challenge count is not same as before '
      );
      expect(beforeOpenForRegistrationChallengesCount).toBe(
        afterOpenForRegistrationChallengesCount,
        'Open for registration challenge count is not same as before '
      );
    });

    it('should verify All Challenges link functionality with the design, development, and data science toggle switches on [TC-023]', async () => {
      await ChallengeListingPageHelper.verifyAllChallenges();
      await ChallengeListingPageHelper.verifyOpenForRegistrationChallengesOnly();
      await ChallengeListingPageHelper.verifyOngoingChallengesOnly();
      await ChallengeListingPageHelper.verifyOpenForReviewChallengesOnly();
      await ChallengeListingPageHelper.verifyPastChallengesOnly();
    });

    it('should verify All Challenges link functionality with the design, development, and data science toggle switches Off [TC-024]', async () => {
      await ChallengeListingPageHelper.verifyWithAllSwitchesTurnedOff();
    });

    it('should verify whether the page is redirected to the RSS Feed page on clicking the RSS feed link. [TC_025]', async () => {
      await ChallengeListingPageHelper.clickOnRssLink();
      await ChallengeListingPageHelper.verifyRssPage();
    });

    it('should verify whether the page is redirected to the respective page on clicking the link(About, Contact, Help, Privacy, Terms). [TC_026]', async () => {
      await ChallengeListingPageHelper.verifyLinksUnderRss();
    });
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

    it('should verify whether the current page is redirected to my profile page on clicking the my profile under the Username menu. [TC_028]', async () => {
      await HeaderHelper.verifyUserMenuProfileLink();
    });

    it('should verify whether the current page is redirected to the settings page on clicking the settings under the Username menu. [TC_030]', async () => {
      await HeaderHelper.verifyUserMenuSettingsLink();
    });

    it('should verify whether the logout happens on clicking the logout under the Username menu. [TC_031]', async () => {
      await HeaderHelper.verifyUserMenuLogoutLink();
    });

    it('should verify whether the user is able to search the member by their username/skill using the search icon. [TC_032]', async () => {
      await HeaderHelper.verifySearchByUsername(testData.search.username);
      await ChallengeListingPageHelper.open();
      await HeaderHelper.verifySearchBySkill(testData.search.skill);
    });

    it('should verify whether all the my challenges, open for registration and Ongoing challenges are listed on clicking the Challenge tab. [TC_033]', async () => {
      await ChallengeListingPageHelper.verifyChallengesAfterLogin();
    });
  });
});
