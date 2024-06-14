import { BrowserHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../../../logger/logger';
import { PaymentPage } from './payment.po';
import { ConfigHelper } from '../../../../../../utils/config-helper';

export class PaymentPageHelper {
  /**
   * sets the Payment page object
   */
  public static setPaymentPage(paymentPage) {
    this.paymentPageObject = paymentPage;
  }

  /**
   * Opens the payment page in the browser
   */
  public static async open() {
    this.paymentPageObject = new PaymentPage();
    await this.paymentPageObject.open();
  }

  /**
   * Verifies the payment setting page
   */
  public static async verifyPaymentSetting() {
    const windowHandles = await BrowserHelper.getAllWindowHandles();
    for (let i = 0; i < windowHandles.length; i++) {
      await BrowserHelper.switchToWindow(windowHandles[i]);
      await BrowserHelper.sleep(2000)
      if (await BrowserHelper.getCurrentUrl() == ConfigHelper.getPaymentSettingUrl()) {
        logger.info('redirected to payment settings page');
        return
      }
      await BrowserHelper.switchToWindow(windowHandles[0]);
    }
  }
  private static paymentPageObject: PaymentPage;
}
