import { PreferencesPageConstants } from "./preferences.constants";
import { browser } from "protractor";
import { PreferencesPageObject } from "./preferences.po";
import { protractor } from "protractor/built/ptor";
import { commonPageHelper } from "../../../common/common.helper";

export class PreferencesPageHelper {
    static async get() {
        await browser.get(PreferencesPageConstants.url);
        // waiting for preferences to get loaded
        await browser.sleep(5000);
        await console.log('User navigated to Preferences Page');
    }

    static async verifyEmailPreferences() {
        const until = protractor.ExpectedConditions;

        const status = await this.getStatusOfNewsletters();
        const expectedStatus = [];

        let el = await PreferencesPageObject.designNewsletterLabel;
        await el.click();

        // since there is no success message, waiting for 5 secs after every operation
        // FIXME - below condition has to be fixed by Topcoder Devs
        // await browser.wait(until.visibilityOf(PreferencesPageObject.successMsg));
        await browser.sleep(5000);
        expectedStatus.push(!status[0]);

        expectedStatus.push(status[1]);

        el = await PreferencesPageObject.dataScienceNewsletterLabel;
        await el.click();

        await browser.sleep(5000);
        expectedStatus.push(!status[2]);

        await this.get();

        const actualStatus = await this.getStatusOfNewsletters();
        for (let i = 0; i < actualStatus.length; i++) {
            expect(actualStatus[i]).toEqual(expectedStatus[i]);
        }
    }

    static async verifyExternalLink(tabName: string, expectedUrl: string) {
        await this.get();
        await commonPageHelper.switchTabWithoutVerifyingHeader(tabName);
        await browser.wait(async () => {
            const url = await browser.getCurrentUrl();
            return url === expectedUrl;
        });
    }

    private static async getStatusOfNewsletters() {
        const status = [];

        let backgroundColor = await PreferencesPageObject.designNewsletterLabel.getCssValue('background-color');
        status.push(this.getStatus(backgroundColor));

        backgroundColor = await PreferencesPageObject.developmentNewsletterLabel.getCssValue('background-color');
        status.push(this.getStatus(backgroundColor));

        backgroundColor = await PreferencesPageObject.dataScienceNewsletterLabel.getCssValue('background-color');
        status.push(this.getStatus(backgroundColor));

        console.log(status);
        return status;
    }

    private static getStatus(color: string) {
        return color == 'rgba(192, 192, 192, 1)' ? false : true;
    }
}