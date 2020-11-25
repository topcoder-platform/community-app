import { logger } from '../../../../../../logger/logger';
import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { SettingsPage } from '../../settings.po';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { TcElementImpl } from 'topcoder-testing-lib/dist/src/tc-element-impl';

export class EducationPage extends SettingsPage {
  /**
   * Gets the Education page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    await this.switchTab('education');
    logger.info('User navigated to Education Page');
  }

  /**
   * Delete all education
   */
  public async deleteAllEducation() {
    await this.deleteAll('Your education');
  }

  /**
   * Gets the school/college input field
   */
  private get schoolCollegeName() {
    return ElementHelper.getElementById('schoolCollegeName');
  }

  /**
   * Gets the major input field
   */
  private get major() {
    return ElementHelper.getElementById('major');
  }

  /**
   * Gets the education start date input field
   */
  private get startDate() {
    return ElementHelper.getElementById('date-from1');
  }

  /**
   * Gets the education end date field
   */
  private get endDate() {
    return ElementHelper.getElementById('date-to1');
  }

  /**
   * Gets the education gruadated field
   */
  private get graduatedLabel() {
    return ElementHelper.getElementByCss('[for="graduated"]');
  }

  /**
   * Adds the given education by setting the required fields
   * @param education - object representation of education
   */
  public async addEducation(education) {
    BrowserHelper.sleep(1000);
    await this.setCollegeName(education.collegeName);
    await this.setMajor(education.major);
    await this.setCollegeDate(this.startDate, education.fromDate);
    await this.setCollegeDate(this.endDate, education.toDate);
    if (education.graduated) {
      await this.setGraduated();
    }
    await this.getAddButton('education').click();
  }

  /**
   * Updates the added education by editing some fields
   * @param education - old education object
   * @param newEducation - new education object
   */
  public async editEducation(education, newEducation) {
    await this.getEditIconbyName(education.collegeName).click();
    await this.setCollegeName(newEducation.collegeName);
    await this.getEditButton('education').click();
  }

  /**
   * Deletes educaction
   * @param education
   */
  public async deleteEducation(education) {
    await this.getDeleteIconbyName(education.collegeName).click();
    await this.deleteConfirmation.click();
  }

  /**
   * Sets the college field
   * @param collegeName
   */
  private async setCollegeName(collegeName) {
    await BrowserHelper.waitUntilClickableOf(this.schoolCollegeName);
    await this.schoolCollegeName.clear();
    await this.schoolCollegeName.sendKeys(collegeName);
  }

  /**
   * Sets the major field
   * @param major
   */
  private async setMajor(major) {
    await this.major.clear();
    await this.major.sendKeys(major);
  }

  /**
   * Generic method to set the college date (startDate or endDate)
   * @param el - tcElement representing the field
   * @param value - value of the startDate or endDate
   */
  private async setCollegeDate(el: TcElementImpl, value: string) {
    await BrowserHelper.executeScript(
      'arguments[0].removeAttribute("readonly");',
      el
    );
    await BrowserHelper.sleep(1000);
    await this.startDate.sendKeys(value);
    await BrowserHelper.sleep(1000);
  }

  /**
   * Sets the graduated field by clicking the checkbox
   */
  private async setGraduated() {
    await this.graduatedLabel.click();
  }
}
