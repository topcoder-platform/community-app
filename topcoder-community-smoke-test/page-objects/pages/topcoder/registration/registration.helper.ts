import { protractor, browser, by, element } from "protractor";
import { RegistrationPageConstants } from "./registration.constants";
import { RegistrationPageObject } from "./registration.po";

export class RegistrationPageHelper {
    static async get() {
        await browser.get(RegistrationPageConstants.url);
        await console.log('User navigated to Topcoder Registration Page');
    }

    static async waitForRegistrationForm() {
        const until = protractor.ExpectedConditions;
        const registrationForm = RegistrationPageObject.registrationForm;
        await browser.wait(until.visibilityOf(registrationForm), 5000);
    }
}