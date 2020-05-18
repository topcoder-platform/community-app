import { logger } from "../../../../../../logger/logger";
import * as appconfig from "../../../../../../app-config.json";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { SettingsPage } from "../../settings.po";
import { ConfigHelper } from "../../../../../../utils/config-helper";
import { SettingsPageConstants } from "../../settings.constants";

export class CommunityPage extends SettingsPage {

  /**
   * Gets the Community page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    this.switchTab("communities");
    logger.info("User navigated to Communities Page");
  }

  /**
   * Gets the blockchain community label
   */
  private async getBlockChainLabel() {
    const els = await ElementHelper.getAllElementsByClassName('onoffswitch-label');
    return els[1];
  }

  /**
   * Gets the blockchain community switch used for toggling
   */
  private async getBlockChainSwitch() {
    const els = await ElementHelper.getAllElementsByClassName('onoffswitch-switch');
    return els[1];
  }

  /**
   * Gets the cognitive community label
   */
  private async getCognitiveLabel() {
    const els = await ElementHelper.getAllElementsByClassName('onoffswitch-label');
    return els[3];
  }

  /**
   * Gets the cognitive community switch used for toggling
   */
  private async getCognitiveSwitch() {
    const els = await ElementHelper.getAllElementsByClassName('onoffswitch-switch');
    return els[3];
  }

  /**
   * Returns whether a given community is enabled or not
   * @param community 
   */
  public async isCommunityEnabled(community): Promise<boolean> {
    if (community === SettingsPageConstants.Communities.Blockchain) {
      const blockChainLabel = await this.getBlockChainLabel();
      const bgColor = await blockChainLabel.getCssValue('background-color');
      return bgColor === SettingsPageConstants.Colors.GreyColor ? false : true;
    } else if (community === SettingsPageConstants.Communities.Cognitive) {
      const cognitiveLabel = await this.getCognitiveLabel();
      const bgColor = await cognitiveLabel.getCssValue('background-color');
      return bgColor === SettingsPageConstants.Colors.GreyColor ? false : true;
    }
    return false;
  }

  /**
   * Disables all communities
   */
  public async disableAll() {
    await BrowserHelper.waitUntilVisibilityOf(
      this.heading,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );

    const isBlockchainEnabled = await this.isCommunityEnabled(
      SettingsPageConstants.Communities.Blockchain
    )
    if (isBlockchainEnabled) {
      const blockSwitch =  await this.getBlockChainSwitch();
      await blockSwitch.click();
      await this.waitForSuccessMsg();
    }

    const isCognitiveEnabled = await this.isCommunityEnabled(
      SettingsPageConstants.Communities.Cognitive
    );
    if (isCognitiveEnabled) {
      const cognitiveSwitch =  await this.getCognitiveSwitch();
      await cognitiveSwitch.click();
      await this.waitForSuccessMsg();
    }
  }

  /**
   * Updates a community if enabled from config
   * @param community 
   */
  public async updateCommunity(community: string) {
    if (community === SettingsPageConstants.Communities.Blockchain) {
      const blockChainSwitch = await this.getBlockChainSwitch();
      await blockChainSwitch.click();
    } else if (community === SettingsPageConstants.Communities.Cognitive) {
      const cognitiveSwitch = await this.getCognitiveSwitch();
      await cognitiveSwitch.click();
    }
  }
}