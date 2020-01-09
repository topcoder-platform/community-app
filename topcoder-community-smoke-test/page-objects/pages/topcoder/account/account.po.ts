import { element, by } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class AccountPageObject {
    static get consentLabel() {
        return element(by.css('label[for="pre-onoffswitch-user-consent"]'))
    }

    static get successMsg() {
        return commonPageObjects.findElementByText('div', 'Your information has been updated');
    }

    static get externalLinkInput() {
        return element(by.name('addWebLinkFrm'))
        .element(by.id('web-link-input'));
    }

    static get externalLinkAddButton() {
        return element(by.className('button-add-link'))
    }
    
    static get externalLinkSuccessMsg() {
        return commonPageObjects.findElementByText('div', 'Your link has been added. Data from your link will be visible on your profile shortly.');
    }

    static async externalLinkDeleteButton(link: string) {
        const linkEl = commonPageObjects.findElementByText('a', link);
        const el = await linkEl.element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.css('[role=button]'));
        return el;
    }

    static get deleteConfirmation() {
        return commonPageObjects.findElementByText('button', 'Yes, Delete Link');
    }

    static getExternalLinkDeletionMsg() {
        return commonPageObjects.findElementByText('div', 'was removed.');
    }
}