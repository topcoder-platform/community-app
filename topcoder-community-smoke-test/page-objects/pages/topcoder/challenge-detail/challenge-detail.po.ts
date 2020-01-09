import { commonPageObjects } from "../../../common/common.po";
import { element, by } from "protractor";

export class ChallengeDetailPageObject {
    static get backButton() {
        return commonPageObjects.getLinkByAriaLabel('Back to challenge list');
    }
    
    static get registrantsTable() {
        return commonPageObjects.getLinkByAriaLabel('Registrants');
    }

    static get tabPanel() {
        return element(by.css('[role="tabpanel"]'));
    }

    static get pickFile() {
        return commonPageObjects.getLinkByAriaLabel('Select file to upload');
    }

    static get fileModal() {
        return element(by.className('fsp-picker'));
    }

    static get inputFile() {
        return element(by.css('input[type="file"]'));
    }

    static get agreeToTerms() {
        return element(by.css('label[for="agree"]'));
    }

    static get submitButton() {
        return commonPageObjects.findElementByText('button', 'Submit');
    }

    static get viewMySubmissions() {
        return commonPageObjects.findElementByText('a', 'View My Submissions');
    }
}