var path = require('path');

import { protractor, browser, by, element } from "protractor";
import { commonPageObjects } from "./common.po";
import * as configProd from "../../config-prod.json";
import * as configDev from "../../config-dev.json";
import { ChallengeListingPageObject } from "../pages/topcoder/challenge-listing/challenge-listing.po";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export class commonPageHelper {

    static async clickOnAnchorText(text: string) {
        await commonPageObjects.clickOnAnchorText(text).click();
        await console.log('Click on link with text ' + text);
    }

    static async verifyPageTitle(pageTitle: string) {
        const title = await browser.getTitle();
        await console.log('Got page title: ' + title);
        expect(title).toEqual(pageTitle);
        await console.log('Verified Page Title');
    }

    static async verifyCurrentUrl(currentUrl: string) {
        const getURL = await browser.getCurrentUrl();
        await console.log('Got page url: ' + getURL);
        expect(getURL).toEqual(currentUrl);
        await console.log('Verified Current Url');
    }

    static async verifyPopupWindow() {
        const windows = await browser.getAllWindowHandles();
        expect(windows.length).toBe(2);
        await browser.switchTo().window(windows[1]);
        await browser.close();
        await browser.switchTo().window(windows[0]);
    }

    static async verifyPopupWindowWithTitle(title: string) {
        const windows = await browser.getAllWindowHandles();
        const until = protractor.ExpectedConditions;
        const windowTitle = element(by.xpath('//title'));
        expect(windows.length).toBe(2);
        browser.ignoreSynchronization = true;
        await browser.switchTo().window(windows[1]);
        await browser.wait(until.presenceOf(windowTitle));
        const popupWindowTitle = await browser.getTitle();
        expect(popupWindowTitle).toEqual(title);
        await browser.close();
        await browser.switchTo().window(windows[0]);
    }

    static async verifyPopupWindowWithUrl(expectedUrl: string) {
        const windows = await browser.getAllWindowHandles();
        expect(windows.length).toBe(2);
        await browser.switchTo().window(windows[1]);
        const url = await browser.getCurrentUrl();
        expect(url).toEqual(expectedUrl);
        await browser.close();
        await browser.switchTo().window(windows[0]);
    }

    static async verifyNewLink(text: string, hrefText: string) {
        const href = await commonPageObjects.getHrefTextByText(text);
        expect(href).toEqual(hrefText);
    }

    static async switchTab(tab: string, header: string) {
        const until = protractor.ExpectedConditions;
        await commonPageObjects.findElementByText('span', tab).click();
        const headerEl = commonPageObjects.getTextFromH1(header);
        await browser.wait(until.visibilityOf(headerEl));
    }

    static async switchTabWithoutVerifyingHeader(tab: string) {
        await commonPageObjects.findElementByText('span', tab).click();
    }

    static getConfigUserName() {
        return this.getConfig().login.username;
    }

    static getConfigEmail() {
        return this.getConfig().login.email;
    }

    static getConfig() {
        if (browser.params && browser.params.mode === 'dev') {
            return configDev;
        }
        return configProd;
    }

    static getHelpUrl() {
        return browser.params.mode === 'dev' ? 'https://help.' + commonPageHelper.getConfig().baseUrl + '/' : 'https://help.' + commonPageHelper.getConfig().baseUrl + '/hc/en-us';
    }

    static getChallengeTag() {
        return browser.params.mode === 'dev' ? ChallengeListingPageObject.nodeJsTag : ChallengeListingPageObject.qaTag;
    }

    static getChallengeTagText() {
        return browser.params.mode === 'dev' ? 'Node.js' : 'QA';
    }
}