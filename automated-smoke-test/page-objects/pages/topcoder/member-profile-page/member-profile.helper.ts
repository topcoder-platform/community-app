import { BrowserHelper } from 'topcoder-testing-lib';
import * as _ from 'lodash';
import { CommonHelper } from '../common-page/common.helper';
import { MemberProfilePageObject, SkillInfo } from './member-profile.po';
import {
  MemberProfileTrackConfig,
  MemberProfileSubtrackConfig,
} from '../../../../utils/config-helper';

export class MemberProfilePageHelper {
  /**
   * Open member profile page
   * @param handle handle of member
   */
  private static async open(handle: string) {
    await BrowserHelper.open(
      `${MemberProfilePageObject.memberProfileUrl}/${handle}`
    );
    await CommonHelper.waitUntilVisibilityOf(
      () => MemberProfilePageObject.getHandleField(handle),
      'Wait for show member handle',
      true
    );
    await BrowserHelper.sleep(1000);
  }

  /**
   * Open any member profile page
   */
  public static async openMemberPage() {
    await this.open(MemberProfilePageObject.memberProfileInfo.handle);
  }

  /**
   * Open copilot member profile page
   */
  public static async openCopilotMemberPage() {
    await this.open(MemberProfilePageObject.memberCopilotProfileInfo.handle);
  }

  /**
   * Open development member profile page
   */
  public static async openDevelopmentMemberPage() {
    await this.open(
      MemberProfilePageObject.memberDevelopmentProfileInfo.handle
    );
  }

  /**
   * Open design member profile page
   */
  public static async openDesignMemberPage() {
    await this.open(MemberProfilePageObject.memberDesignProfileInfo.handle);
  }

  /**
   * Open data science member profile page
   */
  public static async openDataScienceMemberPage() {
    await this.open(
      MemberProfilePageObject.memberDataScienceProfileInfo.handle
    );
  }

  /**
   * Open member have web section profile page
   */
  public static async openMemberHaveWebSectionProfilePage() {
    await this.open(
      MemberProfilePageObject.memberHaveWebSectionProfileInfo.handle
    );
  }

  /**
   * Verify member details are correct
   */
  public static async verifyMemberDetailsAreCorrect() {
    const memberInfo = await MemberProfilePageObject.getMemberInfo();
    const expectedClientInfo = MemberProfilePageObject.memberProfileInfo;
    const omitProps = [
      'numberOfCollapsedSkills',
      'verifiedSkill',
      'noneVerifiedSkill',
      'forumLink'
    ];
    return expect(
      _.isEqual(
        _.omit(memberInfo, omitProps),
        _.omit(expectedClientInfo, omitProps)
      )
    ).toBe(true, 'Member details are not correct');
  }

  /**
   * Verify member skills are correct
   */
  public static async verifySkillsAreCorrect() {
    const expectedClientInfo = MemberProfilePageObject.memberProfileInfo;
    let skills: SkillInfo[] = await MemberProfilePageObject.getAllSkills();
    expect(skills.length).toBe(
      expectedClientInfo.numberOfCollapsedSkills,
      'Number of skills for the user is not correct'
    );
    const values = Array.from(skills.values());
    let skillData = [];
    for (var i = 0; i < values.length; i++) {
      if (values[i].isHaveCheckMark == true) {
        skillData.push(values[i].name)
      }
    }
    expect(skillData).toEqual(expectedClientInfo.verifiedSkill, 'Verified skill is not displayed with a check mark')
    expect(
      _.some(skills, {
        name: expectedClientInfo.noneVerifiedSkill,
        isHaveCheckMark: false,
      })
    ).toBe(true, 'Unverified skill should not be displayed with a check mark');
    const numberOfCollapsedSkills = skills.length;
    skills = await MemberProfilePageObject.getAllSkills();
    const numberOfAllSkills = skills.length;
    if (numberOfCollapsedSkills !== numberOfAllSkills) {
      await CommonHelper.findElementByText('button', 'VIEW ALL').click();
      await CommonHelper.waitUntilVisibilityOf(
        () => CommonHelper.findElementByText('button', 'VIEW LESS'),
        'Wait for view less button',
        false
      );
      expect(numberOfCollapsedSkills <= numberOfAllSkills).toBe(
        true,
        'Button View All does not work as expected'
      );
      await CommonHelper.findElementByText('button', 'VIEW LESS').click();
      await CommonHelper.waitUntilVisibilityOf(
        () => CommonHelper.findElementByText('button', 'VIEW ALL'),
        'Wait for view less button',
        false
      );
      expect(skills.length <= numberOfAllSkills).toBe(
        true,
        'Button View Less does not work as expected'
      );
    }
  }

  /**
   * Verify subtrack show correct info
   * @param trackInfo track info
   */
  public static async verifySubtractkShowCorrectInfo(
    trackInfo: MemberProfileTrackConfig
  ) {
    const allSubtracks = await MemberProfilePageObject.getAllSubtracks(
      trackInfo.trackName
    );
    const fields = ['name', 'info', 'infoTitle'];
    const verifySubtrack = async (
      expectedSubtrack: MemberProfileSubtrackConfig
    ) => {
      expect(
        _.some(allSubtracks, (subtrack) =>
          _.isEqual(_.pick(subtrack, fields), _.pick(expectedSubtrack, fields))
        )
      ).toBe(true, `Subtrack of ${trackInfo.trackName} is not correct`);
    };
    if (trackInfo.fullfillmentInfo) {
      await verifySubtrack(trackInfo.fullfillmentInfo);
    } else if (trackInfo.winInfo) {
      await verifySubtrack(trackInfo.winInfo);
    } else if (trackInfo.ratingInfo) {
      await verifySubtrack(trackInfo.ratingInfo);
    }
  }

