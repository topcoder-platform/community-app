import { BrowserHelper } from 'topcoder-testing-lib';
import { MemberProfilePageHelper } from '../page-objects/pages/topcoder/member-profile-page/member-profile.helper';

describe('Topcoder Member Profile Page Tests:', () => {
  /**
   * Sets up browser
   */
  beforeEach(async () => {
    await BrowserHelper.initialize();
    await BrowserHelper.maximize();
  });

  /**
   * To Check that member profile card display
   */
  it('[TC_001] should check that member profile card display', async () => {
    await MemberProfilePageHelper.openMemberPage();
    await MemberProfilePageHelper.verifyMemberDetailsAreCorrect();
  });

  /**
   * To Check that skills display
   */
  it('[TC_002] should check that skills display', async () => {
    await MemberProfilePageHelper.openMemberPage();
    await MemberProfilePageHelper.verifySkillsAreCorrect();
  });

  /**
   * To Check the Copilot Activity section
   */
  it('[TC_003] should check the copilot activity section', async () => {
    await MemberProfilePageHelper.openCopilotMemberPage();
    await MemberProfilePageHelper.verifyCopilotFullfillmentIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnCopilotSubtrackCard();
  });

  /**
   * To Check the Development Activity section
   */
  it('[TC_004] should check the development activity section', async () => {
    await MemberProfilePageHelper.openDevelopmentMemberPage();
    await MemberProfilePageHelper.verifyDevelopmentSubtrackIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnDevelopmentSubtrackCard();
  });

  /**
   * To Check the Design Activity section
   */
  it('[TC_005] should check the design activity section', async () => {
    await MemberProfilePageHelper.openDesignMemberPage();
    await MemberProfilePageHelper.verifyDesignSubtrackIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnDesignSubtrackCard();
  });

  /**
   * To Check the Data Science Activity section
   */
  it('[TC_006] should check the data science activity section', async () => {
    await MemberProfilePageHelper.openDataScienceMemberPage();
    await MemberProfilePageHelper.verifyDataScienceSubtrackIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnDataScienceSubtrackCard();
  });

  /**
   * To Check the on the web section
   */
  it('[TC_007] should check the on the web section', async () => {
    await MemberProfilePageHelper.openMemberHaveWebSectionProfilePage()
  });
});
