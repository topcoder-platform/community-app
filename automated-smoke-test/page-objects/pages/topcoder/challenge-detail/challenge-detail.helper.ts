import { ConfigHelper } from '../../../../utils/config-helper';
import { CommonHelper } from '../common-page/common.helper';
import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { ChallengeDetailPageObject } from './challenge-detail.po';
import { logger } from '../../../../logger/logger';

export class ChallengeDetailPageHelper {
  /**
   * Opens the Challenge detail page
   */
  public static async open() {
    await ChallengeDetailPageObject.open();
    await this.waitForLoadingNewChallengInfo();
  }

  /**
   * wait for loading challenge info
   */
  static async waitForLoadingNewChallengInfo() {
    await CommonHelper.waitUntilVisibilityOf(
      () => ElementHelper.getElementByTag('h1'),
      'Wait for h1 tag',
      true
    );
    await CommonHelper.waitUntilVisibilityOf(
      () => ChallengeDetailPageObject.backButton,
      'Wait for challenge detail backbutton',
      true
    );
  }

  /**
   * click on back button
   */
  static async clickOnBackButton() {
    await this.waitForLoadingNewChallengInfo();
    await ChallengeDetailPageObject.backButton.click();
    logger.info('Back button pressed on challenge detail page');
  }

  /**
   * accept terms if it show term popup
   */
  private static async acceptTermsIfNeeded() {
    const termsAgreementButton = CommonHelper.findElementByText(
      'button',
      'I Agree'
    );
    const termsAgreementButtonVisibility = await CommonHelper.isDisplayed(
      termsAgreementButton
    );
    if (termsAgreementButtonVisibility) {
      await termsAgreementButton.click();
    }
  }