  /**
   * Verify clicking on subtrack card takes
   * the user to the corresponding Stats History page
   */
  public static async verifyClickingOnSubtrackCard(
    trackInfo: MemberProfileTrackConfig
  ) {
    const allSubtracks = await MemberProfilePageObject.getAllSubtracks(
      trackInfo.trackName
    );
    const fields = ['name', 'info', 'infoTitle'];
    const verifySubtrack = async (
      expectedSubtrack: MemberProfileSubtrackConfig
    ) => {
      const subtrackInfo: MemberProfileSubtrackConfig = _.find(
        allSubtracks,
        _.pick(expectedSubtrack, fields)
      );
      if (subtrackInfo) {
        await subtrackInfo.card.click();
        await CommonHelper.verifyCurrentUrl(expectedSubtrack.link);
      }
    };
    if (trackInfo.fullfillmentInfo) {
      await verifySubtrack(trackInfo.fullfillmentInfo);
    } else if (trackInfo.winInfo) {
      await verifySubtrack(trackInfo.winInfo);
    } else if (trackInfo.ratingInfo) {
      await verifySubtrack(trackInfo.ratingInfo);
    }
  }

  /**
   * Verify number of subtracks is correct
   */
  public static async verifyNumberOfSubtracksIsCorrect(
    trackInfo: MemberProfileTrackConfig
  ) {
    const allSubtracks = await MemberProfilePageObject.getAllSubtracks(
      trackInfo.trackName
    );
    expect(trackInfo.numberOfSubtracks).toBe(
      allSubtracks.length,
      `Number of sub tracks is not correct under ${trackInfo.trackName} track`
    );
  }

  /**
   * Verify that below details on the copilot activity
   * card are correct fulfillment %
   */
  public static async verifyCopilotFullfillmentIsCorrect() {
    await this.verifySubtractkShowCorrectInfo(
      MemberProfilePageObject.memberCopilotProfileInfo
    );
  }

  /**
   * Verify clicking on Copilot activity card takes
   * the user to the corresponding Stats History page
   */
  public static async verifyClickingOnCopilotSubtrackCard() {
    await this.verifyClickingOnSubtrackCard(
      MemberProfilePageObject.memberCopilotProfileInfo
    );
  }

  /**
   * Verify the number of subtracks is correct under the development track
   */
  public static async verifyNumberOfDevelopmentSubtracksIsCorrect() {
    await this.verifyNumberOfSubtracksIsCorrect(
      MemberProfilePageObject.memberDevelopmentProfileInfo
    );
  }

  /**
   * Verify that the below details on any development subtrack
   * card are correct Wins / Rating
   */
  public static async verifyDevelopmentSubtrackIsCorrect() {
    await this.verifySubtractkShowCorrectInfo(
      MemberProfilePageObject.memberDevelopmentProfileInfo
    );
  }

  /**
   * Verify clicking on development activity card takes
   * the user to the corresponding Stats History page
   */
  public static async verifyClickingOnDevelopmentSubtrackCard() {
    await this.verifyClickingOnSubtrackCard(
      MemberProfilePageObject.memberDevelopmentProfileInfo
    );
  }

  /**
   * Verify the number of subtracks is correct under the design track
   */
  public static async verifyNumberOfDesignSubtracksIsCorrect() {
    await this.verifyNumberOfSubtracksIsCorrect(
      MemberProfilePageObject.memberDesignProfileInfo
    );
  }

  /**
   * Verify that the below details on any design subtrack
   * card are correct Wins / Rating
   */
  public static async verifyDesignSubtrackIsCorrect() {
    await this.verifySubtractkShowCorrectInfo(
      MemberProfilePageObject.memberDesignProfileInfo
    );
  }

  /**
   * Verify clicking on design activity card takes
   * the user to the corresponding Stats History page
   */
  public static async verifyClickingOnDesignSubtrackCard() {
    await this.verifyClickingOnSubtrackCard(
      MemberProfilePageObject.memberDesignProfileInfo
    );
  }

  /**
   * Verify the number of subtracks is correct under the data science track
   */
  public static async verifyNumberOfDataScienceSubtracksIsCorrect() {
    await this.verifyNumberOfSubtracksIsCorrect(
      MemberProfilePageObject.memberDataScienceProfileInfo
    );
  }

  /**
   * Verify that the below details on any data science subtrack
   * card are correct Wins / Rating
   */
  public static async verifyDataScienceSubtrackIsCorrect() {
    await this.verifySubtractkShowCorrectInfo(
      MemberProfilePageObject.memberDataScienceProfileInfo
    );
  }

  /**
   * Verify clicking on data science activity card takes
   * the user to the corresponding Stats History page
   */
  public static async verifyClickingOnDataScienceSubtrackCard() {
    await this.verifyClickingOnSubtrackCard(
      MemberProfilePageObject.memberDataScienceProfileInfo
    );
  }

  /**
   * Verify web section show correct web link
   */
  public static async verifyWebSectionShowCorrectWeblink() {
    const webLinks = await MemberProfilePageObject.getAllWebLinks();
    expect(
      webLinks.indexOf(
        MemberProfilePageObject.memberHaveWebSectionProfileInfo.webLink
      ) >= 0
    ).toBe(true, 'Web link show on the web section is not correct');
  }
}
