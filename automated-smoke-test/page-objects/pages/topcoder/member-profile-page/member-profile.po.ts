import { ElementHelper } from "topcoder-testing-lib";
import {
  ConfigHelper,
  MemberProfileInfoConfig,
  MemberProfileSubtrackConfig,
} from "../../../../utils/config-helper";
import { CommonHelper } from "../common-page/common.helper";

// skill info
export interface SkillInfo {
  name: string;
  isHaveCheckMark: boolean;
}

export class MemberProfilePageObject {
  /**
   * Get member profile url
   */
  static get memberProfileUrl(): string {
    return ConfigHelper.getMemberProfileConfig().url;
  }
  /**
   * Get member profile info
   */
  static get memberProfileInfo() {
    return ConfigHelper.getMemberProfileConfig().profileInfo;
  }
  /**
   * Get copilot profile info
   */
  static get memberCopilotProfileInfo() {
    return ConfigHelper.getMemberProfileConfig().copilotProfile;
  }
  /**
   * Get development profile info
   */
  static get memberDevelopmentProfileInfo() {
    return ConfigHelper.getMemberProfileConfig().developmentProfile;
  }
  /**
   * Get design profile info
   */
  static get memberDesignProfileInfo() {
    return ConfigHelper.getMemberProfileConfig().designProfile;
  }
  /**
   * Get data science profile info
   */
  static get memberDataScienceProfileInfo() {
    return ConfigHelper.getMemberProfileConfig().dataScienceProfile;
  }
  /**
   * Get member have web section info
   */
  static get memberHaveWebSectionProfileInfo() {
    return ConfigHelper.getMemberProfileConfig().memberHaveWebSectionInfo;
  }
  /**
   * Get handle field
   * @param handle handle of member
   */
  static getHandleField(handle: string) {
    return CommonHelper.findElementByText("h1", handle);
  }
  /**
   * Get all skills
   */
  static async getAllSkills(): Promise<SkillInfo[]> {
    const skills = await ElementHelper.getAllElementsByClassName("_17_DJM");
    return await Promise.all(
      skills.map(async (card) => {
        const name = await ElementHelper.getElementByClassName(
          "_31cKGD",
          card
        ).getText();
        const isHaveCheckMark = await CommonHelper.isPresent(
          ElementHelper.getElementByCss("._BoiHz svg", card)
        );
        return {
          name,
          isHaveCheckMark,
        };
      })
    );
  }
  /**
   * Get all tracks
   */
  static async getAllTracks(): Promise<string[]> {
    const tracks = await ElementHelper.getAllElementsByClassName("_2lQG4o");
    return await Promise.all(
      tracks.map(async (card) => {
        return await card.getAttribute("id");
      })
    );
  }
  /**
   * Get all subtracks
   * @param trackId id of track
   */
  static async getAllSubtracks(
    trackId: string
  ): Promise<MemberProfileSubtrackConfig[]> {
    const trackElement = ElementHelper.getElementById(trackId);
    const subtracks = await ElementHelper.getAllElementsByClassName(
      "_3Es9QB",
      trackElement
    );
    return await Promise.all(
      subtracks.map(async (card) => {
        const name = await ElementHelper.getElementByClassName(
          "_3LRlZS",
          card
        ).getText();
        const info = await ElementHelper.getElementByClassName(
          "aMu8-h",
          card
        ).getText();
        const infoTitle = await ElementHelper.getElementByClassName(
          "_3_M6ux",
          card
        ).getText();
        return {
          name,
          info,
          infoTitle,
          card,
        };
      })
    );
  }
  /**
   * Get all web links
   */
  static async getAllWebLinks(): Promise<string[]> {
    const webLinks = await ElementHelper.getAllElementsByCss("a.hyNr-2");
    return await Promise.all(
      webLinks.map(async (card) => {
        const link = await ElementHelper.getElementByClassName(
          "_13i4cy",
          card
        ).getText();
        return link;
      })
    );
  }
  /**
   * Get member info
   */
  static async getMemberInfo(): Promise<MemberProfileInfoConfig> {
    const handle = await ElementHelper.getElementByTag("h1").getText();
    const numberOfCollapsedSkills = (await this.getAllSkills()).length;
    const userDet = await ElementHelper.getElementByCss("h3.a6sow0").getText();
    const country = userDet.split(" ", 1)[0];
    console.log("country:" + country);
    const memberSince = await ElementHelper.getElementByCss(
      "h3._3ODNva"
    ).getText();
    const tracks = await this.getAllTracks();
    const quote = await ElementHelper.getElementByCss("p._1tUAew").getText();
    const forumLink = await ElementHelper.getElementByCss(
      "a._1S7iib"
    ).getAttribute("href");
    return {
      handle,
      numberOfCollapsedSkills,
      country,
      memberSince,
      tracks,
      quote,
      forumLink,
    };
  }
}
