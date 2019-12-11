import { protractor, browser } from "protractor";
import { SettingsPageConstants } from "./settings.constants";
import { SettingsPageObject } from "./settings.po";

export class SettingsPageHelper {
    static async verifySettingsPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(SettingsPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(SettingsPageConstants.url);
        console.log('User redirected to settings page');
    }
}