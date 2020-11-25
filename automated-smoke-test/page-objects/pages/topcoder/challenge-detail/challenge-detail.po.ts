import { BrowserHelper, ElementHelper, Keys } from 'topcoder-testing-lib';
import { logger } from '../../../../logger/logger';
import { ConfigHelper } from '../../../../utils/config-helper';
import { CommonHelper } from '../common-page/common.helper';

export class ChallengeDetailPageObject {
  /**
   * Open the Challenge detail page
   */
  static async open() {
    await BrowserHelper.open(ConfigHelper.getChallengeDetail().url);
    logger.info('User navigated to Challenge Detail Page');
  }

  /**
   * back button
   */
  static get backButton() {
    return CommonHelper.getLinkByAriaLabel('Back to challenge list');
  }

  /**
   * pick file link
   */
  static get pickFile() {
    return CommonHelper.getLinkByAriaLabel('Select file to upload');
  }

  /**
   * get file modal
   */
  static get fileModal() {
    return ElementHelper.getElementByClassName('fsp-picker');
  }

  /**
   * get submission container
   */
  static get submissionContainer() {
    return ElementHelper.getElementById('react-view');
  }

  /**
   * get tab panel
   */
  static get tabPanel() {
    return ElementHelper.getElementByCss('[role="tabpanel"]');
  }

  /**
   * get registrants table
   */
  static get registrantsTable() {
    return CommonHelper.getLinkByAriaLabel('Registrants');
  }

  /**
   * get scorecard cotnainer
   */
  static get scoreCardContainer() {
    return ElementHelper.getElementById('mainTabs');
  }

  /**
   * Get term container
   */
  static get termContainer() {
    return CommonHelper.findElementByText(
      'h3',
      'Acceptance of Terms and Conditions'
    );
  }
}
