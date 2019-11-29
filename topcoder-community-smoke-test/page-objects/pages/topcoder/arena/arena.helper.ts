import { protractor, browser } from "protractor";
import { ArenaPageConstants } from "./arena.constants";
import { ArenaPageObject } from "./arena.po";

export class ArenaPageHelper {
    static async verifyArenaPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(ArenaPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl.includes("arena.topcoder.com")).toBe(true);
        console.log('User redirected to topcoder arena');
    }
}