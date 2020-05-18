import { ElementHelper } from "topcoder-testing-lib";
import { logger } from "../../../../../../logger/logger";
import { SoftwarePage } from "./software.po";

export class SoftwarePageHelper {
  /**
   * gets the Software page object
   */
  public static setSoftwarePage(softwarePage) {
    this.softwarePageObject = softwarePage;
  }

  /**
   * Opens the software page in the browser
   */
  public static async open() {
    this.softwarePageObject = new SoftwarePage();
    await this.softwarePageObject.open();
  }

  /**
   * deletes all entries in the current tab
   */
  public static async deleteAll() {
    await this.softwarePageObject.deleteAll();
  }

  /**
   * verifyies that user can add software
   */
  public static async verifyAddSoftware(software) {
    await this.softwarePageObject.addSoftware(software);
    await this.softwarePageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", software.name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("software added: " + software.name);
  }

  /**
   * verifyies that user can edit software
   */
  public static async verifyEditSoftware(software, newSoftware) {
    await this.softwarePageObject.editSoftware(software, newSoftware);
    await this.softwarePageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", newSoftware.name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("software edited from: " + software.name + " to " + newSoftware.name);
  }

  /**
   * verifyies that user can delete software
   */
  public static async verifyDeleteSoftware(software) {
    await this.softwarePageObject.deleteSoftware(software);
    await this.softwarePageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", software.name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(false);
    logger.info("deleted software: " + software.name);
  }

  private static softwarePageObject: SoftwarePage;
}
