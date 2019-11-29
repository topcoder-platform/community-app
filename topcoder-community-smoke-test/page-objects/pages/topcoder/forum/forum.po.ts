import { element, by } from "protractor";

export class ForumPageObject {
    static get container() {
        return element(by.className('mainContent'));
    }
}