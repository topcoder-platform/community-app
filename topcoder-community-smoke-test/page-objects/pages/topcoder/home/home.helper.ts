import { protractor, browser } from "protractor";
import { HomePageConstants } from "./home.constants";
import { HomePageObject } from "./home.po";

export class HomePageHelper {
    static async verifyHomePage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(HomePageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(HomePageConstants.url);
        console.log('User redirected to home-page');
    }
}