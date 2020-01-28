import { element, by } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class ToolsPageObject {
    static get selectOptions() {
        return element.all(by.className('Select-option'));
    }

    static get deviceTypeInput() {
        return element(by.css('[aria-activedescendant="react-select-2--value"]'));
    }

    static get softwareInput() {
        return element(by.css('[aria-activedescendant="react-select-6--value"]'));
    }

    static get serviceProviderInput() {
        return element(by.css('[aria-activedescendant="react-select-6--value"]'));
    }

    static get manufacturer() {
        return element(by.id('manufacturer'));
    }

    static get model() {
        return element(by.id('model'));
    }

    static get os() {
        return element(by.id('operating-system'));
    }

    static get osVersion() {
        return element(by.id('os-version'));
    }

    static get osLang() {
        return element(by.id('os-language'));
    }

    static get softwareName() {
        return element(by.id('name'));
    }

    static get serviceProviderName() {
        return element(by.id('name'));
    }

    static get subscriptionName() {
        return element(by.id('name'));
    }

    static get successMsg() {
        return commonPageObjects.findElementByText('div', 'Your information has been updated');
    }

    static getEdit(name: string) {
        return commonPageObjects.findElementByText('div', name)
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('//p[contains(text(), "Edit")]'));
    }

    static getDelete(name: string) {
        return commonPageObjects.findElementByText('div', name)
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .element(by.xpath('//p[contains(text(), "Delete")]'));
    }

    static get deleteConfirmation() {
        return commonPageObjects.findElementByText('button', 'Yes, Delete');
    }

    static getAddButton(type: string) {
        return commonPageObjects.findElementByText('button', 'Add ' + type + ' to your list');
    }

    static getEditButton(type: string) {
        return commonPageObjects.findElementByText('button', 'Edit ' + type + ' to your list');
    }
}