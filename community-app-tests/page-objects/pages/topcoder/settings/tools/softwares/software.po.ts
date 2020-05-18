import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { logger } from "../../../../../../logger/logger";
import { ConfigHelper } from "../../../../../../utils/config-helper";
import { SettingsPage } from "../../settings.po";

export class SoftwarePage extends SettingsPage {
  /**
   * Gets the Sofware page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getToolsUrl());
    this.switchTab("software");
    logger.info("User navigated to Software Page");
  }

  /**
   * Gets the software type input
   */
  private get softwareType() {
    return ElementHelper.getElementByCss('[role="combobox"]');
  }

  /**
   * Gets the software name textbox
   */
  private get softwareName() {
    return ElementHelper.getElementById("name");
  }

  /**
   * Adds a software with the provided name
   * @param {String} name
   */
  public async addSoftware(software) {
    await this.setSoftwareType(software.type)
    await this.setSoftwareName(software.name);
    await this.getAddButton("software").click();
  }

  /**
   * Edits the given software name with the new provided name
   * @param {String} name
   * @param {String} newname
   */
  public async editSoftware(software, newSoftware) {
    const name = software.name;
    await this.getEditIconbyName(name).click();
    await this.setSoftwareType(newSoftware.type);
    await this.setSoftwareName(newSoftware.name);
    await this.getEditButton("software").click();
  }

  /**
   * Deletes the given software
   * @param {String} name
   */
  public async deleteSoftware(software) {
    await this.getDeleteIconbyName(software.name).click();
    await this.deleteConfirmation.click();
  }

  /**
   * Fills the software type input by selecting from the provided options
   * @param {string} type - to which software type is set 
   */
  private async setSoftwareType(type) {
    await this.performSelection(this.softwareType, type);
  }

  /**
   * Fills the software name textbox with given name
   * @param {String} name
   */
  private async setSoftwareName(name: string) {
    await this.softwareName.clear();
    await this.softwareName.sendKeys(name);
  }
}
