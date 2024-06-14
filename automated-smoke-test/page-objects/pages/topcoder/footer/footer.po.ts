import { TcElementImpl } from 'topcoder-testing-lib/dist/src/tc-element-impl';
import { ElementHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../common-page/common.helper';

export class FooterPage {
  /**
   * Gets the policies link
   */
  private get policiesLink() {
    return ElementHelper.getElementByLinkText('Policies');
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

  /**
   * Checks if the footer links are visible
   */
  public async footerLinkIsVisible(footerLink: TcElementImpl) {
    return await CommonHelper.isPresent(footerLink);
  }

  /**
   * Wait till __social icon__ is _clickable_ and _displayed_.
   * @param socialLink 
   */
  public async waitTillIconDisplayedAndClickable(socialLink: TcElementImpl) {
    await CommonHelper.waitUntil(() => socialLink.isEnabled(), 'The Social link icon is not enabled', true)
  }
}
