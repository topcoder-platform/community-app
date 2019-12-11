import { element, by, browser } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class TermsPageObject {
    static get container() {
        if (browser.params.mode === 'dev') {
            return element(by.className('MsoNormal'));
        }
        return commonPageObjects.getTextFromH3('Acceptance of Terms and Conditions');
    }
}