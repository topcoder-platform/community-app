import { logger } from "../../../../../../logger/logger";
import { LinkedAccountPage } from "./linked-account.po";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";

export class LinkedAccountPageHelper {
  /**
   * Opens the linked account page in the browser
   */
  public static async open() {
    this.linkedAccountPageObject = new LinkedAccountPage();
    await this.linkedAccountPageObject.open();
  }

  /**
   * Delete all linked accounts
   */
  public static async deleteAll() {
    await BrowserHelper.sleep(3000);
    await this.linkedAccountPageObject.deleteAll();
  }

  /**
   * Add linked account
   * @param linkedAccount 
   */
  public static async verifyAddLink(linkedAccount) {
    await this.linkedAccountPageObject.addLinkedAccount(linkedAccount);
    await this.linkedAccountPageObject.waitForSuccessMsg();
    
    const text = ('http://' + linkedAccount).toUpperCase();
    const isDisplayed = await ElementHelper.getElementByLinkText(text).isDisplayed();
    expect(isDisplayed).toBe(true);
    logger.info(`Linked account ${linkedAccount} added`);
  }

  /**
   * Verify deletion of linked account 
   * @param linkedAccount 
   */
  public static async verifyDeleteLink(linkedAccount) {
    await this.linkedAccountPageObject.delete();
    const text = ('http://' + linkedAccount).toUpperCase();
    const els = await ElementHelper.getAllElementsByLinkText(text);
    expect(els.length).toBe(0);
    logger.info(`Linked account ${linkedAccount} deleted`);
  }

  private static linkedAccountPageObject: LinkedAccountPage;

}