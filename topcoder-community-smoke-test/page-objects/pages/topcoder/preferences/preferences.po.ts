import { element, by } from "protractor";

export class PreferencesPageObject {
    static get designNewsletterLabel() {
        return element(by.css('label[for="pre-onoffswitch-TOPCODER_NL_DESIGN"]'))
    }

    static get developmentNewsletterLabel() {
        return element(by.css('label[for="pre-onoffswitch-TOPCODER_NL_DEV"]'))
    }

    static get dataScienceNewsletterLabel() {
        return element(by.css('label[for="pre-onoffswitch-TOPCODER_NL_DATA"]'))
    }
}