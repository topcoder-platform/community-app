import { ElementHelper } from "topcoder-testing-lib";
import { logger } from "../../../../../../logger/logger";
import { EducationPage } from "./education.po";

export class EducationPageHelper {

  /**
   * sets the Education page object
   */
  public static setEducationPage(educationPage) {
    this.educationPageObject = educationPage;
  }

  /**
   * Opens the education page in the browser
   */
  public static async open() {
    this.educationPageObject = new EducationPage();
    await this.educationPageObject.open();
  }

  /**
   * Deletes all the educations already added till now
   */
  public static async deleteAll() {
    await this.educationPageObject.deleteAll();
  }
  
  /**
   * Verifies that user can add education
   * @param education - education object to be used to fill data
   */
  public static async verifyAddEducation(education) {
    const name = this.getName(education);
    await this.educationPageObject.addEducation(education);
    await this.educationPageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("education added: " + name);
  }

  /**
   * Verifies that user can update the education
   * @param education - education object holding old values
   * @param newEducation - education object holding the new values
   */
  public static async verifyEditEducation(education, newEducation) {
    const name = this.getName(education);
    const newName = this.getName(newEducation);

    await this.educationPageObject.editEducation(education, newEducation);
    await this.educationPageObject.waitForSuccessMsg();
    
    const el = await ElementHelper.getTagElementContainingText("div", newName);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(true);
    logger.info("education edited from: " + name + " to " + newName);
  }

  /**
   * Verifies user can delete education
   * @param education - education object
   */
  public static async verifyDeleteEducation(education) {
    const name = this.getName(education);
    await this.educationPageObject.deleteEducation(education);
    await this.educationPageObject.waitForSuccessMsg();
    const el = await ElementHelper.getTagElementContainingText("div", name);
    const isDisplayed = await el.isPresent();
    expect(isDisplayed).toBe(false);
    logger.info("deleted education: " + name);
  }

  /**
   * gets the name from the education object
   * @param education - object representing education
   */
  private static getName(education) {
    return education.collegeName;
  }

  private static educationPageObject: EducationPage;
}