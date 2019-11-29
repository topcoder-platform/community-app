import { protractor, browser } from "protractor";
import { SearchPageConstants } from "./search.constants";
import { SearchPageObject } from "./search.po";

export class SearchPageHelper {
    static async verifySearchErrorPage(query: string) {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(SearchPageObject.errorContainer));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(SearchPageConstants.getUrl(query));
        console.log('User redirected to search error page');
    }
}