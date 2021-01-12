import { ElementHelper } from 'topcoder-testing-lib';
import {
  ConfigHelper,
  ChallengeCardInfo,
} from '../../../../utils/config-helper';
import { CommonHelper } from '../common-page/common.helper';
import { TcElementImpl } from 'topcoder-testing-lib/dist/src/tc-element-impl';

export class MyDashboardPageObject {
  /**
   * Get my dashboard url
   */
  static get myDashboardUrl() {
    return ConfigHelper.getMyDashboardConfig().url;
  }

  /**
   * Get my challenge card info
   */
  static get myChallengeCardInfo() {
    return ConfigHelper.getMyDashboardConfig().challenge;
  }
  /**
   * Get my community info
   */
  static get myCommunityInfo() {
    return ConfigHelper.getMyDashboardConfig().community;
  }

  /**
   * Get challenge card
   */
  static get challengeCard() {
    return ElementHelper.getElementByClassName('h5vOao');
  }

  /**
   * Get community card
   */
  static get communityCard() {
    return ElementHelper.getElementByClassName('_2PpTJv');
  }

  /**
   * Get practice on past problems card
   */
  static get practiceOnPastProblems() {
    return CommonHelper.findElementByText('h2', 'Practice on past problems');
  }

  /**
   * Get dasbhoard tab
   * @param tabName name of tab
   */
  static getTabWithName(tabName: string) {
    return ElementHelper.getElementByXPath(
      '//div[contains(text(), "' + tabName + '")]/parent::div'
    );
  }

  /**
   * Get submit button
   * @param parent parent element
   */
  static getSubmitButton(parent: TcElementImpl) {
    return CommonHelper.findElementByText('a', 'Submit', parent);
  }

  /**
   * Get all challenge card info
   */
  static async getAllChallengeCardsInfo(): Promise<ChallengeCardInfo[]> {
    const challengeCards = await ElementHelper.getAllElementsByClassName(
      'h5vOao'
    );
    const cardInfos: ChallengeCardInfo[] = await Promise.all(
      challengeCards.map(async (card) => {
        const name = await ElementHelper.getElementByCss(
          'a._13aAhb',
          card
        ).getText();
        const currentPhase = await ElementHelper.getElementByTag(
          'h3'
        ).getText();
        const isHaveSubmitButton = await CommonHelper.isDisplayed(
          this.getSubmitButton(card)
        );
        const linkToSubmit = isHaveSubmitButton
          ? await this.getSubmitButton(card).getAttribute('href')
          : '';
        const userRole = await ElementHelper.getElementByClassName(
          '_2zSyAb',
          card
        ).getText();
        const cardInfo = {
          name,
          currentPhase,
          linkToSubmit,
          userRole,
        };
        return cardInfo;
      })
    );
    return cardInfos;
  }

  /**
   * Get all communities
   */
  static async getAllComunities(): Promise<string[]> {
    const communityCards = await ElementHelper.getAllElementsByClassName(
      '_2PpTJv'
    );
    const communities: string[] = await Promise.all(
      communityCards.map(async (card) => {
        const name = await ElementHelper.getElementByClassName(
          'lO3iws',
          card
        ).getText();
        return name;
      })
    );
    return communities;
  }

  /**
   * Get learn more button of my community
   */
  static async getLearnMoreButtonOfMyCommunity(): Promise<TcElementImpl> {
    const communityCards = await ElementHelper.getAllElementsByClassName(
      '_2PpTJv'
    );
    let learnMoreButton: TcElementImpl;
    await Promise.all(
      communityCards.map(async (card) => {
        const name = await ElementHelper.getElementByClassName(
          'lO3iws',
          card
        ).getText();
        if (name === this.myCommunityInfo.name) {
          learnMoreButton = CommonHelper.findElementByText(
            'a',
            'Learn more',
            card
          );
        }
      })
    );
    return learnMoreButton;
  }
}
