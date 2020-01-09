import { protractor, browser, by, element } from "protractor";
import { ChallengeListingPageConstants } from "./challenge-listing.constants";
import { commonPageHelper } from "../../../common/common.helper";
import { ChallengeListingPageObject } from "./challenge-listing.po";
import { commonPageObjects } from "../../../common/common.po";

export class ChallengeListingPageHelper {
    static async get() {
        await browser.get(ChallengeListingPageConstants.url);
        await console.log('User navigated to Challenges Page');

        const isSurveyModalDisplayed = await ChallengeListingPageObject.surveyModal.isPresent();

        if (isSurveyModalDisplayed) {
            // Survey modal displayed, refreshing page again
            await browser.get(ChallengeListingPageConstants.url);
        }
    }

    static async clickJoinNow() {
        await commonPageHelper.clickOnAnchorText('Join');
        await console.log('Join now button clicked');
    }

    static async clickLogin() {
        await commonPageHelper.clickOnAnchorText('Log In');
        await console.log('Login button clicked');
    }

    static async verifyChallengesAfterLogin() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(element(by.tagName('h2'))));
        const headers = await ChallengeListingPageObject.h2Fields;
        let expectedHeaders = ['My Challenges', 'Open for registration', 'Ongoing challenges'];
        if (headers.length === 2) {
            expectedHeaders = ['Open for registration', 'Ongoing challenges'];
        }
        for (let i = 0; i < headers.length; i++) {
            const headerText = await headers[i].getText();
            expect(headerText).toEqual(expectedHeaders[i]);
        }
        
    }
    
    static async verifyOpenForRegistrationChallenges() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(element(by.tagName('h2'))));
        const headers = await ChallengeListingPageObject.h2Fields;
        const registrationChallenges = await headers[0].getText();
        expect(registrationChallenges).toEqual('Open for registration');
    }

    static async verifyOngoingChallenges() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(element(by.tagName('h2'))));
        const headers = await ChallengeListingPageObject.h2Fields;
        const ongoingChallenges = await headers[1].getText();
        expect(ongoingChallenges).toEqual('Ongoing challenges');
    }

    static async verifyAllChallenges() {
        await this.verifyOpenForRegistrationChallenges();
        await this.verifyOngoingChallenges();
    }

    static async waitTillOnlyOneHeaderPresentWithText(header: string) {
        const headers = await ChallengeListingPageObject.h2Fields;
        await browser.wait(async () => {
            const text = await headers[0].getText();
            return headers.length === 1 && text === header
        });
    }

    static async verifyOpenForRegistrationChallengesOnly() {
        const openForRegistrationLink = await ChallengeListingPageObject.filterChallengesBy('Open for registration');
        await openForRegistrationLink.click();
        await this.waitTillOnlyOneHeaderPresentWithText('Open for registration');
        await this.verifyOpenForRegistrationChallenges();
    }

    static async verifyOngoingChallengesOnly() {
        const until = protractor.ExpectedConditions;
        const ongoingChallengesLink = await ChallengeListingPageObject.filterChallengesBy('Ongoing challenges');
        await ongoingChallengesLink.click();
        await this.waitTillOnlyOneHeaderPresentWithText('Ongoing challenges');
        
        const endsEl = commonPageObjects.findElementByText('span', 'Ends ');
        await browser.wait(until.visibilityOf(endsEl));
    }

    static async verifyOpenForReviewChallengesOnly() {
        const until = protractor.ExpectedConditions;
        const openForReviewLink = await ChallengeListingPageObject.filterChallengesBy('Open for review');
        await openForReviewLink.click();
        
        const iterativeReviewEl = commonPageObjects.findElementByText('span', 'Iterative Review');
        await browser.wait(until.visibilityOf(iterativeReviewEl));

        await this.verifyOpenForReviewChallenges();
        const headers = await ChallengeListingPageObject.h2Fields;
        expect(headers.length).toEqual(1);
    }

    static async verifyOpenForReviewChallenges() {
        const reviewStatusEls = await ChallengeListingPageObject.reviewStatusElements();

        for (let i = 0; i < reviewStatusEls.length; i++) {
            const el = reviewStatusEls[i];
            const status = await el.getText();
            expect(status.includes('Review')).toBe(true);
        }
    }

    static async verifyPastChallengesOnly() {
        const until = protractor.ExpectedConditions;
        const pastChallengesLink = await ChallengeListingPageObject.filterChallengesBy('Past challenges');
        await pastChallengesLink.click();
        
        const endedEl = commonPageObjects.findElementByText('span', 'Ended ');
        await browser.wait(until.visibilityOf(endedEl));

        const headers = await ChallengeListingPageObject.h2Fields;
        expect(headers.length).toEqual(1);
    }

    static async verifyWithAllSwitchesTurnedOff() {
        const until = protractor.ExpectedConditions;

        let el = await ChallengeListingPageObject.designSwitch();
        await el.click();
        await browser.wait(until.presenceOf(ChallengeListingPageObject.designSwitchTurnedOff));

        el = await ChallengeListingPageObject.developmentSwitch();
        await el.click();
        await browser.wait(until.presenceOf(ChallengeListingPageObject.developmentSwitchTurnedOff));

        el = await ChallengeListingPageObject.dataScienceSwitch();
        await el.click();
        await browser.wait(until.presenceOf(ChallengeListingPageObject.dataScienceSwitchTurnedOff));

        const ongoingChallengesLink = await ChallengeListingPageObject.filterChallengesBy('Ongoing challenges');
        await ongoingChallengesLink.click();
        
        const headers = await ChallengeListingPageObject.h2Fields;
        expect(headers.length).toBe(0);

        await browser.wait(async () => {
            const ongoingChallengesText = await ongoingChallengesLink.getText();
            return ongoingChallengesText.replace(/(\r\n|\n|\r)/gm, " ") === 'Ongoing challenges 0';
        }, 15000);

        const openForReviewLink = await ChallengeListingPageObject.filterChallengesBy('Open for review');
        await openForReviewLink.click();
        
        await this.waitTillOnlyOneHeaderPresentWithText('Open for review');
        const noReviewElement = commonPageObjects.findElementByText('div', 'There are no review opportunities available');
        await browser.wait(until.visibilityOf(noReviewElement));
        const isDisplayed = await noReviewElement.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    static async clickOnRssLink() {
        const el = await ChallengeListingPageObject.rssLink();
        await el.click();
    }

    static async verifyRssPage() {
        await browser.wait(async () => {
            const url = await browser.getCurrentUrl();
            return url === ChallengeListingPageConstants.content.rssFeedUrl;
        });        
    }

    static async verifyLinkUnderRss(label: string, expectedUrl: string) {
        const el = await ChallengeListingPageObject.getLinkUnderRss(label);
        await el.click();
        await commonPageHelper.verifyPopupWindowWithUrl(expectedUrl);
    }

    static async verifyLinksUnderRss() {
        const linksConfig = [
            {
                label: 'About',
                expectedUrl: ChallengeListingPageConstants.content.aboutUrl
            },
            {
                label: 'Contact',
                expectedUrl: ChallengeListingPageConstants.content.contactUrl
            },
            {
                label: 'Help',
                expectedUrl: ChallengeListingPageConstants.content.helpUrl
            },
            {
                label: 'Privacy',
                expectedUrl: ChallengeListingPageConstants.content.privacyUrl
            },
            {
                label: 'Terms',
                expectedUrl: ChallengeListingPageConstants.content.termsUrl
            }
        ];
        for (let i = 0; i < linksConfig.length; i++) {
            const linkConfig = linksConfig[i];
            await this.verifyLinkUnderRss(linkConfig.label, linkConfig.expectedUrl);
        }
    }

    static async clickOnSRMTab() {
        await commonPageHelper.clickOnAnchorText('SRMs');
        await console.log('Clicked on SRM tab');
    }

    static async fillAndVerifySearchResults() {
        const until = protractor.ExpectedConditions;
        await browser.wait(until.visibilityOf(ChallengeListingPageObject.firstChallengeLink));

        const searchString = commonPageHelper.getConfig().challengeListing.search.query;
        await ChallengeListingPageObject.challengeSearchBox.sendKeys(searchString);
        await ChallengeListingPageObject.challengeSearchButton.click();
        await browser.sleep(2000);
        
        const challenges = ChallengeListingPageObject.challengeLinks;
        const challengeNames = await challenges.getText();
        expect(challengeNames).toEqual([searchString]);
    }

    static async verifyFilterToggle() {
        const until = protractor.ExpectedConditions;
        await ChallengeListingPageObject.filterButton.click();
        await browser.wait(until.visibilityOf(ChallengeListingPageObject.keywordsLabel));
        let filtersVisibility = await ChallengeListingPageObject.keywordsLabel.isDisplayed();
        expect(filtersVisibility).toBe(true);
        await ChallengeListingPageObject.filterButton.click();
        filtersVisibility = await ChallengeListingPageObject.keywordsLabel.isDisplayed();
        expect(filtersVisibility).toBe(false);
    }

    static async verifyFilterByKeywords() {
        const until = protractor.ExpectedConditions;
        await ChallengeListingPageObject.filterButton.click();
        await browser.wait(until.visibilityOf(ChallengeListingPageObject.keywordsLabel));
        let filtersVisibility = await ChallengeListingPageObject.keywordsLabel.isDisplayed();
        expect(filtersVisibility).toBe(true);

        await this.selectKeyword('Java');
        await this.verifyChallengesMatchingKeyword(['Java']);
    }

    static async verifyFilterBySubtrack() {
        const until = protractor.ExpectedConditions;
        await ChallengeListingPageObject.filterButton.click();
        await browser.wait(until.visibilityOf(ChallengeListingPageObject.subtrackLabel));
        let filtersVisibility = await ChallengeListingPageObject.subtrackLabel.isDisplayed();
        expect(filtersVisibility).toBe(true);

        await this.selectSubtrack('Web Design');

        const els = await ChallengeListingPageObject.viewMoreChallenges();
        if (els.length > 0) {
            await els[0].click();
        }

        const count = await this.getAllChallengesCount();
        await this.verifyChallengesMatchingSubtrack(count,
            [
                { name: 'Wb' }
            ]
        )
    }

    static async verifyFilterByKeywordsAndSubTrack() {
        await this.selectKeyword('Java');
        await this.selectSubtrack('Code');
        await this.verifyChallengesMatchingKeyword(['Java']);
        const count = await this.getAllChallengesCount();
        await this.verifyChallengesMatchingSubtrack(count,
            [
                { name: 'Cd' }
            ]
        )
    }

    static async verifyFilterBySubCommunity() {
        const until = protractor.ExpectedConditions;
        await ChallengeListingPageObject.filterButton.click();
        await browser.wait(until.visibilityOf(ChallengeListingPageObject.subCommunityLabel));
        let filtersVisibility = await ChallengeListingPageObject.subCommunityLabel.isDisplayed();
        expect(filtersVisibility).toBe(true);

        await this.selectSubCommunity(1);
        let challenges = await ChallengeListingPageObject.challengeLinks;
        
        let count = await this.getAllChallengesCount();
        expect(challenges.length).toEqual(count);

        await this.selectSubCommunity(0);
        challenges = await ChallengeListingPageObject.challengeLinks;

        count = await this.getAllChallengesCount();
        expect(challenges.length > 0).toBe(true);
    }

    static async openFiltersPanel() {
        const until = protractor.ExpectedConditions;
        await ChallengeListingPageObject.filterButton.click();
        await browser.wait(until.visibilityOf(ChallengeListingPageObject.keywordsLabel));
        let filtersVisibility = await ChallengeListingPageObject.keywordsLabel.isDisplayed();
        expect(filtersVisibility).toBe(true);
    }

    static async verifyFilterByMultipleKeywords() {
        await this.selectKeyword('Java');
        await this.selectKeyword('HTML5');
        await this.verifyChallengesMatchingKeyword(['Java', 'HTML5']);
    }

    static async verifyFilterByMultipleSubtracks() {
        await this.selectSubtrack('Assembly Competition');
        await this.selectSubtrack('Code');

        const els = await ChallengeListingPageObject.viewMoreChallenges();
        if (els.length > 0) {
            await els[0].click();
        }

        const count = await this.getAllChallengesCount();

        await this.verifyChallengesMatchingSubtrack(count, [
            { name: 'As' },
            { name: 'Cd' }
        ]);
    }

    static async verifyRemovalOfKeyword() {
        const removeTags = await ChallengeListingPageObject.allRemoveTags();
        // remove HTML5 tag
        await removeTags[1].click();
        await this.verifyChallengesMatchingKeyword(['Java']);
    }

    static async verifyRemovalOfSubtrack() {
        const removeTags = await ChallengeListingPageObject.allRemoveTags();
        await removeTags[1].click();
        const count = await this.getAllChallengesCount();
        await this.verifyChallengesMatchingSubtrack(count, [
            { name: 'Cd' }
        ]);
    }

    static async selectKeyword(keyword: string) {
        const until = protractor.ExpectedConditions;
        await ChallengeListingPageObject.keywordInput.sendKeys(keyword)
        await browser.wait(until.visibilityOf(element(by.className('Select-option'))));
        const keywordElements = await ChallengeListingPageObject.keywordSelection;
        const matchingKeyword = keywordElements[0];
        await matchingKeyword.click();
    }

    static async selectSubtrack(track: string) {
        await ChallengeListingPageObject.subtrackInput.sendKeys(track)
        const subtrackElements = await ChallengeListingPageObject.subtrackSelection;
        const matchingTrack = subtrackElements[0];
        await matchingTrack.click();
    }

    static async selectSubCommunity(index: number) {
        await ChallengeListingPageObject.subCommunityDropdown.click();
        const subCommunityElements = await ChallengeListingPageObject.subCommunitySelection;
        // selecting Blockchain community
        const community = subCommunityElements[index];
        await community.click();
        // need to sleep to wait for ajax calls to be completed to filter using the above subtrack
        await browser.sleep(5000);
    }

    static async selectDateRange() {
        const dateRangeStartDate = await ChallengeListingPageObject.dateRangeStartDate();
        await dateRangeStartDate.click();

        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        const now = new Date();
        const currentDay = days[ now.getDay() ];
        const currentMonth = months[ now.getMonth() ];
        const currentYear = now.getFullYear();
        
        const nowPlusOne = new Date();
        nowPlusOne.setDate(nowPlusOne.getDate() + 1);

        const nextDay = days[ nowPlusOne.getDay() ];
        const nextDayMonth = months[ nowPlusOne.getMonth() ];
        const nextDayYear = nowPlusOne.getFullYear();

        const currentDayAriaText = 'Choose ' + currentDay + ', ' + currentMonth + ' ' + now.getDate() + ', ' + currentYear + ' as your check-in date. It’s available.';
        const nextDayAriaText = 'Choose ' + nextDay + ', ' + nextDayMonth + ' ' + nowPlusOne.getDate() + ', ' + nextDayYear + ' as your check-out date. It’s available.';

        await commonPageObjects.getLinkByAriaLabel(currentDayAriaText).click();
        await browser.sleep(1000);
        await commonPageObjects.getLinkByAriaLabel(nextDayAriaText).click();
        await browser.sleep(1000);
    }

    static async verifyNumberOfAppliedFilters(expectedNumberOfAppliedFilters: number) {
        const appliedFiltersText = await ChallengeListingPageObject.appliedFilters.getText();
        if (expectedNumberOfAppliedFilters === 0) {
            expect(appliedFiltersText).toEqual('Filters');
        } else {
            expect(appliedFiltersText).toEqual('Filters' + expectedNumberOfAppliedFilters);
        }
    }

    static async clearFilters() {
        await commonPageObjects.findElementByText('button', 'Clear filters').click();
    }

    static async verifySaveFilterState(enabled: boolean) {
        const tagName = await commonPageObjects.findElementByText('div', 'Save filter').getTagName();
        if (enabled) {
            expect(tagName).toEqual('button');
        } else {
            expect(tagName).toEqual('div');
        }
    }

    static async verifySortingFunctionality() {
        const until = protractor.ExpectedConditions;
        
        await browser.sleep(2000);
        const el = await ChallengeListingPageObject.selectSortOfOpenForRegistrationChallenges();
        await el.click();

        await browser.wait(until.visibilityOf(ChallengeListingPageObject.selectNumberOfSubmissions));
        await ChallengeListingPageObject.selectNumberOfSubmissions.click();

        const submissionEls = await ChallengeListingPageObject.submissionElements();
        if (submissionEls.length > 0) {
            let numberOfSubmissions = await submissionEls[0].getText();

            for (let i = 1; i < submissionEls.length; i++) {
                const text = await submissionEls[i].getText();
                expect(parseInt(numberOfSubmissions) >= parseInt(text)).toBe(true);
                numberOfSubmissions = text;
            }
        }
    }

    static async verifyViewMoreChallenges() {
        const els = await ChallengeListingPageObject.viewMoreChallenges();
        for (let i = 0; i < els.length; i++) {
            const allViewMoreLinks = await ChallengeListingPageObject.viewMoreChallenges();

            const href = await allViewMoreLinks[i].getAttribute('href');
            const splits = href.split('?bucket=');
            const bucket = splits[1];
            if (bucket == 'openForRegistration') {
                await allViewMoreLinks[i].click();
                await this.waitTillOnlyOneHeaderPresentWithText('Open for registration');
            } else if (bucket == 'ongoing') {
                await allViewMoreLinks[i].click();
                await this.waitTillOnlyOneHeaderPresentWithText('Ongoing challenges');
            }

            const allChallengesLink = await ChallengeListingPageObject.filterChallengesBy('All Challenges');
            await allChallengesLink.click();
        }
    }

    static async verifyChallengesByChallengeTag() {
        const until = protractor.ExpectedConditions;

        const tag = commonPageHelper.getChallengeTag();
        const tagText = commonPageHelper.getChallengeTagText();

        await browser.wait(until.visibilityOf(tag));
        await tag.click();
        // waiting for re-render to happen
        await browser.sleep(2000);

        const registrationChallenges = await ChallengeListingPageObject.openForRegistrationChallenges;

        for (let i = 0; i < registrationChallenges.length; i++) {
            const skills = await ChallengeListingPageObject.findSkillsForChallenge(registrationChallenges[i]);
            expect(skills.includes(tagText)).toBe(true);
        }

        const ongoingChallenges = await ChallengeListingPageObject.ongoingChallenges;

        for (let i = 0; i < ongoingChallenges.length; i++) {
            const skills = await ChallengeListingPageObject.findSkillsForChallenge(ongoingChallenges[i]);
            expect(skills.includes(tagText)).toBe(true);
        }
    }

    static async verifyChallengeCountByTogglingDevelopment() {
        const until = protractor.ExpectedConditions;

        let openForRegistrationChallenges = await ChallengeListingPageObject.filterChallengesBy('Open for registration');
        await openForRegistrationChallenges.click();
        await this.waitTillOnlyOneHeaderPresentWithText('Open for registration');

        // switch off development
        let el = await ChallengeListingPageObject.developmentSwitch();
        await el.click();
        await browser.wait(until.presenceOf(ChallengeListingPageObject.developmentSwitchTurnedOff));

        // sleeping since challenge number takes time to update
        await browser.sleep(15000);

        let openForRegistrationChallengesText = await openForRegistrationChallenges.getText();
        const afterToggleCount = openForRegistrationChallengesText.replace(/(\r\n|\n|\r)/gm, " ");
        console.log(afterToggleCount);
        let challenges = await ChallengeListingPageObject.openForRegistrationChallenges;

        expect(parseInt(afterToggleCount.split('Open for registration ')[1])).toEqual(challenges.length);

        // switch on development once again
        el = await ChallengeListingPageObject.developmentSwitch();
        await el.click();
        await browser.wait(until.presenceOf(ChallengeListingPageObject.developmentSwitchTurnedOn));
        
        // sleeping since challenge number takes time to update
        await browser.sleep(15000);

        openForRegistrationChallenges = await ChallengeListingPageObject.filterChallengesBy('Open for registration');
        openForRegistrationChallengesText = await openForRegistrationChallenges.getText();
        const beforeToggleCount = openForRegistrationChallengesText.replace(/(\r\n|\n|\r)/gm, " ");

        challenges = await ChallengeListingPageObject.openForRegistrationChallenges;
        expect(parseInt(beforeToggleCount.split('Open for registration ')[1])).toEqual(challenges.length);
    }

    static async getOngoingChallengesCount() {
        await browser.sleep(5000);
        const ongoingChallenges = await ChallengeListingPageObject.filterChallengesBy('Ongoing challenges');
        let ongoingChallengesText = await ongoingChallenges.getText();
        ongoingChallengesText = ongoingChallengesText.replace(/(\r\n|\n|\r)/gm, " ")
        console.log(ongoingChallengesText);
        const count = parseInt(ongoingChallengesText.split('Ongoing challenges ')[1]);
        return count;
    }

    static async navigateToFirstChallenge() {
        const challengeLinks = await ChallengeListingPageObject.openForRegistrationChallenges;
        await challengeLinks[0].click();
    }

    private static async verifyChallengesMatchingKeyword(filters: Array<string>) {
        // need to sleep to wait for ajax calls to be completed to filter using the above keyword
        await browser.sleep(15000);

        const challenges = await ChallengeListingPageObject.challengeLinks;
        for (let i = 0; i < challenges.length; i++) {
            const parentDiv = challenges[i].element(by.xpath('..'));
            let skills = await parentDiv.all(by.css('button[type=button]'));

            // expand skills by clicking on the hidden `+x` button
            for (let i = 0; i < skills.length; i++) {
                const skill = await skills[i];
                const text = await skill.getText();
                if (text[0] == '+') {
                    await skill.click();
                }
            }

            skills = parentDiv.all(by.css('button[type=button]'));
            const skillsText = await skills.getText();
            expect(skillsText.filter((s: string) => {
                for (let j = 0; j < filters.length; j++) {
                    if (s.includes(filters[j])) {
                        return true;
                    }
                }
                return false;
            }).length > 0).toBe(true);
        }
    }

    private static async verifyChallengesMatchingSubtrack(expectedChallengesLength: number, filters) {
        // need to sleep to wait for ajax calls to be completed to filter using the above subtrack
        await browser.sleep(15000);

        const challenges = await ChallengeListingPageObject.challengeLinks;
        let totalChallenges = 0;
        expect(challenges.length).toEqual(expectedChallengesLength);
        for (let j = 0; j < filters.length; j++) {
            const filter = filters[j];
            const matchingElements = await ChallengeListingPageObject.findAllElementsByText('div', filter.name);
            totalChallenges += matchingElements.length;
        }
        expect(totalChallenges).toEqual(expectedChallengesLength);
    }

    private static async getAllChallengesCount() {
        const allChallengesPO = await ChallengeListingPageObject.filterChallengesBy('All Challenges');
        const allChallengesText = await allChallengesPO.getText();
        const count =  parseInt(allChallengesText.replace(/(\r\n|\n|\r)/gm, " ").split('All Challenges ')[1]);

        return count;
    }
}