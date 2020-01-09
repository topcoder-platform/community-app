import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";
import { FooterHelper } from "../page-objects/pages/topcoder/footer/footer.helper";
import { browser } from "protractor";

describe('Topcoder Footer Tests: ', () => {
    beforeEach(() => {
        browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
    });

    it('should verify whether the user is redirected to respective page on clicking the footer menu link into Footer of page.', async () => {
        await ChallengeListingPageHelper.get();
        await FooterHelper.verifyFooterLinks();
    });

    it('should verify whether the user is redirected to the topcoder social sites on clicking the social sites icon.', async () => {
        await ChallengeListingPageHelper.get();
        await FooterHelper.verifySocialIcons();
    });
});