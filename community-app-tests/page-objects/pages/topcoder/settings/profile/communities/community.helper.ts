import { logger } from "../../../../../../logger/logger";
import { CommunityPage } from "./community.po";
import { SettingsPageConstants } from "../../settings.constants";

export class CommunityPageHelper {
  /**
   * sets the Community page object
   */
  public static setCommunityPage(communityPage) {
    this.communityPageObject = communityPage;
  }

  /**
   * Opens the community page in the browser
   */
  public static async open() {
    this.communityPageObject = new CommunityPage();
    await this.communityPageObject.open();
  }

  /**
   * Disables all the communities
   */
  public static async disableAll() {
    await this.communityPageObject.disableAll();
  }

  /**
   * Updates the community if enabled from config
   * @param community
   */
  public static async verifyUpdateCommunity(community) {
    const isBlockchainEnabled = await this.communityPageObject.isCommunityEnabled(
      SettingsPageConstants.Communities.Blockchain
    );
    if (
      (community.blockchain && !isBlockchainEnabled) ||
      (!community.blockchain && isBlockchainEnabled)
    ) {
      await this.communityPageObject.updateCommunity(
        SettingsPageConstants.Communities.Blockchain
      );
      await this.communityPageObject.waitForSuccessMsg();
    }
    const isCognitiveEnabled = await this.communityPageObject.isCommunityEnabled(
      SettingsPageConstants.Communities.Cognitive
    );
    if (
      (community.cognitive && !isCognitiveEnabled) ||
      (!community.cognitive && isCognitiveEnabled)
    ) {
      await this.communityPageObject.updateCommunity(
        SettingsPageConstants.Communities.Cognitive
      );
      await this.communityPageObject.waitForSuccessMsg();
    }

    let isEnabled = await this.communityPageObject.isCommunityEnabled(
      SettingsPageConstants.Communities.Blockchain
    );
    expect(isEnabled).toBe(community.blockchain);

    isEnabled = await this.communityPageObject.isCommunityEnabled(
      SettingsPageConstants.Communities.Cognitive
    );
    expect(isEnabled).toBe(community.cognitive);
  }

  private static communityPageObject: CommunityPage;
}
