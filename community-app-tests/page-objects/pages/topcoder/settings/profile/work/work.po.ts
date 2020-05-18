import { logger } from "../../../../../../logger/logger";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { SettingsPage } from "../../settings.po";
import { ConfigHelper } from "../../../../../../utils/config-helper";
import { TcElementImpl } from "topcoder-testing-lib/dist/src/tc-element-impl";

export class WorkPage extends SettingsPage {

  /**
   * Gets the Work page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    this.switchTab("work");
    logger.info("User navigated to Work Page");
  }

  /**
   * Gets the company field
   */
  private get company() {
    return ElementHelper.getElementById('company');
  }

  /**
   * Gets the industry field
   */
  private get industry() {
    return ElementHelper.getElementById('industry');
  }

  /**
   * Gets the position field
   */
  private get position() {
    return ElementHelper.getElementById('position');
  }

  /**
   * Gets the city field
   */
  private get city() {
    return ElementHelper.getElementById('cityTown');
  }

  /**
   * Gets the start date field
   */
  private get startDate() {
    return ElementHelper.getElementById('date-from1');
  }

  /**
   * Gets the end date field
   */
  private get endDate() {
    return ElementHelper.getElementById('date-to1');
  }

  /**
   * Gets the currently working here field
   */
  private get currentlyWorking() {
    return ElementHelper.getElementByCss('[for="working"]');
  }

  /**
   * Adds the work experience
   * @param work
   */
  public async addWork(work) {
    await BrowserHelper.sleep(1000);
    await this.setCompany(work.company);
    await this.setPosition(work.position);
    await this.setIndustry(work.industry);
    await this.setCity(work.city);
    await this.setWorkDate(this.startDate, work.startDate);
    if (work.currentlyWorking) {
      await this.setCurrentlyWorking();
    }
    await this.getAddButton('workplace').click();
  }

  /**
   * Updates the work experience
   * @param work - object representation of already added work experience
   * @param newWork - object representation of newly added work experience
   */
  public async editWork(work, newWork) {
    await BrowserHelper.waitUntilVisibilityOf(
      this.getEditIconbyName(this.getName(work))
    );
    await this.getEditIconbyName(this.getName(work)).click();
    await BrowserHelper.sleep(1000);
    await this.setCompany(newWork.company);
    await this.getEditButton('workplace').click();
  }

  /**
   * Deletes work experience
   * @param work 
   */
  public async deleteWork(work) {
    await BrowserHelper.waitUntilVisibilityOf(
      this.getDeleteIconbyName(this.getName(work))
    );
    await this.getDeleteIconbyName(this.getName(work)).click();
    await this.deleteConfirmation.click();    
  }

  /**
   * Sets the company
   * @param company 
   */
  private async setCompany(company) {
    await BrowserHelper.waitUntilClickableOf(this.company);
    await this.company.clear();
    await this.company.sendKeys(company);
  }

  /**
   * Sets the position
   * @param position 
   */
  private async setPosition(position) {
    await this.position.clear();
    await this.position.sendKeys(position);
  }

  /**
   * Sets the industry
   * @param industry 
   */
  private async setIndustry(industry) {
    await this.industry.clear();
    await this.industry.sendKeys(industry);
  }

  /**
   * Sets the city
   * @param city 
   */
  private async setCity(city) {
    await this.city.clear();
    await this.city.sendKeys(city);
  }

  /**
   * Generic method to set the work date (startDate/endDate)
   */
  private async setWorkDate(el: TcElementImpl, value: string) {
    await BrowserHelper.executeScript('arguments[0].removeAttribute("readonly");', el);
    await BrowserHelper.sleep(1000);
    await this.startDate.sendKeys(value);
    await BrowserHelper.sleep(1000);
  }

  /**
   * Checks the currently working here checkbox
   */
  private async setCurrentlyWorking() {
    await this.currentlyWorking.click();
  }

  /**
   * Gets the name used to query the UI basis the work object
   * @param work 
   */
  public getName(work) {
    return `${work.company} | ${work.industry} | ${work.city}`;
  }
}