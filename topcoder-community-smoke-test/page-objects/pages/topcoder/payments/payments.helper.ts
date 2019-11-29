import { protractor, browser } from "protractor";
import { PaymentsPageConstants } from "./payments.constants";
import { PaymentsPageObject } from "./payments.po";
import * as config from "../../../../config.json";

export class PaymentsPageHelper {
    static async verifyPaymentsPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(PaymentsPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(PaymentsPageConstants.url);
        console.log('User redirected to payments page');
    }
}