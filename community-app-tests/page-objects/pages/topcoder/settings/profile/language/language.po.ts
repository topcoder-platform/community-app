import { logger } from '../../../../../../logger/logger';
import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { SettingsPage } from '../../settings.po';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { CommonHelper } from '../../../common-page/common.helper';

export class LanguagePage extends SettingsPage {
  /**
   * Gets the Language page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    await this.switchTab('language');
    logger.info('User navigated to Language Page');
  }

  /**
   * Delete all language
   */
  public async deleteAllLanguage() {
    await this.deleteAll('Your language');
  }

  /**
   * Gets the language name input field
   */
  private async getLanguageInput() {
    // wait to show first input element
    await CommonHelper.waitUntilPresenceOf(
      () => ElementHelper.getElementByXPath('//*[@aria-activedescendant]'),
      'wait for language input',
      false
    );
    const elements = await ElementHelper.getAllElementsByXPath(
      '//*[@aria-activedescendant]'
    );
    return elements[0];
  }

  /**
   * Gets the spoken level input field
   */
  private async getSpokenLevelInput() {
    // wait to show first input element
    await CommonHelper.waitUntilPresenceOf(
      () => ElementHelper.getElementByXPath('//*[@aria-activedescendant]'),
      'wait for spoken level input',
      false
    );
    const elements = await ElementHelper.getAllElementsByXPath(
      '//*[@aria-activedescendant]'
    );
    return elements[1];
  }

  /**
   * Gets the written level input field
   */
  private async getWrittenLevelInput() {
    // wait to show first input element
    await CommonHelper.waitUntilPresenceOf(
      () => ElementHelper.getElementByXPath('//*[@aria-activedescendant]'),
      'wait for written level input',
      false
    );
    const elements = await ElementHelper.getAllElementsByXPath(
      '//*[@aria-activedescendant]'
    );
    return elements[2];
  }

  /**
   * Adds the language
   * @param language - object representation of language
   */
  public async addLanguage(language) {
    await this.performSelection(
      null,
      this.getLanguageInput.bind(this),
      language.name
    );
    await this.performSelection(
      null,
      this.getSpokenLevelInput.bind(this),
      language.spokenLevel
    );
    await this.performSelection(
      null,
      this.getWrittenLevelInput.bind(this),
      language.writtenLevel
    );
    await this.getAddButton('language').click();
  }

  /**
   * Updates the language
   * @param oldLanguage - object representation of added language
   * @param newLanguage - object representation of new language
   */
  public async editLanguage(oldLanguage, newLanguage) {
    await this.getEditIconbyName(oldLanguage.name).click();
    await this.performSelection(
      null,
      this.getSpokenLevelInput.bind(this),
      newLanguage.spokenLevel
    );
    await this.performSelection(
      null,
      this.getWrittenLevelInput.bind(this),
      newLanguage.writtenLevel
    );
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
