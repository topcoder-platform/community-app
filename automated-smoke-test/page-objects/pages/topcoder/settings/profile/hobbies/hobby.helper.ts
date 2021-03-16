import { logger } from '../../../../../../logger/logger';
import { HobbyPage } from './hobby.po';
import { CommonHelper } from '../../../common-page/common.helper';

export class HobbyPageHelper {
  /**
   * sets the Hobby page object
   */
  public static setHobbyPage(hobbyPage) {
    this.hobbyPageObject = hobbyPage;
  }

  /**
   * Opens the hobby page in the browser
   */
  public static async open() {
    this.hobbyPageObject = new HobbyPage();
    await this.hobbyPageObject.open();
  }

  /**
   * Deletes all the hobbies
   */
  public static async deleteAll() {
    await this.hobbyPageObject.deleteAllHobbies();
  }

  /**
   * Adds the hobby and verifies it
   * @param hobby - object representation of hobby to be added
   */
  public static async verifyAddHobby(hobby) {
    const name = this.getName(hobby);
    await this.hobbyPageObject.addHobby(hobby);
    await this.hobbyPageObject.waitForDefaultSuccessMessage();
    const isDisplayed = await CommonHelper.isPresent(
      CommonHelper.findElementByText('div', name)
    );
    expect(isDisplayed).toBe(true);
    logger.info('hobby added: ' + name);
  }

  /**
   * Edits the hobby and updates by using the new representation of hobby
   * @param hobby - object representation of old hobby
   * @param newHobby - object representation of new hobby
   */
  public static async verifyEditHobby(hobby, newHobby) {
    const name = this.getName(hobby);
    const newName = this.getName(newHobby);

    await this.hobbyPageObject.editHobby(hobby, newHobby);
    await this.hobbyPageObject.waitForDefaultSuccessMessage();

    const el = CommonHelper.findElementByText('div', newName);
    const isDisplayed = await CommonHelper.isPresent(el);
    expect(isDisplayed).toBe(true);
    logger.info('hobby edited from: ' + name + ' to ' + newName);
  }

  /**
   * Deletes the hobby
   * @param hobby
   */
  public static async verifyDeleteHobby(hobby) {
    const name = this.getName(hobby);
    await this.hobbyPageObject.deleteHobby(hobby);
    await this.hobbyPageObject.waitForDefaultSuccessMessage();
    const el = CommonHelper.findElementByText('div', name);
    const isDisplayed = await CommonHelper.isPresent(el);
    expect(isDisplayed).toBe(false);
    logger.info('deleted hobby: ' + name);
  }

  /**
   * gets the name of the hobby
   * using which UI can be searched
   * @param hobby - object representation of hobby
   */
  private static getName(hobby) {
    return hobby.name;
  }

  private static hobbyPageObject: HobbyPage;
}
