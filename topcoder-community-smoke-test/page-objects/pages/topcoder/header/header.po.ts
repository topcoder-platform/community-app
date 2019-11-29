import { element, by } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class HeaderPageObject {
    static get banner() {
        return commonPageObjects.getLinkByAriaLabel('Topcoder Logo link to Topcoder Homepage');
    }

    static get allChallengesLink() {
        return commonPageObjects.getLinkByAriaLabel('All Challenges');
    }

    static get competitiveProgrammingLink() {
        return commonPageObjects.getLinkByAriaLabel('Competitive Programming');
    }

    static get competeLink() {
        return commonPageObjects.findElementByText('span', 'Compete');
    }

    static get tracksLink() {
        return commonPageObjects.findElementByText('a', 'Tracks');
    }

    static get communityLink() {
        return commonPageObjects.findElementByText('span', 'Community');
    }

    static get searchIcon() {
        return element(by.css('[data-menu="search"]'));
    }

    static get searchInput() {
        return element(by.css('[placeholder="Find members by username or skill"]'));
    }
}