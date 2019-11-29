import { protractor, browser } from "protractor";
import { ForumPageConstants } from "./forum.constants";
import { ForumPageObject } from "./forum.po";

export class ForumPageHelper {
    static async verifyForumPage() {
        const until = protractor.ExpectedConditions;
        
        await browser.wait(async () => {
            const browserUrl = await browser.getCurrentUrl();
            return browserUrl === ForumPageConstants.url;
        }, 15000);
        
        console.log('User redirected to forums page');
    }

    static async verifyChallengeForumPage() {
        const until = protractor.ExpectedConditions;
        
        await browser.wait(async () => {
            const browserUrl = await browser.getCurrentUrl();
            return browserUrl === ForumPageConstants.content.challengeForumUrl;
        }, 15000);

        console.log('User redirected to challenge forums page');
    }
}