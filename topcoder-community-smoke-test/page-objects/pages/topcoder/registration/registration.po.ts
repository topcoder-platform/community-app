import { browser, by, element, ElementFinder } from "protractor";

export class RegistrationPageObject {
    static get registrationForm() {
        return element(by.name('vm.registerForm'));
    }
}
