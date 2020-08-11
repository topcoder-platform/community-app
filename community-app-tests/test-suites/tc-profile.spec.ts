import { BrowserHelper } from 'topcoder-testing-lib';
import { LoginPageHelper } from '../page-objects/pages/topcoder/login/login.helper';
import { ConfigHelper } from '../utils/config-helper';
import * as testData from '../test-data/test-data.json';
import { BasicInfoPageHelper } from '../page-objects/pages/topcoder/settings/profile/basic-info/basic-info.helper';
import { LanguagePageHelper } from '../page-objects/pages/topcoder/settings/profile/language/language.helper';
import { EducationPageHelper } from '../page-objects/pages/topcoder/settings/profile/education/education.helper';
import { WorkPageHelper } from '../page-objects/pages/topcoder/settings/profile/work/work.helper';
import { SkillPageHelper } from '../page-objects/pages/topcoder/settings/profile/skills/skill.helper';
import { HobbyPageHelper } from '../page-objects/pages/topcoder/settings/profile/hobbies/hobby.helper';
import { CommunityPageHelper } from '../page-objects/pages/topcoder/settings/profile/communities/community.helper';

describe('Topcoder Profile Settings Page Tests: ', () => {
  /**
   * Sets up the browser and logs in
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    await LoginPageHelper.open();
    await LoginPageHelper.login(
      ConfigHelper.getUserName(),
      ConfigHelper.getPassword()
    );
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    try {
      await LoginPageHelper.logout();
    } catch (e) {
      await BrowserHelper.restart();
    }
  });

  /**
   * Verifies that user can update his basic information
   */
  it('should verify whether the current user can update basic information', async () => {
    await BasicInfoPageHelper.open();
    await BasicInfoPageHelper.verifyBasicInfoUpdate(testData.profile);
  });

  /**
   * Verifies Add/Update/Delete language functionality
   */
  it('should verify User can Add/Update/Delete language', async () => {
    await LanguagePageHelper.open();
    await LanguagePageHelper.deleteAll();
    await LanguagePageHelper.verifyAddLanguage(testData.profile.language);
    await LanguagePageHelper.verifyEditLanguage(
      testData.profile.language,
      testData.profile.newLanguage
    );
    await LanguagePageHelper.verifyDeleteLanguage(testData.profile.newLanguage);
  });

  /**
   * Verifies Add/Update/Delete education functionality
   */

  it('should verify User can Add/Update/Delete Education', async () => {
    await EducationPageHelper.open();
    await EducationPageHelper.deleteAll();
    await EducationPageHelper.verifyAddEducation(testData.profile.education);
    await EducationPageHelper.verifyEditEducation(
      testData.profile.education,
      testData.profile.newEducation
    );
    await EducationPageHelper.verifyDeleteEducation(
      testData.profile.newEducation
    );
  });

  /**
   * Verifies Add/Update/Delete work functionality
   */
  it('should verify User can Add/Update/Delete work ', async () => {
    await WorkPageHelper.open();
    await WorkPageHelper.deleteAll();
    await WorkPageHelper.verifyAddWork(testData.profile.work);
    await WorkPageHelper.verifyEditWork(
      testData.profile.work,
      testData.profile.newWork
    );
    await WorkPageHelper.verifyDeleteWork(testData.profile.newWork);
  });

  /**
   * Verifies Add/Update/Delete skill functionality
   */
  it('should verify User can Add/Delete skill.', async () => {
    await SkillPageHelper.open();
    await SkillPageHelper.deleteAll();
    await SkillPageHelper.verifyAddSkill(testData.profile.skill);
    await SkillPageHelper.verifyDeleteSkill(testData.profile.skill);
  });

  /**
   * Verifies Add/Update/Delete hobby functionality
   */
  it('should verify User can Add/Update/Delete hobbies ', async () => {
    await HobbyPageHelper.open();
    await HobbyPageHelper.deleteAll();
    await HobbyPageHelper.verifyAddHobby(testData.profile.hobby);
    await HobbyPageHelper.verifyEditHobby(
      testData.profile.hobby,
      testData.profile.newHobby
    );
    await HobbyPageHelper.verifyDeleteHobby(testData.profile.newHobby);
  });

  /**
   * Verifies user can update blockchain/cognitive community
   */
  it('should verify User can update the community.', async () => {
    await CommunityPageHelper.open();
    await CommunityPageHelper.disableAll();
    await CommunityPageHelper.verifyUpdateCommunity(testData.profile.community);
  });
});
