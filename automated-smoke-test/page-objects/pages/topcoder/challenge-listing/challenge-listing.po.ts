import { BrowserHelper, ElementHelper, Keys } from 'topcoder-testing-lib';
import { logger } from '../../../../logger/logger';
import { ConfigHelper } from '../../../../utils/config-helper';
import { CommonHelper } from '../common-page/common.helper';
import { TcElementImpl } from 'topcoder-testing-lib/dist/src/tc-element-impl';

export class ChallengeListingPageObject {
  /**
   * Open the Challenge Listing page
   */
  static async open() {
    await BrowserHelper.open(ConfigHelper.getChallengeListingUrl());
    logger.info('User navigated to Challenges Page');
  }

  /**
   * First challenge link
   */
  static get firstChallengeLink() {
    return ElementHelper.getElementByClassName('vir_2D');
  }

  /**
   * get challenge search box
   */
  static get challengeSearchBox() {
    return ElementHelper.getElementById('search-challenges');
  }

  /**
   * Get search challenge button
   */
  static get challengeSearchButton() {
    return ElementHelper.getElementByCss(
      'span[role=button]',
      ElementHelper.getElementByCss('label[for=search-challenges]')
    );
  }

  /**
   * Get filter button
   */
  static get filterButton() {
    return ElementHelper.getElementByClassName('tc-outline-btn');
  }

  /**
   * Get filter keywords label field
   */
  static get keywordsLabel() {
    return ElementHelper.getElementByCss('label[for=keyword-select]');
  }

  /**
   * Get filter type label field
   */
  static get typeLabel() {
    return ElementHelper.getElementByCss('label[for=type-select]');
  }

  /**
   * Get filter sub community label field
   */
  static get subCommunityLabel() {
    return ElementHelper.getElementByCss('label[for=community-select]');
  }

  /**
   * Get filter sub community label field
   */
  static get subCommunityDropdown() {
    return ElementHelper.getElementById('react-select-3--value-item');
  }

  /**
   * Get filter keywords input field
   */
  static get keywordInput() {
    return ElementHelper.getElementById('keyword-select');
  }

  /**
   * Get challenge link
   */
  static get challengeLinks() {
    return ElementHelper.getAllElementsByClassName('vir_2D');
  }

  /**
   * Get filter type field
   */
  static get typeInput() {
    return ElementHelper.getElementById('type-select');
  }

  /**
   * Get view more challenges button
   */
  static get viewMoreChallenges() {
    return ElementHelper.getAllElementsByXPath(
      '//a[contains(text(), "View more challenges")]'
    );
  }

  /**
   * Get filter challenge by container
   */
  static async filterChallengesBy(filter: string) {
    const els = await ElementHelper.getAllElementsByXPath(
      '//div[contains(text(), "' + filter + '")]'
    );
    return els[1];
  }

  /**
   * Get all elements that contain text
   * @param elementType element type
   * @param text text to contain
   */
  static findAllElementsByText(elementType: string, text: string) {
    return ElementHelper.getAllElementsByXPath(
      '//' + elementType + '[contains(text(), "' + text + '")]'
    );
  }

  /**
   * get start date range field
   */
  static async dateRangeStartDate() {
    const els = await ElementHelper.getAllElementsByClassName(
      'DateInput_input_1'
    );
    return els[2];
  }

  /**
   * get apply filters button
   */
  static get appliedFilters() {
    return ElementHelper.getElementByClassName('tc-outline-btn');
  }

  /**
   * get remove tag
   */
  static async allRemoveTags() {
    const crossTags = await this.findAllElementsByText('span', '×');
    const filteredCrossTags = [];
    for (let i = 0; i < crossTags.length; i++) {
      const className = await crossTags[i].getAttribute('class');
      if (className === 'Select-value-icon') {
        filteredCrossTags.push(crossTags[i]);
      }
    }
    return filteredCrossTags;
  }

  /**
   * select sort of open for registration challenges
   */
  static async selectSortOfOpenForRegistrationChallenges() {
    const els = await ElementHelper.getAllElementsByClassName('Select--single');
    return els[1];
  }

  /**
   * Get number of submissions
   */
  static get selectNumberOfSubmissions() {
    return CommonHelper.findElementByText('div', '# of submissions');
  }

  /**
   * Get title a-z sort option
   */
  static get selectSortByTitleOption() {
    return CommonHelper.findElementByText('div', 'Title A-Z');
  }

