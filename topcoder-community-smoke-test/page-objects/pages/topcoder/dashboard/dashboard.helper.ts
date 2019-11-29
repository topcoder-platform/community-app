import { protractor, browser } from "protractor";
import { DashboardPageConstants } from "./dashboard.constants";
import { DashboardPageObject } from "./dashboard.po";

export class DashboardPageHelper {
    static async get() {
        await browser.get(DashboardPageConstants.url)
    }

    static async verifyDashboardPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(DashboardPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(DashboardPageConstants.url);
        console.log('User redirected to dashboard page');
    }
}