import { logger } from "../../../../../../logger/logger";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { SettingsPage } from "../../settings.po";
import { ConfigHelper } from "../../../../../../utils/config-helper";

export class HobbyPage extends SettingsPage {

  /**
   * Gets the Hobby page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    this.switchTab("hobbies");
    logger.info("User navigated to Hobbies Page");
  }

  /**
   * Gets the hobby name field 
   */
  private get name() {
    return ElementHelper.getElementById('hobby');
  }

  /**
   * Gets the hobby description field
   */
  private get description() {
    return ElementHelper.getElementById('description');
  }

  /**
   * Adds the hobby
   * @param hobby - object representation of hobby
   */
  public async addHobby(hobby) {
    BrowserHelper.sleep(1000);
    await this.setName(hobby.name);
    await this.setDescription(hobby.description);
    await this.getAddButton('hobby').click();
  }

  /**
   * Edits the hobby
   * @param hobby - object representation of existing hobby
   * @param newHobby - object representation of new hobby
   */
  public async editHobby(hobby, newHobby) {
    await this.getEditIconbyName(hobby.name).click();
    await this.setName(newHobby.name);
    await this.getEditButton('hobby').click();
  }

  /**
   * Deletes the hobby
   * @param hobby 
   */
  public async deleteHobby(hobby) {
    await this.getDeleteIconbyName(hobby.name).click();
    await this.deleteConfirmation.click();    
  }

  /**
   * Sets the name field 
   * @param name - name of the hobby to input
   */
  private async setName(name) {
    await BrowserHelper.waitUntilClickableOf(this.name);
    await this.name.clear();
    await this.name.sendKeys(name);
  }

  /**
   * Sets the description field
   * @param description - description of the hobby to input
   */
  private async setDescription(description) {
    await this.description.clear();
    await this.description.sendKeys(description);
  }
}