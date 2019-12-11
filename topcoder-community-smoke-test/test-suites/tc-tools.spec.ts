import { browser } from "protractor";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { ProfilePageHelper } from "../page-objects/pages/topcoder/profile/profile.helper";
import { ToolsPageHelper } from "../page-objects/pages/topcoder/tools/tools.helper";
import { commonPageHelper } from "../page-objects/common/common.helper";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";

describe('Topcoder Tools Page Tests: ', () => {
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

    it('should verify User can Add/Update/Delete Device', async () => {
        await ToolsPageHelper.get();
        await ToolsPageHelper.addDevice();
        await ToolsPageHelper.editDevice();
        await ToolsPageHelper.deleteDevice();
    });

    it('should Verify User can Add/Update/Delete Software', async () => {
        await ToolsPageHelper.get();
        await commonPageHelper.switchTab('software', 'Software');
        await ToolsPageHelper.addSoftware();
        await ToolsPageHelper.editSoftware();
        await ToolsPageHelper.deleteSoftware();
    });

    it('should Verify User can Add/Update/Delete Service Provider', async () => {
        await ToolsPageHelper.get();
        await commonPageHelper.switchTab('service providers', 'Service Providers');
        await ToolsPageHelper.addServiceProvider();
        await ToolsPageHelper.editServiceProvider();
        await ToolsPageHelper.deleteServiceProvider();
    });

    it('should Verify User can Add/Update/Delete Subscriptions ', async () => {
        await ToolsPageHelper.get();
        await commonPageHelper.switchTab('subscriptions', 'Subscriptions');
        await ToolsPageHelper.addSubscription();
        await ToolsPageHelper.editSubscription();
        await ToolsPageHelper.deleteSubscription();
    });
});