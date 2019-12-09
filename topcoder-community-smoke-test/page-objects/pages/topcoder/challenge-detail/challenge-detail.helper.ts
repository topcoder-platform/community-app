import { browser, protractor, by, element } from "protractor";
import { ChallengeDetailPageConstants } from "./challenge-detail.constants";
import { ChallengeDetailPageObject } from "./challenge-detail.po";
import { commonPageObjects } from "../../../common/common.po";
import { ForumPageConstants } from "../forum/forum.constants";
const path = require('path');

export class ChallengeDetailPageHelper {
    static async get() {
        await browser.get(ChallengeDetailPageConstants.url);
        await browser.sleep(1000);
        await browser.get(ChallengeDetailPageConstants.url);
        await console.log('User navigated to Challenge Detail Page');
    }

    static async getUsingCustomUrl(url: string) {
        await browser.get(url);
        await console.log('User navigated to Challenge Detail Page with url ' + url);
    }

    static async clickOnBackButton() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(ChallengeDetailPageObject.backButton));
        await ChallengeDetailPageObject.backButton.click();
        await console.log('Back button pressed on challenge detail page');
    }

    static async clickOnTermsLink() {
        const link = await commonPageObjects.findElementByText('a', 'Standard Terms for Topcoder Competitions v2.2');
        await link.click();
        await console.log('Terms link clicked');
    }

    static async register() {
        const until = protractor.ExpectedConditions;
        const registerButton = commonPageObjects.findElementByText('button', 'Register');
        const isRegisterButtonPresent = await registerButton.isPresent();
        if (!isRegisterButtonPresent) {
            const unregisterButton = commonPageObjects.findElementByText('button', 'Unregister');
            const isUnregisterButtonPresent = unregisterButton.isPresent();
            if (isUnregisterButtonPresent) {
                await unregisterButton.click();
                await browser.wait(until.visibilityOf(commonPageObjects.findElementByText('button', 'Register')));
            }
        }

        await commonPageObjects.findElementByText('button', 'Register').click();

        await this.acceptTermsIfNeeded();

        await browser.wait(until.visibilityOf(commonPageObjects.findElementByText('button', 'Unregister')));
        await browser.wait(until.visibilityOf(commonPageObjects.clickOnLinkText('CHALLENGE FORUM')));
    }

    static async registerIfNotAlreadyRegistered() {
        const until = protractor.ExpectedConditions;
        const registerButton = commonPageObjects.findElementByText('button', 'Register');
        const isRegisterButtonPresent = await registerButton.isPresent();
        if (!isRegisterButtonPresent) {
            return;
        }

        await commonPageObjects.findElementByText('button', 'Register').click();

        await this.acceptTermsIfNeeded();

        await browser.wait(until.visibilityOf(commonPageObjects.findElementByText('button', 'Unregister')));
        await browser.wait(until.visibilityOf(commonPageObjects.clickOnLinkText('CHALLENGE FORUM')));
    }

    private static async acceptTermsIfNeeded() {
        const termsAgreementButton = commonPageObjects.findElementByText('button', 'I Agree');
        const termsAgreementButtonVisibility = await termsAgreementButton.isPresent();
        if (termsAgreementButtonVisibility) {
            await termsAgreementButton.click();
        }
    }

    static async verifyChallengeForumLink() {
        const href = await commonPageObjects.clickOnLinkText('CHALLENGE FORUM').getAttribute('href');
        expect(href).toEqual(ForumPageConstants.content.challengeForumUrl)
    }

    static async unregister() {
        const until = protractor.ExpectedConditions;

        const unregisterButton = commonPageObjects.findElementByText('button', 'Unregister');
        const isUnregisterButtonPresent = unregisterButton.isPresent();
        if (isUnregisterButtonPresent) {
            await unregisterButton.click();
            await browser.wait(until.visibilityOf(commonPageObjects.findElementByText('button', 'Register')));
        }

        const registerButton = commonPageObjects.findElementByText('button', 'Register');
        const isRegisterButtonPresent = await registerButton.isPresent();
        expect(isRegisterButtonPresent).toBe(true);
    }

    static async clickOnSubmitButton() {
        await commonPageObjects.clickOnAnchorText('Submit').click();
        console.log('Submit button clicked');
    }

    static async switchToDetailsTab() {
        await commonPageObjects.clickOnAnchorText('DETAILS').click();
        console.log('Switched to Details tab');
    }

    static async switchToRegistrantsTab() {
        const tabs = await this.getAllTabs();
        await tabs[1].click();
        console.log('Switched to Registrants tab');
    }

    static async switchToSubmissionsTab() {
        const tabs = await this.getAllTabs();
        await tabs[2].click();
        console.log('Switched to Submissions tab');
    }

    static async getAllTabs() {
        const tabs = await commonPageObjects.clickOnAnchorText('DETAILS')
        .element(by.xpath('..'))
        .getWebElement().findElements(by.tagName('a'));
        return tabs;
    }

    static async verifyDetailsTab() {
        const challengeOverviewEl = commonPageObjects.getTextFromH2('Challenge Overview');
        const isDisplayed = await challengeOverviewEl.isDisplayed();
        expect(isDisplayed).toBe(true);

        const tabs = await this.getAllTabs();
        const ariaLabel = await tabs[0].getAttribute('aria-selected');
        expect(ariaLabel).toBe('true');
    }

    static async verifyRegistrantsTab() {
        const isDisplayed = await ChallengeDetailPageObject.registrantsTable.isDisplayed();
        expect(isDisplayed).toBe(true);

        const tabs = await this.getAllTabs();
        const ariaLabel = await tabs[1].getAttribute('aria-selected');
        expect(ariaLabel).toBe('true');
    }

    static async verifySubmissionsTab() {
        const isUsernameDisplayed = await commonPageObjects.findElementByText('span', 'Username').isDisplayed();
        expect(isUsernameDisplayed).toBe(true);

        const isSubmissionDateDisplayed = await commonPageObjects.findElementByText('span', 'Submission Date').isDisplayed();
        expect(isSubmissionDateDisplayed).toBe(true);

        const tabs = await this.getAllTabs();
        const ariaLabel = await tabs[2].getAttribute('aria-selected');
        expect(ariaLabel).toBe('true');
    }

    static async clickOnReviewScorecardLink() {
        await commonPageObjects.clickOnAnchorText('Review Scorecard').click();
        await console.log('Review Scorecard link clicked');
    }

    static async verifyDeadlines() {
        let el = await commonPageObjects.findElementByText('span', 'Show Deadlines');
        await el.click();

        el = await commonPageObjects.findElementByText('span', 'Hide Deadlines');
        const isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);

        const tabPanel = ChallengeDetailPageObject.tabPanel;
        const timezone = await tabPanel.element(by.tagName('p')).getText();
        console.log(timezone);
        expect(timezone.startsWith('Timezone')).toBe(true);

        const childDivs = await tabPanel.getWebElement().findElements(by.tagName('div'));
        const expectedDeadlines = ['Started', 'Registration', 'Submission', 'Review', 'Winners'];
        for (let i = 0; i < childDivs.length; i++) {
            const text = await childDivs[i].getText();
            console.log(text);
            expect(text.startsWith(expectedDeadlines[i])).toBe(true);
        }
    }

    static async uploadSubmission() {
        const until = protractor.ExpectedConditions;

        await this.clickOnSubmitButton();
        
        await browser.wait(until.visibilityOf(ChallengeDetailPageObject.pickFile));

        await ChallengeDetailPageObject.pickFile.click();

        await browser.wait(until.visibilityOf(ChallengeDetailPageObject.fileModal));

        // Commenting out this to prevent submission
        /*
        const fileToUpload = '../../../../../resources/submission.zip';
        const absolutePath = path.resolve(__dirname, fileToUpload);

        await ChallengeDetailPageObject.inputFile.sendKeys(absolutePath);   

        await browser.wait(until.invisibilityOf(ChallengeDetailPageObject.fileModal));
        
        await ChallengeDetailPageObject.agreeToTerms.click();
        await browser.sleep(1000);
        await ChallengeDetailPageObject.submitButton.click();
        await browser.wait(until.visibilityOf(ChallengeDetailPageObject.viewMySubmissions));
        */
    }
}