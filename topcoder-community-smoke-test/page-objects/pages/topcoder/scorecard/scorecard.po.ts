import { element, by } from "protractor";

export class ScorecardPageObject {
    static get container() {
        return element(by.id('mainTabs'));
    }
}