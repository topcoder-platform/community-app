import { element, by } from "protractor";

export class HomePageObject {
    static get container() {
        return element(by.className('home-top-wrapper'));
    }
}