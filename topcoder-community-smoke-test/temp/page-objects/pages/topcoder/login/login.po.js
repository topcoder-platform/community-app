"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var LoginPageObject = /** @class */ (function () {
    function LoginPageObject() {
    }
    Object.defineProperty(LoginPageObject, "loginForm", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('vm.loginForm'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "usernameField", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('username'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "passwordField", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('currentPassword'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "loginButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.css("button[type = 'submit']"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "homePageDiv", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('home'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "homePageMenu", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('handle-container'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "googleLogin", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('google-plus'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "googleLoginUsernameField", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('identifierId'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "googleLoginPasswordField", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('password'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "githubLogin", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('github'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "githubLoginUsernameField", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('login'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "githubLoginPasswordField", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('password'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "facebookLogin", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('facebook'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "facebookLoginUsernameField", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('email'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "facebookLoginPasswordField", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('pass'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "twitterLogin", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('twitter'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "privacyLinkAtBottom", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('privacy-policy'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "accessibilityMenuIcon", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('userway_accessibility_icon'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "accessibilityIframe", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('userway_iframe')).getWebElement();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "widgetBody", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('widget-body'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "widgetIcons", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('action'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "accessibilityMenuCloseIcon", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('close'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "forgotPasswordLink", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('forgot-password'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "forgotPasswordTooltip", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('uw-s12-tooltip'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "togglePasswordVisibilityBtn", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('toggleInputTypeBtn'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "forgotPasswordEmail", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('email'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "resetPasswordButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.css("button[type = 'submit']"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "forgotPasswordMessage", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('m-b-lg'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "createNewPasswordField", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('password-input'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "setPasswordButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('tc-btn enabled-button'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "homePageLoginButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('button_login'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageObject, "dashboardReactView", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('react-view'));
        },
        enumerable: true,
        configurable: true
    });
    return LoginPageObject;
}());
exports.LoginPageObject = LoginPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4ucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvbG9naW4vbG9naW4ucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUU7QUFFakU7SUFBQTtJQWlJQSxDQUFDO0lBL0hHLHNCQUFXLDRCQUFTO2FBQXBCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGdDQUFhO2FBQXhCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGdDQUFhO2FBQXhCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsOEJBQVc7YUFBdEI7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw4QkFBVzthQUF0QjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVywrQkFBWTthQUF2QjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDhCQUFXO2FBQXRCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDOzs7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