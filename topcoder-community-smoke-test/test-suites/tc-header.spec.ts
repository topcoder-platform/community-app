import { browser } from "protractor";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";
import { ChallengeListingPageConstants } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.constants";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { LoginPageConstants } from "../page-objects/pages/topcoder/login/login.constants";
import { ArenaPageHelper } from "../page-objects/pages/topcoder/arena/arena.helper";
import { ForumPageHelper } from "../page-objects/pages/topcoder/forum/forum.helper";
import { ProfilePageHelper } from "../page-objects/pages/topcoder/profile/profile.helper";
import { PaymentsPageHelper } from "../page-objects/pages/topcoder/payments/payments.helper";
import { SettingsPageHelper } from "../page-objects/pages/topcoder/settings/settings.helper";

describe('Topcoder Header Tests: ', () => {
    beforeEach(async () => {
        await browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
    });

    it('should verify whether the user is redirected to the topcoder homepage on clicking the Topcoder logo', async () => {
        await ChallengeListingPageHelper.get();
        await HeaderHelper.clickOnBanner();
        await HomePageHelper.verifyHomePage();
    });

    it('should verify whether the user is redirected to the Challenge listing page on clicking the All Challenges sub menu under the Compete menu.', async () => {
        await ChallengeListingPageHelper.get();
        await HeaderHelper.clickOnAllChallengesLink();
        const url = await browser.getCurrentUrl();
        expect(url).toEqual(ChallengeListingPageConstants.url);
    });

    it('should verify whether the user is redirected to the Login page on clicking the Competitive programming sub menu under the Compete menu.', async () => {
        await ChallengeListingPageHelper.get();
        await HeaderHelper.clickOnCompetitiveProgrammingLink();
        await LoginPageHelper.waitForLoginForm();
        const url = await browser.getCurrentUrl();
        expect(url).toEqual(LoginPageConstants.content.loginRedirectionUrlFromCompetitiveProgrammingLink);
    });

    it('should verify whether the user is redirected to the respective page while clicking the sub menu under the Tracks menu.', async () => {
        await HeaderHelper.verifyAllTrackLinks();
    });

    it('should verify whether the user is redirected to the respective page while clicking the sub menu under the Community menu.', async () => {    
        await HeaderHelper.verifyAllCommunityLinks();
    });

    it('should verify whether the user is redirected to the Login page on clicking the Forums sub menu under the Community menu.', async () => {
        await ChallengeListingPageHelper.get();
        await HeaderHelper.clickForumCommunityLink();
        await LoginPageHelper.waitForLoginForm();
        const url = await browser.getCurrentUrl();
        expect(url).toEqual(LoginPageConstants.url);
    });

    describe('Tests with login as pre-requisite', () => {
        beforeAll(async () => {
            await LoginPageHelper.get();
            await LoginPageHelper.waitForLoginForm();
            await LoginPageHelper.fillLoginForm(false);
            await LoginPageHelper.waitForLoginSuccessWithoutLoggingOut();
        })

        it('should verify whether the user is redirected to the Topcoder Arena page on clicking the Competitive programming sub menu under the Compete menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.verifyCompetitiveProgrammingLink();
        });

        it('should verify whether the user is redirected to the Forum page on clicking the Forums sub menu under the Community menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.verifyForumCommunityLink();
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
    
        it('should verify whether the logout happens on clicking the logout under the Username menu.', async () => {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnLogoutLink();
            await HomePageHelper.verifyHomePage();
        });
    });
});