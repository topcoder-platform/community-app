import { protractor, browser } from "protractor";
import { SubmissionPageConstants } from "./submission.constants";
import { SubmissionPageObject } from "./submission.po";

export class SubmissionPageHelper {
    static async verifySubmissionPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(SubmissionPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(SubmissionPageConstants.getUrl('30106190'));
        console.log('User redirected to submission page');
    }
}