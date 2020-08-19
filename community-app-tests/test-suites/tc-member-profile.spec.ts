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

  it('should check that member profile card display [TC_001]', async () => {
    await MemberProfilePageHelper.openMemberPage();
    await MemberProfilePageHelper.verifyMemberDetailsAreCorrect();
  });

  it('should check that skills display [TC_002]', async () => {
    await MemberProfilePageHelper.openMemberPage();
    await MemberProfilePageHelper.verifySkillsAreCorrect();
  });

  it('should check the copilot activity section [TC_003]', async () => {
    await MemberProfilePageHelper.openCopilotMemberPage();
    await MemberProfilePageHelper.verifyCopilotFullfillmentIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnCopilotSubtrackCard();
  });

  it('should check the development activity section [TC_004]', async () => {
    await MemberProfilePageHelper.openDevelopmentMemberPage();
    await MemberProfilePageHelper.verifyDevelopmentSubtrackIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnDevelopmentSubtrackCard();
  });

  it('should check the design activity section [TC_005]', async () => {
    await MemberProfilePageHelper.openDesignMemberPage();
    await MemberProfilePageHelper.verifyDesignSubtrackIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnDesignSubtrackCard();
  });

  it('should check the data science activity section [TC_006]', async () => {
    await MemberProfilePageHelper.openDataScienceMemberPage();
    await MemberProfilePageHelper.verifyDataScienceSubtrackIsCorrect();
    await MemberProfilePageHelper.verifyClickingOnDataScienceSubtrackCard();
  });

  it('should check the on the web section [TC_007]', async () => {
    await MemberProfilePageHelper.openMemberHaveWebSectionProfilePage();
    await MemberProfilePageHelper.verifyWebSectionShowCorrectWeblink();
  });
});