  /**
   * Get submission elements
   */
  static async submissionElements() {
    const headers = await CommonHelper.h2Fields;
    return ElementHelper.getAllElementsByClassName(
      '_2Kuu31',
      ElementHelper.getElementByXPath(
        '..',
        ElementHelper.getElementByXPath('..', headers[0])
      )
    );
  }

  /**
   * Get submission title
   */
  static async submissionTitle() {
    const headers = await CommonHelper.h2Fields;
    return ElementHelper.getAllElementsByClassName('vir_2D', headers[0]);
  }

  /**
   * Get challenges by type
   * @param type type of challenges
   */
  private static getChallenges(type: string) {
    return ElementHelper.getAllElementsByClassName(
      'vir_2D',
      ElementHelper.getElementByXPath(
        '..',
        ElementHelper.getElementByXPath(
          '..',
          ElementHelper.getElementByXPath(
            '//h2[contains(text(), "' + type + '")]'
          )
        )
      )
    );
  }

  /**
   * Get challenge tag element
   * @param challengeTag challenge tag
   */
  static getChallengeTag(challengeTag: string) {
    return ElementHelper.getElementByButtonText(challengeTag);
  }

  /**
   * Get open for registration challenges
   */
  static get openForRegistrationChallenges() {
    return this.getChallenges('Open for registration');
  }

  /**
   * Get skills of challenge
   * @param challenge challenge element
   */
  static async findSkillsForChallenge(challenge: TcElementImpl) {
    const buttons = await ElementHelper.getAllElementsByTag(
      'button',
      ElementHelper.getElementByXPath('../..', challenge)
    );
    const skills = [];
    for (let j = 0; j < buttons.length; j++) {
      const skill = await buttons[j].getText();
      skills.push(skill);
    }
    return skills;
  }

  /**
   * Get on going challenges
   */
  static get ongoingChallenges() {
    return this.getChallenges('Ongoing challenges');
  }

  /**
   * Get development switch button
   */
  static async developmentSwitch() {
    const els = await ElementHelper.getAllElementsByCss('div[role="switch"]');
    return ElementHelper.getElementByTag('div', els[1]);
  }

  /**
   * Get development switch turned off button
   */
  static get developmentSwitchTurnedOff() {
    return CommonHelper.getLinkByAriaLabel(
      'Development toggle button pressed Off'
    );
  }

  /**
   * Get development switch turned on button
   */
  static get developmentSwitchTurnedOn() {
    return CommonHelper.getLinkByAriaLabel(
      'Development toggle button pressed On'
    );
  }

  /**
   * get review status elements
   */
  static async reviewStatusElements() {
    const headers = await CommonHelper.h2Fields;

    const elements = ElementHelper.getAllElementsByClassName(
      '_1YwVym',
      ElementHelper.getElementByXPath(
        '..',
        ElementHelper.getElementByXPath('..', headers[0])
      )
    );

    return elements;
  }

  /**
   * get design switch button
   */
  static async designSwitch() {
    const els = await ElementHelper.getAllElementsByCss('div[role="switch"]');
    return ElementHelper.getElementByTag('div', els[0]);
  }

  /**
   * get data science switch button
   */
  static async dataScienceSwitch() {
    const els = await ElementHelper.getAllElementsByCss('div[role="switch"]');
    return ElementHelper.getElementByTag('div', els[2]);
  }

  /**
   * get QA switch button
   */
  static async qaSwitch() {
    const els = await ElementHelper.getAllElementsByCss('div[role="switch"]');
    return ElementHelper.getElementByTag('div', els[3]);
  }

  /**
   * get design switch turned off
   */
  static get designSwitchTurnedOff() {
    return CommonHelper.getLinkByAriaLabel('Design toggle button pressed Off');
  }

  /**
   * get data science switch turned off button
   */
  static get dataScienceSwitchTurnedOff() {
    return CommonHelper.getLinkByAriaLabel(
      'Data Science toggle button pressed Off'
    );
  }

  /**
   * get QA switch turned off button
   */
  static get qaSwitchTurnedOff() {
    return CommonHelper.getLinkByAriaLabel(
      'QA toggle button pressed Off'
    );
  }

  /**
   * Get rss link
   */
  static async rssLink() {
    const els = await ElementHelper.getAllElementsByXPath(
      "//a[contains(text(),'Get the RSS feed')]"
    );
    return els[1];
  }

  /**
   * Get link under rss link
   * @param label label of link
   */
  static async getLinkUnderRss(label: string) {
    const els = await CommonHelper.getAllLinksByAriaLabel(label);
    return els[1];
  }
}
