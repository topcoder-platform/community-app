import { BrowserHelper, ElementHelper, Keys } from "topcoder-testing-lib";
import { logger } from "../../../../logger/logger";
import { ConfigHelper } from "../../../../utils/config-helper";

export class FooterPage {
  /**
   * Gets the Challenge Listing page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getChallengeListingUrl());
  }

  /**
   * Gets the policies link
   */
  private get policiesLink() {
    return ElementHelper.getElementByLinkText("Policies");
  }

  /**
   * Gets all the links under a particular section in the footer
   * @param sectionName
   */
  public async getAllFooterLinksInSection(sectionName) {
    const xpath = `//h4[text()="${sectionName}"]/following-sibling::ul//li//a`;
    const footerLinks = await ElementHelper.getAllElementsByXPath(xpath);
    return footerLinks;
  }

  /**
   * Gets all social media links in footer
   */
  public async getAllSocialLinks() {
    const socialLinks = await ElementHelper.getAllElementsByXPath(
      `//h4[text()='FOLLOW US']/following-sibling::div//a`
    );
    return socialLinks;
  }
  /**
   * Clicks on the policies link
   */
  public async clickOnPoliciesLink() {
    return this.policiesLink.click();
  }
}
