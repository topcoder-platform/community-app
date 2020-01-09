import { element, by } from "protractor";
import { commonPageObjects } from "../../../common/common.po";
import { commonPageHelper } from "../../../common/common.helper";

export class ProfilePageObject {
    static get container() {
        return commonPageObjects.getTextFromH1(commonPageHelper.getConfigUserName());
    }

    static get firstName() {
        return element(by.id('firstName'));
    }

    static get lastName() {
        return element(by.id('lastName'));
    }

    static get dob() {
        return element(by.id('date-range-picker1'));
    }

    static get currentDate() {
        return element(by.className('CalendarDay__selected'));
    }

    static get address1() {
        return element(by.name('streetAddr1'));
    }

    static get address2() {
        return element(by.name('streetAddr2'));
    }

    static get city() {
        return element(by.id('city'));
    }

    static get state() {
        return element(by.id('state'));
    }

    static get zip() {
        return element(by.id('zipCode'));
    }

    static get countryHidden() {
        return element(by.name('country'));
    }

    static get languageInput() {
        return element(by.css('[aria-activedescendant="react-select-14--value"]'));
    }

    static get spokenLevelInput() {
        return element(by.css('[aria-activedescendant="react-select-15--value"]'));
    }

    static get writtenLevelInput() {
        return element(by.css('[aria-activedescendant="react-select-16--value"]'));
    }

    static get countryInput() {
        return element(by.css('[aria-activedescendant="react-select-2--value"]'));
    }

    static get genderInput() {
        return element(by.css('[aria-activedescendant="react-select-3--value"]'));
    }

    static get sizeInput() {
        return element(by.css('[aria-activedescendant="react-select-4--value"]'));
    }

    static get skillInput() {
        return element(by.css('[aria-activedescendant="react-select-10--value"]'));
    }

    static get genderHidden() {
        return element(by.name('gender'));
    }

    static get tshirtSizeHidden() {
        return element(by.name('tshirtSize'));
    }

    static get selectOptions() {
        return element.all(by.className('Select-option'));
    }

    static get currentLocation() {
        return element(by.id('currentLocation'));
    }

    static get primaryInterestInTopcoder() {
        return element(by.id('primaryInterestInTopcoder'));
    }

    static get description() {
        return element(by.id('description'));
    }

    static async getTrackSwitchesDisabled() {
        const elements = await element.all(by.className('BZhTou'));    
        const values = [];
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const val = await el.element(by.className('onoffswitch-checkbox')).getAttribute('value');
            values.push(val);
        }
        return values;
    }

    static get trackSwitches() {
        return element.all(by.className('onoffswitch-switch'));
    }

    static get languageHeader() {
        return commonPageObjects.getTextFromH1('Language');
    }

    static async getFirstSelectableDate() {
        const els = await element.all(by.className('CalendarDay__default'));
        let label = '';
        for (let i = 0; i < els.length; i++) {
            const isDisplayed = await els[i].isDisplayed();
            if (isDisplayed) {
                label = await els[i].getAttribute('aria-label');
                return label;
            }
        }
    }

    static get leftDatePickNavButton() {
        return element(by.className('DayPickerNavigation_button__horizontal'));
    }

    static get addLanguageButton() {
        return commonPageObjects.findElementByText('button', 'Add language to your list');
    }

    static get apiSkill() {
        return element(by.id('skill-a-117'));
    }

    static get hobby() {
        return element(by.id('hobby'));
    }

    static get addSkillButton() {
        return commonPageObjects.findElementByText('button', 'Add skill to your list');
    }

    static get addHobbyButton() {
        return commonPageObjects.findElementByText('button', 'Add hobby to your list');
    }

    static get successMsg() {
        return commonPageObjects.findElementByText('div', 'Your information has been updated');
    }

    static get skillSuccessMsg() {
        return commonPageObjects.findElementByText('div', 'Success');
    }

    static get saveButton() {
        return commonPageObjects.findElementByText('button', 'Save Changes');
    }

    static getEdit(name: string) {
        return commonPageObjects.findElementByText('div', name)
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('//p[contains(text(), "Edit")]'))
    }

    static getDelete(name: string) {
        return commonPageObjects.findElementByText('div', name)
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('//p[contains(text(), "Delete")]'));
    }
 
    static get editLanguageButton() {
        return commonPageObjects.findElementByText('button', 'Edit language to your list');
    }

    static get editEducationButton() {
        return commonPageObjects.findElementByText('button', 'Edit education to your list');
    }

    static get editWorkButton() {
        return commonPageObjects.findElementByText('button', 'Edit workplace to your list');
    }

    static get editHobbyButton() {
        return commonPageObjects.findElementByText('button', 'Edit hobby to your list');
    }

    static get deleteConfirmation() {
        return commonPageObjects.findElementByText('button', 'Yes, Delete');
    }

    static get schoolCollegeName() {
        return element(by.id('schoolCollegeName'));
    }

    static get major() {
        return element(by.id('major'));
    }

    static get dateFrom() {
        return element(by.id('date-from1'));
    }

    static get startDateLabel() {
        return element(by.css('[for="timePeriodFrom"]'));
    }

    static get dateTo() {
        return element(by.id('date-to1'));
    }

    static get graduatedLabel() {
        return element(by.css('[for="graduated"]'))
    }

    static get cityTown() {
        return element(by.id('cityTown'));
    }

    static get industry() {
        return element(by.id('industry'));
    }

    static get position() {
        return element(by.id('position'));
    }

    static get company() {
        return element(by.id('company'));
    }

    static get addEducationButton() {
        return commonPageObjects.findElementByText('button', 'Add education to your list');
    }

    static get addWorkButton() {
        return commonPageObjects.findElementByText('button', 'Add workplace to your list');
    }

    static async blockchainCommunity() {
        const els = await element.all(by.className('onoffswitch-switch'));
        return els[1];
    }
}