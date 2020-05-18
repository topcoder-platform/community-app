import { logger } from "../../../../../../logger/logger";
import * as appconfig from "../../../../../../app-config.json";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { SettingsPage } from "../../settings.po";
import { ConfigHelper } from "../../../../../../utils/config-helper";
import { SettingsPageConstants } from "../../settings.constants";

export class SkillPage extends SettingsPage {

  /**
   * Gets the Skill page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    this.switchTab("skills");
    logger.info("User navigated to Skills Page");
  }

  /**
   * Gets the skill input field
   */
  private get skillInput() {
    return ElementHelper.getElementByCss('[aria-activedescendant="react-select-10--value"]');
  }

  /**
   * Gets the delete icon
   */
  public get deleteIcon() {
    return ElementHelper.getElementByXPath('//a[contains(@id,"skill-a-")]');
  }

  /**
   * Gets the delete success message
   */
  public get successMsg() {
    return ElementHelper.getTagElementContainingText(
      "div",
      SettingsPageConstants.Messages.SkillSuccessMessage
    );
  }

  /**
   * Deletes all skills
   */
  public async deleteAll() {
    await BrowserHelper.waitUntilVisibilityOf(
      this.heading,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
    const delIcons = await ElementHelper.getAllElementsByXPath('//a[contains(@id,"skill-a-")]');
    for (let icon of delIcons) {
      await icon.click();
      await this.deleteConfirmation.click();
      await this.waitForSuccessMsg();
    }
  }

  /**
   * Waits for visibility and invisibility of success message
   */
  public async waitForSuccessMsg() {
    await BrowserHelper.waitUntilVisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );

    await BrowserHelper.waitUntilInVisibilityOf(
      this.successMsg,
      appconfig.Timeout.ElementInvisibility,
      appconfig.LoggerErrors.ElementInvisibilty
    );
  }

  /**
   * Adds the given skill
   * @param skill 
   */
  public async addSkill(skill) {
    await this.performSelection(this.skillInput, skill.name);
    await this.getAddButton('skill').click();
  }

  /**
   * Deletes the given skill
   * @param skill 
   */
  public async deleteSkill(skill) {
    await this.deleteIcon.click();
    await this.deleteConfirmation.click();
  }
}