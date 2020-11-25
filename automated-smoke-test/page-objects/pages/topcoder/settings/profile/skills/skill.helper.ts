import { logger } from '../../../../../../logger/logger';
import { SkillPage } from './skill.po';
import { CommonHelper } from '../../../common-page/common.helper';

export class SkillPageHelper {
  /**
   * sets the Skill page object
   */
  public static setSkillPage(skillPage) {
    this.skillPageObject = skillPage;
  }

  /**
   * Opens the skill page in the browser
   */
  public static async open() {
    this.skillPageObject = new SkillPage();
    await this.skillPageObject.open();
  }

  /**
   * Deletes all skills
   */
  public static async deleteAll() {
    await this.skillPageObject.deleteAll();
  }

  /**
   * Verifies addition of skill
   * @param skill
   */
  public static async verifyAddSkill(skill) {
    const name = this.getName(skill);
    await this.skillPageObject.addSkill(skill);
    await this.skillPageObject.waitForDefaultSuccessMessage();
    const isDisplayed = await CommonHelper.isPresent(
      CommonHelper.findElementByText('div', name)
    );
    expect(isDisplayed).toBe(true);
    logger.info('skill added: ' + name);
  }

  /**
   * Verifies deletion of skill
   * @param skill
   */
  public static async verifyDeleteSkill(skill) {
    const name = this.getName(skill);
    await this.skillPageObject.deleteSkill(skill);
    await this.skillPageObject.waitForDefaultSuccessMessage();
    const isDisplayed = await CommonHelper.isPresent(
      CommonHelper.findElementByText('div', name)
    );
    expect(isDisplayed).toBe(false);
    logger.info('deleted skill: ' + name);
  }

  /**
   * gets name of skill which is used to query UI
   * @param skill
   */
  private static getName(skill) {
    return skill.name;
  }

  private static skillPageObject: SkillPage;
}
