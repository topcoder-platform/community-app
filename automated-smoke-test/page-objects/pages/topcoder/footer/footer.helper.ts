import { BrowserHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../logger/logger';
import { FooterPage } from './footer.po';
import { ConfigHelper } from '../../../../utils/config-helper';
import { CommonHelper } from '../common-page/common.helper';
import { FooterConstants } from './footer.constants';
import { ChallengeListingPageObject } from '../challenge-listing/challenge-listing.po';

export class FooterHelper {
  /**
   * Initialize the footer page object
   */
  public static initialize() {
    this.footerPageObject = new FooterPage();
  }

  /**
   * Opens the Challenge Listing page
   */
  public static async open() {
    await ChallengeListingPageObject.open();
  }

  /**
   * Verifies any footer section.
   * It verifies the redirection of the footer links in a given section
   * @param sectionName
   * @param isLoggedIn
   */
  public static async verifyFooterSection(sectionName, isLoggedIn) {
    const menuItem = FooterConstants.getFooterMenu(isLoggedIn)[sectionName];
    const submenus: Object[] = menuItem.submenus;

    const footerLinkTexts = [];
    let footerLinks = await this.footerPageObject.getAllFooterLinksInSection(
      menuItem.text
    );

    for (let i = 0; i < footerLinks.length; i++) {
      // This is needed to prevent stale state exception
      footerLinks = await this.footerPageObject.getAllFooterLinksInSection(
        menuItem.text
      );
      const footerLink = footerLinks[i];
      const text = await footerLink.getText();

      footerLinkTexts.push(text);
      logger.info(footerLink.getText());
      const expectedUrl = submenus[i]['url'];
      expect(text).toEqual(submenus[i]['text']);
      if (
        text === 'Forums' ||
        text === 'Discord' ||
        text === 'Releases & Updates'
      ) {
        const href = await footerLink.getAttribute('href');
        expect(href).toEqual(expectedUrl);
        continue;
      }
      await footerLink.click();
      logger.info('Clicked on link ' + text);
      await BrowserHelper.sleep(2500)
      if (text === 'Website Help') {
        const href = await footerLink.getAttribute('href');
        expect(href).toEqual(expectedUrl);
      } else if (
        text === 'Statistics' ||
        text === 'Changelog' ||
        text === 'All Challenges' ||
        text === 'Programs' ||
        text === 'Join Community'
      ) {
        await CommonHelper.verifyCurrentUrlToContain(expectedUrl);
      } else {
        await CommonHelper.verifyCurrentUrl(expectedUrl);
      }

      await ChallengeListingPageObject.open();
    }

    expect(footerLinkTexts).toEqual(submenus.map((s) => s['text']));
  }

  /**
   * Verifies the social media icons and their redirection
   */
  public static async verifySocialIcons() {
    const configuredSocialLinks = FooterConstants.getSocialLinks();
    const socialLinks = await this.footerPageObject.getAllSocialLinks();
    for (let i = 0; i < socialLinks.length; i++) {
      const socialLink = socialLinks[i];
      await socialLink.click();
      const windowHandles = await BrowserHelper.getAllWindowHandles();
      await BrowserHelper.switchToWindow(windowHandles[1]);
      const currentUrl = await BrowserHelper.getCurrentUrl();
      logger.info("The current URL is '" + currentUrl + "' for Social icon.")
      await BrowserHelper.sleep(2000)
      expect(currentUrl.includes(configuredSocialLinks[i])).toBe(true);
      await BrowserHelper.close();
      await BrowserHelper.switchToWindow(windowHandles[0]);
    }
  }

  /**
   * Verifies the policies link
   */
  public static async verifyPoliciesLink() {
    await this.footerPageObject.clickOnPoliciesLink();
    await BrowserHelper.sleep(1000);
    await CommonHelper.verifyCurrentUrl(ConfigHelper.getPoliciesUrl());
  }

  /**
   * Verifies any footer section.
   * It verifies the redirection of the footer links in a given section
   * @param isLoggedIn
   */
  public static async verifyContentOfFooter(isLoggedIn: boolean) {
    const footerContents = ["Compete", "Tracks", "Community", "HelpCenter", "About"]
    for (let j = 0; j < footerContents.length; j++) {
      let sectionName = footerContents[j]
      const menuItem = FooterConstants.getFooterMenu(isLoggedIn)[sectionName];
      let footerLinks = await this.footerPageObject.getAllFooterLinksInSection(
        menuItem.text
      );
      for (let i = 0; i < footerLinks.length; i++) {
        // This is needed to prevent stale state exception
        footerLinks = await this.footerPageObject.getAllFooterLinksInSection(
          menuItem.text
        );
        const footerLink = footerLinks[i];
        expect(await this.footerPageObject.footerLinkIsVisible(footerLink)).toBe(
          true
        );
      }
    }
  }

  private static footerPageObject: FooterPage;
}
