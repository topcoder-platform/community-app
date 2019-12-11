import { protractor, browser } from "protractor";
import { ArenaPageObject } from "./arena.po";
import { commonPageHelper } from "../../../common/common.helper";

export class ArenaPageHelper {
    static async verifyArenaPage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(ArenaPageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl.includes("arena." + commonPageHelper.getConfig().baseUrl)).toBe(true);
        console.log('User redirected to topcoder arena');
    }
}