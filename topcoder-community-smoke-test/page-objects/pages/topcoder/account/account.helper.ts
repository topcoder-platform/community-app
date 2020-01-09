import { AccountPageConstants } from "./account.constants";
import { browser } from "protractor";
import { AccountPageObject } from "./account.po";
import { protractor } from "protractor/built/ptor";
import { commonPageHelper } from "../../../common/common.helper";
import { commonPageObjects } from "../../../common/common.po";

export class AccountPageHelper {
    static async get() {
        await browser.get(AccountPageConstants.url);
        // waiting for preferences to get loaded
        await browser.sleep(5000);
        await console.log('User navigated to Account Page');
    }

    static async verifyConsentPreference() {
        const until = protractor.ExpectedConditions;

        const status = await this.getStatusOfConsent();

        let el = await AccountPageObject.consentLabel;
        await el.click();

        await browser.wait(until.visibilityOf(AccountPageObject.successMsg));
        await browser.wait(until.invisibilityOf(AccountPageObject.successMsg));
        
        const expectedStatus = !status;

        await this.get();

        const actualStatus = await this.getStatusOfConsent();
        expect(actualStatus).toBe(expectedStatus);
    }

    static async verifyExternalLink(tabName: string, expectedUrl: string) {
        await this.get();
        await commonPageHelper.switchTabWithoutVerifyingHeader(tabName);
        await browser.wait(async () => {
            const url = await browser.getCurrentUrl();
            return url === expectedUrl;
        });
    }

    static async addLink() {
        const until = protractor.ExpectedConditions;

        await AccountPageObject.externalLinkInput.sendKeys('www.test.com');
        await AccountPageObject.externalLinkAddButton.click();
        await browser.wait(until.visibilityOf(AccountPageObject.externalLinkSuccessMsg));
        await browser.wait(until.invisibilityOf(AccountPageObject.externalLinkSuccessMsg));

        const isDisplayed = await commonPageObjects.findElementByText('a', 'http://www.test.com').isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteLink() {
        const until = protractor.ExpectedConditions;
        const deleteEl = await AccountPageObject.externalLinkDeleteButton('http://www.test.com');
        await deleteEl.click();
        await browser.wait(until.visibilityOf(AccountPageObject.deleteConfirmation))
        await AccountPageObject.deleteConfirmation.click();

        await browser.wait(until.visibilityOf(AccountPageObject.getExternalLinkDeletionMsg()));
        await browser.wait(until.invisibilityOf(AccountPageObject.getExternalLinkDeletionMsg()));

        const isDisplayed = await commonPageObjects.findElementByText('a', 'http://www.test.com').isPresent();
        expect(isDisplayed).toBe(false);
    }

    private static async getStatusOfConsent() {
        const backgroundColor = await AccountPageObject.consentLabel.getCssValue('background-color');
        return this.getStatus(backgroundColor);
    }

    private static getStatus(color: string) {
        return color == 'rgba(192, 192, 192, 1)' ? false : true;
    }
}