import { PreferencesPageHelper } from "../page-objects/pages/topcoder/preferences/preferences.helper";
import { browser } from "protractor";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { PreferencesPageConstants } from "../page-objects/pages/topcoder/preferences/preferences.constants";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";

describe('Topcoder Preferences Page Tests: ', () => {
    beforeAll(async () => {
        await browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = false;

        await LoginPageHelper.get();
        await LoginPageHelper.waitForLoginForm();
        await LoginPageHelper.fillLoginForm(false);
        await LoginPageHelper.waitForLoginSuccessWithoutLoggingOut();
    });

    afterAll(async () => {
        try {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnLogoutLink();
            await HomePageHelper.verifyHomePage();
        } catch (e) {
            await browser.restart();
        }
    });

    it('should Verify User can update Email Preferences', async () => {
        await PreferencesPageHelper.get();
        await PreferencesPageHelper.verifyEmailPreferences();
    });

    it("should Verify User can redirect to forums's setting page", async () => {
        await PreferencesPageHelper.verifyExternalLink('forum', PreferencesPageConstants.content.forumUrl);
    });

    it('should Verify User can redirect to Payment details page', async () => {
        await PreferencesPageHelper.verifyExternalLink('payment', PreferencesPageConstants.content.paymentUrl);
    });

    it('should Verify User can redirect to Request visa letter page', async () => {
        await PreferencesPageHelper.verifyExternalLink('invitation letter', PreferencesPageConstants.content.invitationLetterUrl);
    });

    it('should Verify User can redirect to Referrals page', async () => {
        await PreferencesPageHelper.verifyExternalLink('referrals', PreferencesPageConstants.content.referralsUrl);
    });
});