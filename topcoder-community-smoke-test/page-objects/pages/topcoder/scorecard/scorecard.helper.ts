import { protractor, browser } from "protractor";
import { ScorecardPageConstants } from "./scorecard.constants";
import { ScorecardPageObject } from "./scorecard.po";

export class ScorecardPageHelper {
    static async verifyScorecardPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(ScorecardPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(ScorecardPageConstants.url);
        console.log('User redirected to scorecard page');
    }
}