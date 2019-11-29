import { protractor, browser } from "protractor";
import { TermsPageConstants } from "./terms.constants";
import { TermsPageObject } from "./terms.po";
import { commonPageObjects } from "../../../common/common.po";

export class TermsPageHelper {
    static async verifyTermsAuthenticationError() {
        const until = protractor.ExpectedConditions;
        const errorElement = commonPageObjects.findElementByText('div', 'Authentication credential was missing.');
        await browser.wait(until.visibilityOf(errorElement));
        
        const url = await browser.getCurrentUrl();
        expect(url).toEqual(TermsPageConstants.content.redirectUrl);
    }

    static async verifyTermsPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(TermsPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(TermsPageConstants.content.redirectUrl);
        console.log('User redirected to terms page');
    }
}