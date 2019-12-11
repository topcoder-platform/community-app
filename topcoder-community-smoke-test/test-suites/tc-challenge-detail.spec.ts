import { browser } from "protractor";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { ChallengeListingPageConstants } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.constants";
import { ChallengeDetailPageHelper } from "../page-objects/pages/topcoder/challenge-detail/challenge-detail.helper";
import { ForumPageHelper } from "../page-objects/pages/topcoder/forum/forum.helper";
import { SubmissionPageHelper } from "../page-objects/pages/topcoder/submission/submission.helper";
import { ScorecardPageHelper } from "../page-objects/pages/topcoder/scorecard/scorecard.helper";
import { TermsPageHelper } from "../page-objects/pages/topcoder/terms/terms.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";
import { commonPageHelper } from "../page-objects/common/common.helper";

describe('Topcoder Challenge Detail Page Tests: ', () => {
    beforeEach(async () => {
        await browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
    });

    it('should verify whether the  error message is displayed on clicking the Challenge Terms link.', async () => {
        await ChallengeDetailPageHelper.get();
        await ChallengeDetailPageHelper.clickOnTermsLink();
        await TermsPageHelper.verifyTermsAuthenticationError();
    });

    describe('Pre-condition of login', () => {
        beforeAll(async () => {
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

        it('should verify that back button redirects user to challenge', async () => {
            await ChallengeListingPageHelper.get();
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.clickOnBackButton();
            const url = await browser.getCurrentUrl();
            expect(url).toEqual(ChallengeListingPageConstants.url);
        });

        it('should verify that a user is able to successfully enter a submission to a code challenge', async () => {
            await ChallengeDetailPageHelper.getUsingCustomUrl(commonPageHelper.getConfig().challengeDetail.customUrl);
            await ChallengeDetailPageHelper.registerIfNotAlreadyRegistered();
            await ChallengeDetailPageHelper.uploadSubmission();
        });

        it('should verify whether the user is registered to the particular challenge on clicking the Register button.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.register();
            await ChallengeDetailPageHelper.verifyChallengeForumLink();
        });

        it('should verify whether the user is unregistered into particular challenge on clicking the UnRegister button.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.register();
            await ChallengeDetailPageHelper.unregister();
        });

        it('should verify whether the user is redirected to the Submission page on clicking the Submit button.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.register();
            await ChallengeDetailPageHelper.clickOnSubmitButton();
            await SubmissionPageHelper.verifySubmissionPage();
        });

        it('should verify whether the deadlines(time zone) for the particular challenge on clicking the show Deadlines.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.verifyDeadlines();
        });

        it('should verify whether the details of the challenges are displayed on clicking the Details tab.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.switchToDetailsTab();
            await ChallengeDetailPageHelper.verifyDetailsTab();
        });

        it('should verify whether the registered members of the challenges are displayed on clicking the Registrants tab.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.switchToRegistrantsTab();
            await ChallengeDetailPageHelper.verifyRegistrantsTab();
        });

        it('should verify whether the  Solution submitted members  are displayed on clicking the Submissions tab.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.switchToSubmissionsTab();
            await ChallengeDetailPageHelper.verifySubmissionsTab();
        });

        it('should verify whether the  user is redirected to the Review Scorecard page on clicking the Review Scorecard link.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.clickOnReviewScorecardLink();
            await ScorecardPageHelper.verifyScorecardPage();
        });

        it('should verify whether the  user is redirected to the Challenge Terms page on clicking the Challenge Terms link.', async () => {
            await ChallengeDetailPageHelper.get();
            await ChallengeDetailPageHelper.clickOnTermsLink();
            await TermsPageHelper.verifyTermsPage();
        });
    });
    
});