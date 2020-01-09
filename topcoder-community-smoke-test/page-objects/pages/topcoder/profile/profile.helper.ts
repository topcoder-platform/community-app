import { protractor, browser, element, by, WebElement, Key } from "protractor";
import { ProfilePageConstants } from "./profile.constants";
import { ProfilePageObject } from "./profile.po";
import { commonPageObjects } from "../../../common/common.po";

export class ProfilePageHelper {
    private static DATE;

    static async get() {
        await browser.get(ProfilePageConstants.url);
        await browser.sleep(1000);
        await console.log('User navigated to Profile Page');
    }

    static async verifyProfilePage() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(ProfilePageObject.container));
        const browserUrl = await browser.getCurrentUrl();
        expect(browserUrl).toEqual(ProfilePageConstants.getMyProfileUrl());
        console.log('User redirected to profile page');
    }

    static async fillPersonalDetails() {
        await ProfilePageObject.firstName.clear();
        await ProfilePageObject.firstName.sendKeys('Test1');

        await ProfilePageObject.lastName.clear();
        await ProfilePageObject.lastName.sendKeys('User1');
        
        await ProfilePageObject.dob.click();
        

        let firstSelectableLabel = await ProfilePageObject.getFirstSelectableDate();
        const today  = new Date();
        const formatted = this.getDate(today);

        // today's date is the first selectable date, so move back
        if (formatted === firstSelectableLabel) {
            await ProfilePageObject.leftDatePickNavButton.click();
            await browser.sleep(1000);

            firstSelectableLabel = await ProfilePageObject.getFirstSelectableDate();

            await commonPageObjects.getLinkByAriaLabel(firstSelectableLabel).click();
        } else {
            await commonPageObjects.getLinkByAriaLabel(firstSelectableLabel).click();
        }

        this.DATE = await ProfilePageObject.dob.getAttribute('value');

        await ProfilePageObject.address1.clear();
        await ProfilePageObject.address1.sendKeys('Address1');
        
        await ProfilePageObject.address2.clear();
        await ProfilePageObject.address2.sendKeys('Address2');
        
        await ProfilePageObject.city.clear();
        await ProfilePageObject.city.sendKeys('TestCity');
        
        await ProfilePageObject.state.clear();
        await ProfilePageObject.state.sendKeys('TestState');
        
        await ProfilePageObject.zip.clear();
        await ProfilePageObject.zip.sendKeys('560000');
        
        await this.operateSelect(ProfilePageObject.countryInput, 'India');
    }

    static async fillAboutYou() {
        await this.operateSelect(ProfilePageObject.genderInput, 'Male');
        await this.operateSelect(ProfilePageObject.sizeInput, 'XXS');

        await ProfilePageObject.currentLocation.clear();
        await ProfilePageObject.currentLocation.sendKeys('India');

        await ProfilePageObject.primaryInterestInTopcoder.clear();
        await ProfilePageObject.primaryInterestInTopcoder.sendKeys('Coding');

        await ProfilePageObject.description.clear();
        await ProfilePageObject.description.sendKeys('Lorem Ipsum lorem ipsum');
    }

    static async fillTrackDetails() {
        const disabledTracks = await ProfilePageObject.getTrackSwitchesDisabled();
        const switches = await ProfilePageObject.trackSwitches;
        // only check the tracks if they are disabled
        // enable design and data_science
        if (disabledTracks.includes('design')) {
            await switches[0].click();
        }
        if (disabledTracks.includes('data_science')) {
            await switches[2].click();
        }
        // disable development
        if (!disabledTracks.includes('develop')) {
            await switches[1].click();
        }
    }

    static async saveChanges() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.saveButton.click();
        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
    }

    static async verifyPersonalDetails() {
        const firstName = await ProfilePageObject.firstName.getAttribute('value');
        expect(firstName).toEqual('Test1');

        const lastName = await ProfilePageObject.lastName.getAttribute('value');
        expect(lastName).toEqual('User1');

        const dob = await ProfilePageObject.dob.getAttribute('value');
        expect(dob).toEqual(this.DATE);

        const address1 = await ProfilePageObject.address1.getAttribute('value');
        expect(address1).toEqual('Address1');
        
        const address2 = await ProfilePageObject.address2.getAttribute('value');
        expect(address2).toEqual('Address2');
        
        const city = await ProfilePageObject.city.getAttribute('value');
        expect(city).toEqual('TestCity');
        
        const state = await ProfilePageObject.state.getAttribute('value');
        expect(state).toEqual('TestState');
        
        const zip = await ProfilePageObject.zip.getAttribute('value');
        expect(zip).toEqual('560000');
        
        const country = await ProfilePageObject.countryHidden.getAttribute('value');
        expect(country).toEqual('India');
    }

    static async verifyAboutYou() {
        const gender = await ProfilePageObject.genderHidden.getAttribute('value');
        expect(gender).toEqual('Male');

        const tshirtSize = await ProfilePageObject.tshirtSizeHidden.getAttribute('value');
        expect(tshirtSize).toEqual('XXS');

        const currentLocation = await ProfilePageObject.currentLocation.getAttribute('value');
        expect(currentLocation).toEqual('India');
        
        const primaryInterestInTopcoder = await ProfilePageObject.primaryInterestInTopcoder.getAttribute('value');
        expect(primaryInterestInTopcoder).toEqual('Coding');
        
        const description = await ProfilePageObject.description.getAttribute('value');
        expect(description).toEqual('Lorem Ipsum lorem ipsum');
    }

    static async verifyTrackDetails() {
        const disabledTracks = await ProfilePageObject.getTrackSwitchesDisabled();
        expect(disabledTracks.length).toEqual(1);
        expect(disabledTracks[0]).toEqual('develop');
    }
    
    static async addLanguage() {
        const until = protractor.ExpectedConditions;

        await this.operateSelect(ProfilePageObject.languageInput, 'English');
        await this.operateSelect(ProfilePageObject.spokenLevelInput, 'Basic');
        await this.operateSelect(ProfilePageObject.writtenLevelInput, 'Basic');
        await ProfilePageObject.addLanguageButton.click();
        
        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Spoken: BASIC | Written: BASIC');
        const isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);

        const text = await el.element(by.xpath('..')).getText();
        expect(text.includes('English')).toBe(true);
    }

    static async editLanguage() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getEdit('English').click();
        await this.operateSelect(ProfilePageObject.spokenLevelInput, 'Advanced');
        await this.operateSelect(ProfilePageObject.writtenLevelInput, 'Basic');
        await ProfilePageObject.editLanguageButton.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Spoken: ADVANCED | Written: BASIC');
        const isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);

        const text = await el.element(by.xpath('..')).getText();
        expect(text.includes('English')).toBe(true);
    }

    static async deleteLanguage() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getDelete('English').click();
        await ProfilePageObject.deleteConfirmation.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Spoken: ADVANCED | Written: BASIC');
        const isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async addEducation() {
        const until = protractor.ExpectedConditions;

        await ProfilePageObject.schoolCollegeName.clear();
        await ProfilePageObject.schoolCollegeName.sendKeys('Test college');

        await ProfilePageObject.major.clear();
        await ProfilePageObject.major.sendKeys('Test Major');
        
        let elm = ProfilePageObject.dateFrom;
        await browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement());
        
        await browser.sleep(1000);
        await ProfilePageObject.dateFrom.sendKeys('01/06/2010');
        await browser.sleep(1000);

        elm = ProfilePageObject.dateTo;
        await browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement());
        
        await browser.sleep(1000);
        await ProfilePageObject.dateTo.sendKeys('01/06/2014');
        await browser.sleep(1000);
        
        await ProfilePageObject.graduatedLabel.click();
        await ProfilePageObject.addEducationButton.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
    }

    static async editEducation() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getEdit('Test college').click();
        await ProfilePageObject.schoolCollegeName.sendKeys('Test college1');
        await ProfilePageObject.editEducationButton.click();
        
        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test college1');
        const isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteEducation() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getDelete('Test college1').click();
        await ProfilePageObject.deleteConfirmation.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
        
        const el = commonPageObjects.findElementByText('div', 'Test college1');
        const isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async addWork() {
        const until = protractor.ExpectedConditions;

        await ProfilePageObject.company.clear();
        await ProfilePageObject.company.sendKeys('Test company');

        await ProfilePageObject.position.clear();
        await ProfilePageObject.position.sendKeys('Test Position');
        
        await ProfilePageObject.industry.clear();
        await ProfilePageObject.industry.sendKeys('Test Industry');

        await ProfilePageObject.cityTown.clear();
        await ProfilePageObject.cityTown.sendKeys('Test City');

        let elm = ProfilePageObject.dateFrom;
        await browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement());
        
        await browser.sleep(1000);
        await ProfilePageObject.dateFrom.sendKeys('01/06/2015');
        await browser.sleep(1000);

        elm = ProfilePageObject.dateTo;
        await browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement());
        
        await browser.sleep(1000);
        await ProfilePageObject.dateTo.sendKeys('01/06/2016');
        await browser.sleep(1000);
        
        await ProfilePageObject.addWorkButton.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
    }

    static async editWork() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getEdit('Test company').click();
        await ProfilePageObject.company.clear();
        await ProfilePageObject.company.sendKeys('Test company1');
        await ProfilePageObject.editWorkButton.click();
        
        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test company1');
        const isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteWork() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getDelete('Test company1').click();
        await ProfilePageObject.deleteConfirmation.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test company1');
        const isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async addSkill() {
        const until = protractor.ExpectedConditions;
        await this.operateSelect(ProfilePageObject.skillInput, 'API');
        await ProfilePageObject.addSkillButton.click();
        await browser.sleep(1000);
        await browser.wait(until.visibilityOf(ProfilePageObject.skillSuccessMsg));
        await browser.wait(until.invisibilityOf(ProfilePageObject.skillSuccessMsg));

        const el = commonPageObjects.findElementByText('div', 'API');
        const isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteSkill() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.apiSkill.click();
        await ProfilePageObject.deleteConfirmation.click();
        await browser.sleep(1000);
        await browser.wait(until.visibilityOf(ProfilePageObject.skillSuccessMsg));
        await browser.wait(until.invisibilityOf(ProfilePageObject.skillSuccessMsg));

        const el = commonPageObjects.findElementByText('div', 'API');
        const isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async addHobby() {
        const until = protractor.ExpectedConditions;

        await ProfilePageObject.hobby.clear();
        await ProfilePageObject.hobby.sendKeys('Test hobby');

        await ProfilePageObject.description.clear();
        await ProfilePageObject.description.sendKeys('Test Description');
        
        await ProfilePageObject.addHobbyButton.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));
    }

    static async editHobby() {
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getEdit('Test hobby').click();

        await ProfilePageObject.hobby.clear();
        await ProfilePageObject.hobby.sendKeys('Test hobby1');
        await ProfilePageObject.editHobbyButton.click();
        
        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test hobby1');
        const isDisplayed = await el.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async deleteHobby() {
        await browser.sleep(3000);
        const until = protractor.ExpectedConditions;
        await ProfilePageObject.getDelete('Test hobby1').click();
        await ProfilePageObject.deleteConfirmation.click();

        const successEl = ProfilePageObject.successMsg;
        await browser.wait(until.visibilityOf(successEl));
        await browser.wait(until.invisibilityOf(successEl));

        const el = commonPageObjects.findElementByText('div', 'Test hobby1');
        const isDisplayed = await el.isPresent();
        expect(isDisplayed).toBe(false);
    }

    static async verifyBlockchainCommunity() {
        const el = await ProfilePageObject.blockchainCommunity();
        await el.click();
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(ProfilePageObject.successMsg));
    }

    private static async operateSelect(el, selection) {
        const until = protractor.ExpectedConditions;
        await el.sendKeys(selection);
        await browser.wait(until.visibilityOf(element(by.className('Select-option'))));
        const elements = await ProfilePageObject.selectOptions; 
        const matchingEl = elements[0];
        await matchingEl.click();
    }

    private static getDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return (date.toLocaleDateString("en-US", options));
    }
}