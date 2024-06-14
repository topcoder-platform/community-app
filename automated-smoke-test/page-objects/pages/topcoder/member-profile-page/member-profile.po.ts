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
    return ElementHelper.getElementByXPath(
      `//img[@alt='Member Portait']/parent::div/following-sibling::div/div[.='${handle}']`)
  }
  /**
   * Get all skills
   */
  static async getAllSkills(): Promise<SkillInfo[]> {
    const skills = await ElementHelper.getAllElementsByCss("div.m5cER2 > div >div div._3UDDF-");
    return await Promise.all(
      skills.map(async (card) => {
        const name = await ElementHelper.getElementByCss(
          "span",
          card
        ).getText();
        const isHaveCheckMark = await CommonHelper.isPresent(
          ElementHelper.getElementByCss(" div >svg", card)
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
    const tracks = await ElementHelper.getAllElementsByCss("div.m6_uiF > span");
    return await Promise.all(
      tracks.map(async (card) => {
        return await card.getText();
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
    const trackElement = ElementHelper.getElementByXPath(`//div[@role="presentation"]/span[.='${trackId}']/ancestor::div[@class='_3tP91L']`);
    const subtracks = await ElementHelper.getAllElementsByClassName(
      "_3WwG02",
      trackElement
    );
    return await Promise.all(
      subtracks.map(async (card) => {
        const name = await ElementHelper.getElementByClassName(
          "_3oV6HS",
          card
        ).getText();
        const info = await ElementHelper.getElementByClassName(
          "aM5NnB",
          card
        ).getText();
        const infoTitle = await ElementHelper.getElementByClassName(
          "_3pK9Xe",
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
    const handle = await ElementHelper.getElementByXPath("//img[@alt='Member Portait']/parent::div/following-sibling::div/div").getText();
    const numberOfCollapsedSkills = (await this.getAllSkills()).length;
    const country = await ElementHelper.getElementByCss("div._2MEhc3 > span").getText();
    const memberSince = await ElementHelper.getElementByCss(
      "h3._1c9pnV"
    ).getText();
    const tracks = await this.getAllTracks();
    const quote = await ElementHelper.getElementByCss("p._3m4a3E").getText();
    const forumLink = null
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
