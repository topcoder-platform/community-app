import { ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../../../logger/logger';
import { LanguagePage } from './language.po';
import { CommonHelper } from '../../../common-page/common.helper';

export class LanguagePageHelper {
  /**
   * sets the Language page object
   */
  public static setLanguagePage(languagePage) {
    this.languagePageObject = languagePage;
  }

  /**
   * Opens the my language page in the browser
   */
  public static async open() {
    this.languagePageObject = new LanguagePage();
    await this.languagePageObject.open();
  }

  /**
   * deletes all entries in the current tab
   */
  public static async deleteAll() {
    await this.languagePageObject.deleteAllLanguage();
  }

  public static async verifyAddLanguage(language) {
    const name = this.getName(language);
    await this.languagePageObject.addLanguage(language);
    await this.languagePageObject.waitForDefaultSuccessMessage();
    const el = CommonHelper.findElementByText('div', name);
    const isDisplayed = await CommonHelper.isPresent(el);
    expect(isDisplayed).toBe(true);
    logger.info('language added: ' + name);
  }

  public static async verifyEditLanguage(oldLanguage, newLanguage) {
    const name = this.getName(oldLanguage);
    const newName = this.getName(newLanguage);

    await this.languagePageObject.editLanguage(oldLanguage, newLanguage);
    await this.languagePageObject.waitForDefaultSuccessMessage();

    let el = CommonHelper.findElementByText('div', newName);
    let isDisplayed = await CommonHelper.isPresent(el);
    expect(isDisplayed).toBe(true);

    el = ElementHelper.getTagElementMatchingText(
      'div',
      `Spoken: ${newLanguage.spokenLevel.toUpperCase()} | Written: ${newLanguage.writtenLevel.toUpperCase()}`
    );
    isDisplayed = await CommonHelper.isPresent(el);
    expect(isDisplayed).toBe(true);

    const text = await ElementHelper.getElementByXPath('..', el).getText();
    expect(text.includes(newLanguage.name)).toBe(true);

    logger.info('language edited from: ' + name + ' to ' + newName);
  }

  public static async verifyDeleteLanguage(language) {
    await this.languagePageObject.deleteLanguage(language);
    await this.languagePageObject.waitForDefaultSuccessMessage();
    const isDisplayed = await CommonHelper.isPresent(
      CommonHelper.findElementByText('div', language.name)
    );
    expect(isDisplayed).toBe(false);
    logger.info('deleted language: ' + language.name);
  }

  /**
   * gets the name from the language object
   * @param language - object representing language
   */
  private static getName(language) {
    return language.name;
  }

  private static languagePageObject: LanguagePage;
}
