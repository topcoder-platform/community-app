import { element, by } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class TermsPageObject {
    static get container() {
        return commonPageObjects.getTextFromH3('Acceptance of Terms and Conditions');
    }
}