import { protractor } from "protractor/built/ptor";
import { browser, element, by } from "protractor";
import { ToolsPageObject } from "./tools.po";
import { commonPageObjects } from "../../../common/common.po";
import { ToolsPageConstants } from "./tools.constants";

export class ToolsPageHelper {
    static async get() {
        await browser.get(ToolsPageConstants.url);
        await browser.sleep(1000);
        await console.log('User navigated to Tools Page');
    }

    static async addDevice() {
        const until = protractor.ExpectedConditions;

        await this.operateSelect(ToolsPageObject.deviceTypeInput, 'Desktop');

        await ToolsPageObject.manufacturer.clear();
        await ToolsPageObject.manufacturer.sendKeys('Test manufacturer');

        await ToolsPageObject.model.clear();
        await ToolsPageObject.model.sendKeys('Test Model');

        await ToolsPageObject.os.clear();
        await ToolsPageObject.os.sendKeys('Linux');

        await ToolsPageObject.osVersion.clear();
        await ToolsPageObject.osVersion.sendKeys('Ubuntu');

        await ToolsPageObject.osLang.clear();
        await ToolsPageObject.osLang.sendKeys('English');

        await ToolsPageObject.getAddButton('device').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        let el = commonPageObjects.findElementByText('div', 'Test manufacturer | Test Model | Desktop');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);

        el = commonPageObjects.findElementByText('div', 'Linux Ubuntu English');
        isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async editDevice() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getEdit('Test manufacturer').click();
        await ToolsPageObject.manufacturer.sendKeys('Test manufacturer1');

        await ToolsPageObject.getEditButton('device').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test manufacturer1 | Test Model | Desktop');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteDevice() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getDelete('Test manufacturer1 | Test Model | Desktop').click();
        await ToolsPageObject.deleteConfirmation.click();

        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
        
        const el = commonPageObjects.findElementByText('div', 'Test manufacturer1 | Test Model | Desktop');
        let isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async addSoftware() {
        const until = protractor.ExpectedConditions;

        await this.operateSelect(ToolsPageObject.softwareInput, 'Developer Tools');

        await ToolsPageObject.softwareName.clear();
        await ToolsPageObject.softwareName.sendKeys('TestSoftware');

        await ToolsPageObject.getAddButton('software').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        let el = commonPageObjects.findElementByText('div', 'TestSoftware');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);

        el = commonPageObjects.findElementByText('div', 'Developer Tools');
        isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async editSoftware() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getEdit('TestSoftware').click();
        await ToolsPageObject.softwareName.clear();
        await ToolsPageObject.softwareName.sendKeys('TestSoftware1');

        await ToolsPageObject.getEditButton('software').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'TestSoftware1');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteSoftware() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getDelete('TestSoftware1').click();
        await ToolsPageObject.deleteConfirmation.click();

        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
        
        const el = commonPageObjects.findElementByText('div', 'TestSoftware1');
        let isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async addServiceProvider() {
        const until = protractor.ExpectedConditions;

        await this.operateSelect(ToolsPageObject.serviceProviderInput, 'Television');

        await ToolsPageObject.serviceProviderName.clear();
        await ToolsPageObject.serviceProviderName.sendKeys('Test provider');

        await ToolsPageObject.getAddButton('service provider').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        let el = commonPageObjects.findElementByText('div', 'Test provider');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);

        el = commonPageObjects.findElementByText('div', 'Television');
        isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async editServiceProvider() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getEdit('Test provider').click();
        await ToolsPageObject.serviceProviderName.clear();
        await ToolsPageObject.serviceProviderName.sendKeys('Test provider1');

        await ToolsPageObject.getEditButton('service provider').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test provider1');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteServiceProvider() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getDelete('Test provider1').click();
        await ToolsPageObject.deleteConfirmation.click();

        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
        
        const el = commonPageObjects.findElementByText('div', 'Test provider1');
        let isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async addSubscription() {
        const until = protractor.ExpectedConditions;

        await ToolsPageObject.subscriptionName.clear();
        await ToolsPageObject.subscriptionName.sendKeys('Test subscription');

        await ToolsPageObject.getAddButton('subscription').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        let el = commonPageObjects.findElementByText('div', 'Test subscription');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async editSubscription() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getEdit('Test subscription').click();
        await ToolsPageObject.subscriptionName.clear();
        await ToolsPageObject.subscriptionName.sendKeys('Test subscription1');

        await ToolsPageObject.getEditButton('subscription').click();
        
        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test subscription1');
        let isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteSubscription() {
        const until = protractor.ExpectedConditions;
        await ToolsPageObject.getDelete('Test subscription1').click();
        await ToolsPageObject.deleteConfirmation.click();

        const successEl = ToolsPageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
        
        const el = commonPageObjects.findElementByText('div', 'Test subscription1');
        let isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    private static async operateSelect(el, selection) {
        const until = protractor.ExpectedConditions;
        await el.sendKeys(selection);
        await browser.wait(until.visibilityOf(element(by.className('Select-option'))));
        const elements = await ToolsPageObject.selectOptions; 
        const matchingEl = elements[0];
        await matchingEl.click();
    }
}