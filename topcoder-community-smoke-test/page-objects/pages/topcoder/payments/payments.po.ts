import { element, by } from "protractor";

export class PaymentsPageObject {
    static get container() {
        return element(by.id('payments'));
    }
}