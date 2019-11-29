import { browser } from "protractor";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { AccountPageHelper } from "../page-objects/pages/topcoder/account/account.helper";
import { commonPageHelper } from "../page-objects/common/common.helper";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";

describe('Topcoder Account Page Tests: ', () => {
    beforeAll(async () => {
        await browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = false;

        await LoginPageHelper.get();
        await LoginPageHelper.waitForLoginForm();
        await LoginPageHelper.fillLoginForm(false);
        await LoginPageHelper.waitForLoginSuccessWithoutLoggingOut();
    });

    afterAll(async () => {
        await ChallengeListingPageHelper.get();
        await HeaderHelper.clickOnLogoutLink();
        await HomePageHelper.verifyHomePage();
    });

    it('should Verify User can update his/her User Consent. ', async () => {
        await AccountPageHelper.get();
        await AccountPageHelper.verifyConsentPreference();
    });

    it('should Verify User can Add/Delete External Link.', async() => {
        await AccountPageHelper.get();
        await commonPageHelper.switchTab('linked accounts', 'Linked Accounts');
        await AccountPageHelper.addLink();
        await AccountPageHelper.deleteLink();
    });
});