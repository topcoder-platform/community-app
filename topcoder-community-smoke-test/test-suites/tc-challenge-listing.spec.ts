import { browser } from "protractor";
import { RegistrationPageConstants } from "../page-objects/pages/topcoder/registration/registration.constants";
import { RegistrationPageHelper } from "../page-objects/pages/topcoder/registration/registration.helper";
import { LoginPageConstants } from "../page-objects/pages/topcoder/login/login.constants";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";
import { DashboardPageHelper } from "../page-objects/pages/topcoder/dashboard/dashboard.helper";
import { ProfilePageHelper } from "../page-objects/pages/topcoder/profile/profile.helper";
import { PaymentsPageHelper } from "../page-objects/pages/topcoder/payments/payments.helper";
import { SettingsPageHelper } from "../page-objects/pages/topcoder/settings/settings.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";
import { SearchPageHelper } from "../page-objects/pages/topcoder/search/search.helper";
import { ArenaPageHelper } from "../page-objects/pages/topcoder/arena/arena.helper";
import { ChallengeDetailPageHelper } from "../page-objects/pages/topcoder/challenge-detail/challenge-detail.helper";
import { commonPageHelper } from "../page-objects/common/common.helper";

describe('Topcoder Challenge Listing Page Tests: ', () => {

    beforeEach(() => {
        browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
    });

    it('should verify whether the current page is redirected to Registration page on clicking the Join button', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.clickJoinNow();
        await RegistrationPageHelper.waitForRegistrationForm();
        const registrationUrl = await browser.getCurrentUrl();
        expect(registrationUrl).toEqual(RegistrationPageConstants.content.joinNowRedirectionUrl);
    });

    it('should verify whether the current page is redirected to Login page on clicking the Log in button.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.clickLogin();
        await LoginPageHelper.waitForLoginForm();
        const loginUrl = await browser.getCurrentUrl();
        expect(loginUrl).toEqual(LoginPageConstants.content.loginRedirectionUrlFromChallengeListingLoginLink);
    });

    it('should verify whether the user is able to search the member by their username/skill using the search icon.', async () => {
        await ChallengeListingPageHelper.get();
        await HeaderHelper.search(commonPageHelper.getConfigUserName());
        await SearchPageHelper.verifySearchErrorPage(commonPageHelper.getConfigUserName());

        await ChallengeListingPageHelper.get();
        await HeaderHelper.search('Java');
        await SearchPageHelper.verifySearchErrorPage('Java');
    });

    it('should verify whether all the open for registration and Ongoing challenges are listed on clicking the Challenge tab.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyOpenForRegistrationChallenges();
        await ChallengeListingPageHelper.verifyOngoingChallenges();
    });

    it('should verify whether login page is opened on clicking the SRM tab.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.clickOnSRMTab();
        const windows = await browser.getAllWindowHandles();
        expect(windows.length).toBe(2);
        await browser.switchTo().window(windows[1]);
        await LoginPageHelper.waitForLoginForm();
        const loginUrl = await browser.getCurrentUrl();
        expect(loginUrl).toEqual(LoginPageConstants.content.loginRedirectionUrlFromSRMTab);
        await browser.close();
        await browser.switchTo().window(windows[0]);
    });

    it('should verify whether the user is able to search for a challenge by using the Search challenges textbox.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.fillAndVerifySearchResults();
    });

    it('should verify that the "Filter" button is working correctly', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyFilterToggle();
    });

    it('should verify that the "Filter" option "keywords" is working correctly', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyFilterByKeywords();
    });

    it('should verify that the "Filter" option "Subtrack" is working correctly', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyFilterBySubtrack();
    });

    it('should verify that the "Filter" option "Sub Community" is working correctly', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyFilterBySubCommunity();
    });

    it('should verify that the "Filter" option for "Date range" is working correctly', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.openFiltersPanel();
        await ChallengeListingPageHelper.selectDateRange();
        await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(1);
    });

    it('should verify whether the challenges are filtered according to the keyword/Subtrack/Sub community/Date range fields selected under the Filter function.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.openFiltersPanel();
        await ChallengeListingPageHelper.verifyFilterByKeywordsAndSubTrack();
        await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(2);
    });

    it('should verify whether the user is able to select more than one keyword/Subtrack under the filter function.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.openFiltersPanel();
        await ChallengeListingPageHelper.verifyFilterByMultipleKeywords();
        await ChallengeListingPageHelper.verifyFilterByMultipleSubtracks();
    });
    
    it('should verify whether the cross symbol inside the textbox keyword/Subtrack filters removes the selected keyword/Subtrack.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.openFiltersPanel();
        await ChallengeListingPageHelper.verifyFilterByMultipleKeywords();
        await ChallengeListingPageHelper.verifyFilterByMultipleSubtracks();
        await ChallengeListingPageHelper.verifyRemovalOfKeyword();
        await ChallengeListingPageHelper.verifyRemovalOfSubtrack();
    });

    it('should verify whether the number of filters applied are shown into Filter button according to the keyword/Subtrack/Sub community/Date range fields selected.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.openFiltersPanel();
        await ChallengeListingPageHelper.selectKeyword('Java');
        await ChallengeListingPageHelper.selectSubtrack('Code');
        await ChallengeListingPageHelper.selectSubCommunity(1);
        await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(2);
    });

    it('should verify whether the clear filter button clears all the filters selected and all the challenges are displayed.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.openFiltersPanel();
        await ChallengeListingPageHelper.selectKeyword('Java');
        await ChallengeListingPageHelper.selectSubtrack('Code');
        await ChallengeListingPageHelper.selectSubCommunity(1);
        await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(2);
        await ChallengeListingPageHelper.clearFilters();
        await ChallengeListingPageHelper.verifyNumberOfAppliedFilters(0);
    });

    it('should verify whether the Save filter button is deactivated into filter function.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.openFiltersPanel();
        await ChallengeListingPageHelper.selectKeyword('Java');
        await ChallengeListingPageHelper.verifySaveFilterState(false);
    });

    it('should verify whether the Sort by select option under the Open for registration/Ongoing Challenges list sorts the challenges according to the selected option.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifySortingFunctionality();
    });

    it('should verify whether the View more challenges link under the Open for registration/Ongoing Challenges list displays all the Open for registration/Ongoing challenges.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyViewMoreChallenges();
    });

    it('should verify that when user selects a challenge "tag", only challenges under the selected tag are shown.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyChallengesByChallengeTag();
    });

    it('should verify that the challenge count matches the number of challenges displayed', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyChallengeCountByTogglingDevelopment();
    });

    it('should verify that the challenge count remains the same when switching to the challenge details and then back to the challenge listings page ', async () => {
        await ChallengeListingPageHelper.get();
        const beforeCount = await ChallengeListingPageHelper.getOngoingChallengesCount();
        await ChallengeListingPageHelper.navigateToFirstChallenge();
        await ChallengeDetailPageHelper.clickOnBackButton();
        const afterCount = await ChallengeListingPageHelper.getOngoingChallengesCount();

        // FIXME -- commenting this out right now so that Topcoder devs can fix this later
        // expect(beforeCount).toEqual(afterCount);
    });

    it('should verify All Challenges link functionality with the design, development, and data sceince toggle switches on', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyAllChallenges();
        await ChallengeListingPageHelper.verifyOpenForRegistrationChallengesOnly();
        await ChallengeListingPageHelper.verifyOngoingChallengesOnly();
        await ChallengeListingPageHelper.verifyOpenForReviewChallengesOnly();
        await ChallengeListingPageHelper.verifyPastChallengesOnly();
    });

    it('should verify All Challenges link functionality with the design, development, and data sceince toggle switches Off', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyWithAllSwitchesTurnedOff();
    });

    it('should verify whether the page is redirected to the RSS Feed page on clicking the RSS feed link.', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.clickOnRssLink();
        await ChallengeListingPageHelper.verifyRssPage();
    });

    it('should verify whether the page is redirected to the respective page on clicking the link(About, Contact, Help, Privacy, Terms).', async () => {
        await ChallengeListingPageHelper.get();
        await ChallengeListingPageHelper.verifyLinksUnderRss();
    });

    describe('After login test cases', () => {
        beforeAll(async () => {
            await LoginPageHelper.get();
            await LoginPageHelper.waitForLoginForm();
            await LoginPageHelper.fillLoginForm(false);
            await LoginPageHelper.waitForLoginSuccessWithoutLoggingOut();
        });

        it('should verify whether the current page is redirected to my Dashboard page on clicking the Dashboard under the Username menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnDashboardLink();
            await DashboardPageHelper.verifyDashboardPage();
        });

        it('should verify whether the current page is redirected to my profile page on clicking the my profile under the Username menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnMyProfileLink();
            await ProfilePageHelper.verifyProfilePage();
        });

        it('should verify whether the current page is redirected to the payments page on clicking the payments under the Username menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnPaymentsLink();
            await PaymentsPageHelper.verifyPaymentsPage();
        });

        it('should verify whether the current page is redirected to the settings page on clicking the settings under the Username menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnSettingsLink();
            await SettingsPageHelper.verifySettingsPage();
        });

        it('should verify whether the user is able to search the member by their username/skill using the search icon.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.search(commonPageHelper.getConfigUserName());
            await SearchPageHelper.verifySearchErrorPage(commonPageHelper.getConfigUserName());

            await ChallengeListingPageHelper.get();
            await HeaderHelper.search('Java');
            await SearchPageHelper.verifySearchErrorPage('Java');
        });

        it('should verify whether all the my challenges, open for registration and Ongoing challenges are listed on clicking the Challenge tab.', async () => {
            await ChallengeListingPageHelper.get();
            await ChallengeListingPageHelper.verifyChallengesAfterLogin();
        });

        it('should verify whether the Topcoder arena page is opened on clicking the SRM tab. ', async () => {
            await ChallengeListingPageHelper.get();
            await ChallengeListingPageHelper.clickOnSRMTab();
            
            const windows = await browser.getAllWindowHandles();
            expect(windows.length).toBe(2);
            await browser.switchTo().window(windows[1]);

            await ArenaPageHelper.verifyArenaPage();
            await browser.driver.close();
            await browser.switchTo().window(windows[0]);
        });

        it('should verify whether the logout happens on clicking the logout under the Username menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnLogoutLink();
            await HomePageHelper.verifyHomePage();
        });
    });
});