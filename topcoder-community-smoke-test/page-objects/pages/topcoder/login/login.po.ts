import { browser, by, element, ElementFinder } from "protractor";

export class LoginPageObject {
    
    static get loginForm() {
        return element(by.name('vm.loginForm'));
    }

    static get usernameField() {
        return element(by.id('username'));
    }

    static get passwordField() {
        return element(by.name('currentPassword'));
    }

    static get loginButton() {
        return element(by.css("button[type = 'submit']"));
    }

    static get homePageDiv() {
        return element(by.className('home'));
    }

    static get homePageMenu() {
        return element(by.className('handle-container'));
    }

    static get googleLogin() {
        return element(by.className('google-plus'));
    }

    static get googleLoginUsernameField() {
        return element(by.id('identifierId'));
    }

    static get googleLoginPasswordField() {
        return element(by.name('password'));
    }

    static get githubLogin() {
        return element(by.className('github'));
    }

    static get githubLoginUsernameField() {
        return element(by.name('login'));
    }

    static get githubLoginPasswordField() {
        return element(by.name('password'));
    }

    static get facebookLogin() {
        return element(by.className('facebook'));
    }

    static get facebookLoginUsernameField() {
        return element(by.name('email'));
    }

    static get facebookLoginPasswordField() {
        return element(by.name('pass'));
    }

    static get twitterLogin() {
        return element(by.className('twitter'));
    }

    static get privacyLinkAtBottom() {
        return element(by.className('privacy-policy'));
    }

    static get accessibilityMenuIcon() {
        return element(by.className('userway_accessibility_icon'));
    }

    static get accessibilityIframe() {
        return element(by.className('userway_iframe')).getWebElement();
    }

    static get widgetBody() {
        return element(by.className('widget-body'));
    }

    static get widgetIcons() {
        return element.all(by.className('action'));
    }

    static get accessibilityMenuCloseIcon() {
        return element(by.className('close'));
    }

    static get forgotPasswordLink() {
        return element(by.className('forgot-password'));
    }

    static get forgotPasswordTooltip() {
        return element(by.className('uw-s12-tooltip'));
    }

    static get togglePasswordVisibilityBtn() {
        return element(by.id('toggleInputTypeBtn'));
    }

    static get forgotPasswordEmail() {
        return element(by.name('email'));
    }

    static get resetPasswordButton() {
        return element(by.css("button[type = 'submit']"));
    }

    static get forgotPasswordMessage() {
        return element(by.className('m-b-lg'));
    }

    static get createNewPasswordField() {
        return element(by.id('password-input'));
    }

    static get setPasswordButton() {
        return element(by.className('tc-btn enabled-button'));
    }

    static get homePageLoginButton() {
        return element(by.id('button_login'));
    }

    static get dashboardReactView() {
        return element(by.id('react-view'));
    }
}