  /**
   * register if not already registered
   */
  static async registerIfNotAlreadyRegistered() {
    const registerButton = CommonHelper.findElementByText('button', 'Register');
    const isRegisterButtonPresent = await CommonHelper.isDisplayed(
      registerButton
    );
    if (!isRegisterButtonPresent) {
      return;
    }

    await CommonHelper.findElementByText('button', 'Register').click();

    await this.acceptTermsIfNeeded();

    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText('button', 'Unregister'),
      'Wait for unregister button',
      true
    );
    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText('a', 'CHALLENGE FORUM'),
      'Wait for challenge forum tab',
      false
    );
  }

  /**
   * unregister if already registerd
   */
  static async unregisterIfAlreadyRegistered() {
    const registerButton = CommonHelper.findElementByText(
      'button',
      'Unregister'
    );
    const isRegisterButtonPresent = await CommonHelper.isDisplayed(
      registerButton
    );
    if (!isRegisterButtonPresent) {
      return;
    }

    await CommonHelper.findElementByText('button', 'Unregister').click();

    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText('button', 'Register'),
      'Wait for Register',
      true
    );
  }

  /**
   * register challenge
   */
  static async register() {
    const registerButton = CommonHelper.findElementByText('button', 'Register');
    const isRegisterButtonPresent = await CommonHelper.isDisplayed(
      registerButton
    );
    if (!isRegisterButtonPresent) {
      const unregisterButton = CommonHelper.findElementByText(
        'button',
        'Unregister'
      );
      const isUnregisterButtonPresent = CommonHelper.isDisplayed(
        unregisterButton
      );
      if (isUnregisterButtonPresent) {
        await unregisterButton.click();
        await CommonHelper.waitUntilVisibilityOf(
          () => CommonHelper.findElementByText('button', 'Register'),
          'Wait for Register',
          false
        );
      }
    }

    await CommonHelper.findElementByText('button', 'Register').click();

    await this.acceptTermsIfNeeded();

    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText('button', 'Unregister'),
      'Wait for Unregister',
      false
    );
    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText('a', 'CHALLENGE FORUM'),
      'Wait for challenge forum',
      false
    );
  }

  /**
   * unregister challenge
   */
  static async unregister() {
    const unregisterButton = CommonHelper.findElementByText(
      'button',
      'Unregister'
    );
    const isUnregisterButtonPresent = CommonHelper.isDisplayed(
      unregisterButton
    );
    if (isUnregisterButtonPresent) {
      await unregisterButton.click();
      await CommonHelper.waitUntilVisibilityOf(
        () => CommonHelper.findElementByText('button', 'Register'),
        'Wait for Register',
        false
      );
    }

    const registerButton = CommonHelper.findElementByText('button', 'Register');
    const isRegisterButtonPresent = await CommonHelper.isDisplayed(
      registerButton
    );
    expect(isRegisterButtonPresent).toBe(true);
  }

  /**
   * Click on terms link
   */
  static async clickOnTermsLink() {
    await CommonHelper.waitUntilVisibilityOf(
      () =>
        CommonHelper.findElementByText(
          'a',
          ConfigHelper.getChallengeDetail().termsLinkText
        ),
      'wait for term link',
      false
    );
    await BrowserHelper.executeScript('arguments[0].scrollIntoView();', CommonHelper.findElementByText(
      'a',
      ConfigHelper.getChallengeDetail().termsLinkText
    ));
    await CommonHelper.findElementByText(
      'a',
      ConfigHelper.getChallengeDetail().termsLinkText
    ).click();
    logger.info('Terms link clicked');
  }

  /**
   * verify terms authentication error
   */
  static async verifyTermsAuthenticationError() {
    await CommonHelper.waitUntilVisibilityOf(
      () =>
        CommonHelper.findElementByText(
          'div',
          'Authentication credential was missing.'
        ),
      'Wait for error term message',
      true
    );

    const url = await BrowserHelper.getCurrentUrl();
    expect(url).toEqual(ConfigHelper.getChallengeDetail().termUrl);
  }

  /**
   * click on submit button
   */
  static async clickOnSubmitButton() {
    await CommonHelper.findElementByText('a', 'Submit').click();
    logger.info('Submit button clicked');
  }

  /**
   * upload submission
   */
  static async uploadSubmission() {
    await this.clickOnSubmitButton();

    await CommonHelper.waitUntilVisibilityOf(
      () => ChallengeDetailPageObject.pickFile,
      'Wait for pick file',
      false
    );

    await ChallengeDetailPageObject.pickFile.click();

    await CommonHelper.waitUntilVisibilityOf(
      () => ChallengeDetailPageObject.fileModal,
      'Wait for file modal',
      false
    );
  }

  /**
   * verify challenge forum link
   */
  static async verifyChallengeForumLink() {
    const href = await CommonHelper.findElementByText(
      'a',
      'CHALLENGE FORUM'
    ).getAttribute('href');
    expect(href).toEqual(ConfigHelper.getChallengeDetail().forumUrl);
  }

  /**
   * verify submission page
   */
  static async verifySubmissionPage() {
    await CommonHelper.waitUntilVisibilityOf(
      () => ChallengeDetailPageObject.submissionContainer,
      'Wait for submission container',
      false
    );
    const browserUrl = await BrowserHelper.getCurrentUrl();
    expect(browserUrl).toEqual(ConfigHelper.getChallengeDetail().submissionUrl);
    logger.info('User redirected to submission page');
  }

  /**
   * verify challenge deadlines
   */
  static async verifyDeadlines() {
    await CommonHelper.findElementByText('span', 'Show Deadlines').click();

    const isDisplayed = await CommonHelper.isDisplayed(
      CommonHelper.findElementByText('span', 'Hide Deadlines')
    );
    expect(isDisplayed).toBe(true);

    const tabPanel = ChallengeDetailPageObject.tabPanel;
    const timezone = await ElementHelper.getElementByTag(
      'p',
      tabPanel
    ).getText();
    expect(timezone.startsWith('Timezone')).toBe(true);

    const childDivs = await ElementHelper.getAllElementsByTag('div', tabPanel);
    const expectedDeadlines = [
      'Started',
      'Registration',
      'Submission',
      'Winners',
    ];
    for (let i = 0; i < childDivs.length; i++) {
      const text = await childDivs[i].getText();
      expect(text.startsWith(expectedDeadlines[i])).toBe(true);
    }
  }

  /**
   * switch to details tab
   */
  static async switchToDetailsTab() {
    await CommonHelper.findElementByText('a', 'DETAILS').click();
    logger.info('Switched to Details tab');
  }

  /**
   * get all challenge detail tabs
   */
  static async getAllTabs() {
    const tabs = await ElementHelper.getAllElementsByTag(
      'a',
      ElementHelper.getElementByXPath(
        '..',
        CommonHelper.findElementByText('a', 'DETAILS')
      )
    );
    return tabs;
  }

  /**
   * verify challenge detail tab
   */
  static async verifyDetailsTab() {
    const challengeOverviewEl = CommonHelper.findElementByText(
      'h2',
      'Challenge Overview'
    );
    const isDisplayed = await CommonHelper.isDisplayed(challengeOverviewEl);
    expect(isDisplayed).toBe(true);

    const tabs = await this.getAllTabs();
    const ariaLabel = await tabs[0].getAttribute('aria-selected');
    expect(ariaLabel).toBe('true');
  }

  /**
   * swtich to registrants tab
   */
  static async switchToRegistrantsTab() {
    const tabs = await this.getAllTabs();
    await tabs[1].click();
    logger.info('Switched to Registrants tab');
  }

  /**
   * verify registrants tab
   */
  static async verifyRegistrantsTab() {
    const isDisplayed = await CommonHelper.isDisplayed(
      ChallengeDetailPageObject.registrantsTable
    );
    expect(isDisplayed).toBe(true);

    const tabs = await this.getAllTabs();
    const ariaLabel = await tabs[1].getAttribute('aria-selected');
    expect(ariaLabel).toBe('true');
  }

  /**
   * switch to submissions tab
   */
  static async switchToSubmissionsTab() {
    const tabs = await this.getAllTabs();
    await tabs[2].click();
    logger.info('Switched to Submissions tab');
  }

  /**
   * verify submissions tab
   */
  static async verifySubmissionsTab() {
    const isUsernameDisplayed = await CommonHelper.isDisplayed(
      CommonHelper.findElementByText('span', 'Username')
    );
    expect(isUsernameDisplayed).toBe(true);

    const isSubmissionDateDisplayed = await CommonHelper.isDisplayed(
      CommonHelper.findElementByText('span', 'Submission Date')
    );
    expect(isSubmissionDateDisplayed).toBe(true);

    const tabs = await this.getAllTabs();
    const ariaLabel = await tabs[2].getAttribute('aria-selected');
    expect(ariaLabel).toBe('true');
  }

  /**
   * click on review scorecard link
   */
  static async clickOnReviewScorecardLink() {
    await CommonHelper.findElementByText('a', 'Review Scorecard').click();
    logger.info('Review Scorecard link clicked');
  }

  /**
   * verify scorecard page
   */
  static async verifyScorecardPage() {
    await CommonHelper.waitUntilVisibilityOf(
      () => ChallengeDetailPageObject.scoreCardContainer,
      'Wait for scorecard container',
      true
    );
    const browserUrl = await BrowserHelper.getCurrentUrl();
    expect(browserUrl).toEqual(ConfigHelper.getChallengeDetail().scorecardUrl);
    logger.info('User redirected to scorecard page');
  }

  /**
   * verify terms page
   */
  static async verifyTermsPage() {
    await CommonHelper.waitUntilVisibilityOf(
      () => ChallengeDetailPageObject.termContainer,
      'Wait for term container',
      false
    );
    const browserUrl = await BrowserHelper.getCurrentUrl();
    expect(browserUrl).toEqual(ConfigHelper.getChallengeDetail().termUrl);
    logger.info('User redirected to terms page');
  }
}
