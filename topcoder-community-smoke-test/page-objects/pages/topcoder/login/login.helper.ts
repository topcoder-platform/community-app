import { protractor, browser } from "protractor";
import { LoginPageConstants } from "../login/login.constants";
import { LoginPageObject } from "../login/login.po";
import * as config from "../../../../config.json";
import { commonPageHelper } from "../../../common/common.helper";

export class LoginPageHelper {
    static async get() {
        await browser.get(LoginPageConstants.url);
        await console.log('User navigated to Topcoder Login Page');
    }

    static async waitForLoginForm() {
        const until = protractor.ExpectedConditions;
        const loginForm = LoginPageObject.loginForm;
        await browser.wait(until.visibilityOf(loginForm), 15000);
    }

    static async fillLoginForm(shouldFillUsingEmail: boolean) {
        const until = protractor.ExpectedConditions;
        const username = shouldFillUsingEmail ? commonPageHelper.getConfigEmail() : commonPageHelper.getConfigUserName();
        const password = config.login.password;

        await browser.wait(until.presenceOf(LoginPageObject.usernameField), 2000);

        await LoginPageObject.usernameField.sendKeys(username);
        await LoginPageObject.passwordField.sendKeys(password);

        await console.log('Login form filled with values: username - ' + username + ', password - ' + password);

        const loginButton = LoginPageObject.loginButton;
        expect(loginButton.isEnabled()).toBeTruthy();

        await loginButton.click();
        console.log('Submitted login form');
    }

    static async waitForLoginSuccessWithoutLoggingOut() {
        browser.ignoreSynchronization = true;

        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(LoginPageObject.homePageDiv), 90000, 'Error: Element did not display within 90 seconds');

        const currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toEqual(LoginPageConstants.homePageUrl);
        console.log('Redirected to home page after login');
    }
}