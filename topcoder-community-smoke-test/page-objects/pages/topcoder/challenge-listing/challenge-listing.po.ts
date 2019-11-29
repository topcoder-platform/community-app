import { browser, by, element, ElementFinder, WebElement } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class ChallengeListingPageObject {

    static get h2Fields() {
        return element.all(by.tagName('h2'));
    }

    static get challengeSearchBox() {
        return element(by.id('search-challenges'))
    }

    static get challengeSearchButton() {
        return element(by.css('label[for=search-challenges]')).element(by.css('span[role=button]'));
    }

    static get challengeLinks() {
        return element.all(by.className('vir_2D'));
    }

    static get firstChallengeLink() {
        return element(by.className('vir_2D'));
    }

    static get openForRegistrationChallenges() {
        return this.getChallenges('Open for registration');
    }

    static get ongoingChallenges() {
        return this.getChallenges('Ongoing challenges');
    }

    static get filterButton() {
        return element(by.className('tc-outline-btn'));
    }

    static get dateRangeLabel() {
        return element(by.css('label[for="date-range-picker-two-months"]'));
    }

    static get keywordsLabel() {
        return element(by.css('label[for=keyword-select]'))
    }

    static get keywordInput() {
        return element(by.id('keyword-select'));
    }

    static get keywordSelection() {
        return element.all(by.className('Select-option'));
    }

    static get subtrackLabel() {
        return element(by.css('label[for=track-select]'))
    }

    static get subtrackInput() {
        return element(by.id('track-select'));
    }

    static get subtrackSelection() {
        return element.all(by.className('Select-option'));
    }

    static get subCommunityLabel() {
        return element(by.css('label[for=community-select]'))
    }

    static get subCommunityDropdown() {
        return element(by.id('react-select-3--value-item'));
    }

    static get subCommunitySelection() {
        return element.all(by.className('Select-option'));
    }

    static findAllElementsByText(elementType: string, text: string) {
        return element.all(by.xpath('//' + elementType + '[contains(text(), "' + text + '")]'));
    }

    static async dateRangeStartDate() {
        const els = await element.all(by.className('DateInput_input_1'));
        return els[2];
    }

    static async dateRangeEndDate() {
        const els = await element.all(by.className('DateInput_input_1'));
        return els[3];
    }

    static get appliedFilters() {
        return element(by.className('tc-outline-btn'));
    }

    static async allRemoveTags() {
        const crossTags = await ChallengeListingPageObject.findAllElementsByText('span', '×');
        const filteredCrossTags = [];
        for(let i = 0; i < crossTags.length; i++) {
            const className = await crossTags[i].getWebElement().getAttribute('class');
            if (className === 'Select-value-icon') {
                filteredCrossTags.push(crossTags[i]);
            }
        }
        return filteredCrossTags;
    }

    static async filterChallengesBy(filter: string) {
        const els = await element.all(by.xpath('//div[contains(text(), "' + filter +'")]'));
        return els[1];
    }

    static async reviewStatusElements() {
        const headers = await this.h2Fields;

        const elements = await headers[0]
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .getWebElement().findElements(by.className('_1YwVym'));
        return elements;
    }

    static async submissionElements() {
        const headers = await this.h2Fields;

        const elements = await headers[0]
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .getWebElement().findElements(by.className('_2Kuu31'));
        return elements;
    }

    static async designSwitch() {
        const els = await element.all(by.css('div[role="switch"]'));
        const el = await els[0].element(by.tagName('div'));
        return el;
    }

    static get designSwitchTurnedOff() {
        return commonPageObjects.getLinkByAriaLabel('Design toggle button pressed Off');
    }

    static async developmentSwitch() {
        const els = await element.all(by.css('div[role="switch"]'));
        const el = await els[1].element(by.tagName('div'));
        return el;
    }

    static get developmentSwitchTurnedOff() {
        return commonPageObjects.getLinkByAriaLabel('Development toggle button pressed Off');
    }

    static get developmentSwitchTurnedOn() {
        return commonPageObjects.getLinkByAriaLabel('Development toggle button pressed On');
    }

    static async dataScienceSwitch() {
        const els = await element.all(by.css('div[role="switch"]'));
        const el = await els[2].element(by.tagName('div'));
        return el;
    }

    static get dataScienceSwitchTurnedOff() {
        return commonPageObjects.getLinkByAriaLabel('Data Science toggle button pressed Off');
    }

    static async rssLink() {
        const els = await element.all(by.xpath("//a[contains(text(),'Get the RSS feed')]"));
        return els[1];
    }

    static async getLinkUnderRss(label: string) {
        const els = await commonPageObjects.getAllLinksByAriaLabel(label);
        return els[1];
    }

    static async selectSortOfOpenForRegistrationChallenges() {
        const els = await element.all(by.className('Select--single'));
        return els[1];
    }

    static get selectNumberOfSubmissions() {
        return commonPageObjects.findElementByText('div', '# of submissions');
    }

    static async viewMoreChallenges() {
        const els = await this.findAllElementsByText('a', 'View more challenges');
        return els;
    }

    static get qaTag() {
        return commonPageObjects.findElementByText('button', 'QA');
    }

    static async findSkillsForChallenge(challenge: WebElement) {
        const buttons = await challenge.findElement(by.xpath('..')).findElements(by.tagName('button'));
        const skills = [];
        for(let j = 0; j < buttons.length; j++) {
            const skill = await buttons[j].getText();
            skills.push(skill);
        }
        return skills;
    }

    static get surveyModal() {
        return element(by.className('smcx-modal-title'));
    }

    static get surveyCloseButton() {
        return element(by.className('smcx-modal-close'));
    }

    private static getChallenges(type: string) {
        return element(by.xpath('//h2[contains(text(), "' + type + '")]'))
        .element(by.xpath('..'))
        .element(by.xpath('..'))
        .getWebElement().findElements(by.className('vir_2D'));
    }
}