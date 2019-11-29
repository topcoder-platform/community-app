import { element, by } from "protractor";

export class SearchPageObject {
    static get errorContainer() {
        return element(by.id('member-search-wrapper'));
    }
}