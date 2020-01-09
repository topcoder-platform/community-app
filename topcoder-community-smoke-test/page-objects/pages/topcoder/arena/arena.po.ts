import { element, by } from "protractor";

export class ArenaPageObject {
    static get container() {
        return element(by.className('ng-scope'));
    }
}