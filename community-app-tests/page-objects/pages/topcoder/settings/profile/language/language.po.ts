import { logger } from "../../../../../../logger/logger";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { SettingsPage } from "../../settings.po";
import { ConfigHelper } from "../../../../../../utils/config-helper";

export class LanguagePage extends SettingsPage {

  /**
   * Gets the Language page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    this.switchTab("language");
    logger.info("User navigated to Language Page");
  }

  /**
   * Gets the language name input field
   */
  private async getLanguageInput() {
    const elements = await ElementHelper.getAllElementsByXPath('//*[@aria-activedescendant]');
    return elements[0];
  }

  /**
   * Gets the spoken level input field
   */
  private async getSpokenLevelInput() {
    const elements = await ElementHelper.getAllElementsByXPath('//*[@aria-activedescendant]');
    return elements[1];
  }

  /**
   * Gets the written level input field
   */
  private async getWrittenLevelInput() {
    const elements = await ElementHelper.getAllElementsByXPath('//*[@aria-activedescendant]');
    return elements[2];
  }

  /**
   * Adds the language
   * @param language - object representation of language
   */
  public async addLanguage(language) {
    await this.performSelection(await this.getLanguageInput(), language.name);
    await this.performSelection(await this.getSpokenLevelInput(), language.spokenLevel);
    await this.performSelection(await this.getWrittenLevelInput(), language.writtenLevel);
    await this.getAddButton('language').click();
  }

  /**
   * Updates the language
   * @param oldLanguage - object representation of added language
   * @param newLanguage - object representation of new language
   */
  public async editLanguage(oldLanguage, newLanguage) {
    await this.getEditIconbyName(oldLanguage.name).click();
    await this.performSelection(await this.getSpokenLevelInput(), newLanguage.spokenLevel);
    await this.performSelection(await this.getWrittenLevelInput(), newLanguage.writtenLevel);
    await this.getEditButton('language').click();
  }

  /**
   * Deletes the language
   * @param language 
   */
  public async deleteLanguage(language) {
    await this.getDeleteIconbyName(language.name).click();
    await this.deleteConfirmation.click();
  }
}