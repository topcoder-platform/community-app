import { element, by } from "protractor";

export class SubmissionPageObject {
    static get container() {
        return element(by.id('react-view'));
    }
}