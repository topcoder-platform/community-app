import { logger } from '../../../../../../logger/logger';
import { SubscriptionsPage } from './subscriptions.po';
import { CommonHelper } from '../../../common-page/common.helper';

export class SubscriptionsPageHelper {
  /**
   * gets the Tools page object
   */
  public static setSubscriptionsPage(subscriptionsPage) {
    this.subscriptionsPageObject = subscriptionsPage;
  }

  /**
   * Opens the tools page in the browser
   */
  public static async open() {
    this.subscriptionsPageObject = new SubscriptionsPage();
    await this.subscriptionsPageObject.open();
  }

  /**
   * deletes all entries in the current tab
   */
  public static async deleteAll() {
    await this.subscriptionsPageObject.deleteAllSubscriptions();
  }

  /**
   * verifies that user can add subscription
   */
  public static async verifyAddSubscription(name) {
    await this.subscriptionsPageObject.addSubscription(name);
    await this.subscriptionsPageObject.waitForDefaultSuccessMessage();
    const isDisplayed = await CommonHelper.isPresent(
      CommonHelper.findElementByText('div', name)
    );
    expect(isDisplayed).toBe(true);
    logger.info('subscription added: ' + name);
  }

  /**
   * verifies that user can edit subscription
   */
  public static async verifyEditSubscription(name, newName) {
    await this.subscriptionsPageObject.editSubscription(name, newName);
    await this.subscriptionsPageObject.waitForDefaultSuccessMessage();
    const isDisplayed = await CommonHelper.isPresent(
      CommonHelper.findElementByText('div', newName)
    );
    expect(isDisplayed).toBe(true);
    logger.info('subscription edited from: ' + name + ' to ' + newName);
  }

  /**
   * verifies that user can delete subscription
   */
  public static async verifyDeleteSubscription(name) {
    await this.subscriptionsPageObject.deleteSubscription(name);
    await this.subscriptionsPageObject.waitForDefaultSuccessMessage();
    const isDisplayed = await CommonHelper.isPresent(
      CommonHelper.findElementByText('div', name)
    );
    expect(isDisplayed).toBe(false);
    logger.info('deleted subscription: ' + name);
  }

  private static subscriptionsPageObject: SubscriptionsPage;
}
