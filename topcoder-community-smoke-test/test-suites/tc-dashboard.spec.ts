import { browser } from "protractor";
import { DashboardPageHelper } from "../page-objects/pages/topcoder/dashboard/dashboard.helper";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { DashboardPageConstants } from "../page-objects/pages/topcoder/dashboard/dashboard.constants";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";

describe('Topcoder Dashboard Tests: ', () => {
    beforeEach(async () => {
        await browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
    });

    describe('After login tests', () => {
        beforeAll(async () => {
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

        it('To verify that user is able to view dashboard when logged in', async () => {
            await DashboardPageHelper.get();
            await DashboardPageHelper.verifyDashboardPage();
        });
    })
    
    it('should verify whether the user is redirected to the topcoder social sites on clicking the social sites icon.', async () => {
        await DashboardPageHelper.get();
        await LoginPageHelper.waitForLoginForm();
        const url = await browser.getCurrentUrl();
        expect(url).toEqual(DashboardPageConstants.content.loginRedirectionUrl);
    });
});