import { BrowserHelper, ElementHelper, Keys } from 'topcoder-testing-lib';
import { logger } from '../../../../logger/logger';
import { ConfigHelper } from '../../../../utils/config-helper';
import { CommonHelper } from '../common-page/common.helper';

export class HeaderPage {
  /**
   * Gets the Challenge Listing page
   * @param isLoggedIn
   */
  public async open(isLoggedIn: boolean) {
    await BrowserHelper.open(ConfigHelper.getOverviewUrl());
    const tabName = isLoggedIn ? 'My Profile' : 'How It Works';
    // wait for showing page + tab name
    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText('span', tabName),
      'Wait for tab ' + tabName,
      true
    );
    logger.info('header is loaded');
  }

  /**
   * Gets the user handle menu
   */
  private async getUserHandleMenu() {
    const spans = await ElementHelper.getAllElementsByXPath(
      `//span[.='${ConfigHelper.getUserName()}']`
    );
    return spans[2];
  }

  /**
   * Gets the 'Switch to BUSINESS' link in user avatar menu
   */
  private async getSwitchToBusinessLink() {
    const spans = await ElementHelper.getAllElementsByCssContainingText(
      'span',
      'Switch to BUSINESS'
    );
    return spans[1];
  }

  /**
   * Gets the 'Menu' link
   * @param menu
   */
  private getMenuLink(menu) {
    let spans = null;
    if (menu !== 'Forums') {
      spans = ElementHelper.getElementByCssContainingText('span', menu);
    } else
      spans = ElementHelper.getElementByXPath(`//span[.='${menu}']`);
    return spans;
  }

  /**
   * Gets the user info span which redirects to profile page
   * in user avatar menu
   */
  private async getUserInfoSection() {
    const spans = await ElementHelper.getAllElementsByCssContainingText(
      'span',
      ConfigHelper.getEmail()
    );
    return spans[1];
  }

  /**
   * Gets the logo link
   */
  private async getLogoLink() {
    const links = await ElementHelper.getAllElementsByCss("a[href='/']");
    return links[1];
  }

  /**
   * Gets the settings link in user avatar menu
   */
  private async getSettingsLink() {
    const links = await ElementHelper.getAllElementsByCss(
      "a[href='/settings/profile?ref=nav']"
    );
    return links[1];
  }

  /**
   * Gets the help link in user avatar menu
   */
  private async getHelpLink() {
    const links = await ElementHelper.getAllElementsByCssContainingText(
      'a',
      'Help'
    );
    return links[1];
  }

  /**
   * Gets the log out link in user avatar menu
   */
  private async getLogoutLink() {
    const links = await ElementHelper.getAllElementsByCssContainingText(
      'a',
      'Log Out'
    );
    return links[1];
  }

  /**
   * Gets the login link
   */
  private get loginLink() {
    return ElementHelper.getElementByLinkText('LOG IN');
  }

  /**
   * Gets the 'BUSINESS' header link
   */
  private get businessLink() {
    return ElementHelper.getElementByLinkText('BUSINESS');
  }

  /**
   * Gets the search icon
   */
  private get searchIcon() {
    return ElementHelper.getElementByCss('[data-menu="search"]');
  }

  private get searchInput() {
    return ElementHelper.getElementByCss(
      '[placeholder="Find members by username or skill"]'
    );
  }

  /**
   * Gets the notification bell icon
   */
  private async getBellIcon() {
    const xpath = `//a[contains(@href, '/members/${ConfigHelper.getUserName()}')]/parent::div/parent::div/div[position()=1]`;
    const els = await ElementHelper.getAllElementsByXPath(xpath);
    return els[1];
  }

  /**
   * Gets the 'View All Notifications' link from notifications menu
   */
  private async getAllNotificationsLink() {
    const els = await ElementHelper.getAllElementsByCssContainingText(
      'a',
      'View all Notifications'
    );
    return els[1];
  }

  /**
   * Gets the 'Notifications' label from notifications popup
   */
  private async getNotificationsLabel() {
    const els = await ElementHelper.getAllElementsByCssContainingText(
      'span',
      'Notifications'
    );
    return els[3];
  }

  /**
   * Clicks on the logo
   */
  public async clickOnLogoLink() {
    const logoLink = await this.getLogoLink();
    await logoLink.click();
    logger.info('Clicked on logo');
  }

  /**
   * Clicks on the Business link
   */
  public async clickOnBusinessLink() {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.businessLink,
      'Wait for business link',
      false
    );
    await this.businessLink.click();
    logger.info('Clicked on BUSINESS link');
  }

  /**
   * Clicks on Login link
   */
  public async clickOnLoginLink() {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.loginLink,
      'Wait for login link',
      false
    );
    await this.loginLink.click();
    logger.info('Clicked on LOGIN link');
  }

  /**
   * Clicks on the given menu item basis the link text
   * @param menu
   */
  public async clickOnMenu(menu) {
    await this.getMenuLink(menu).click();
    logger.info('Clicked on menu ' + menu);
  }

  /**
   * Opens the user avatar menu
   */
  public async openUserMenu() {
    const userProfileLink = await this.getUserHandleMenu();
    await userProfileLink.click();
    const settingsLink = await this.getSettingsLink();
    expect(await CommonHelper.isDisplayed(settingsLink)).toBe(
      true,
      'Setting link is not displayed'
    );
    const userInfo = await this.getUserInfoSection();
    expect(await CommonHelper.isDisplayed(userInfo)).toBe(
      true,
      'My profile link is not displayed'
    );
    const logoutLink = await this.getLogoutLink();
    expect(await CommonHelper.isDisplayed(logoutLink)).toBe(
      true,
      'Logout link is not displayed'
    );
  }

  /**
   * Clicks on the user info section in the user avatar menu
   */
  public async clickOnUserInfoSection() {
    const userInfo = await this.getUserInfoSection();
    await userInfo.click();
  }

  /**
   * Clicks on the 'SWITCH TO BUSINESS' link in the user avatar menu
   */
  public async clickOnSwitchToBusinessLink() {
    const switchToBusinessLink = await this.getSwitchToBusinessLink();
    await switchToBusinessLink.click();
  }

  /**
   * Clicks on the 'Settings' link in user avatar menu
   */
  public async clickOnSettingsLink() {
    const settingsLink = await this.getSettingsLink();
    await settingsLink.click();
  }

  /**
   * Clicks on the 'Help' link in the user avatar menu
   */
  public async clickOnHelpLink() {
    const helpLink = await this.getHelpLink();
    await helpLink.click();
  }

  /**
   * Clicks on the 'Log Out' link in the user avatar menu
   */
  public async clickOnLogoutLink() {
    const logoutLink = await this.getLogoutLink();
    await logoutLink.click();
  }

  /**
   * Clicks on the notification bell icon
   */
  public async openNotificationsPopup() {
    const bellIcon = await this.getBellIcon();
    await bellIcon.click();
  }

  /**
   * Checks if the notifications popup is open
   */
  public async isNotificationsPopupVisible() {
    const notificationsLabel = await this.getNotificationsLabel();
    return await CommonHelper.isPresent(notificationsLabel);
  }

  /**
   * Checks if the notifications popup is open
   */
  public async isViewAllNotificationsPresent() {
    return await CommonHelper.isPresent(await this.getAllNotificationsLink());
  }

  /**
   * Clicks on the 'View all notifications' link
   */
  public async clickOnViewAllNotificationsLink() {
    const allNotificationsLink = await this.getAllNotificationsLink();
    await allNotificationsLink.click();
  }

  /**
   * Searches for member/skill via the search menu
   * @param query
   */
  public async search(query) {
    const searchIcon = this.searchIcon;

    await BrowserHelper.mouseMove(searchIcon);
    await this.searchInput.sendKeys(query);
    await this.searchInput.sendKeys(Keys.ENTER);
  }

  /**
   * Gets the sub-menu items for the current selected menu
   */
  public async getSubMenuNames() {
    const xpath = `//div[contains(@role, 'search')]//../following-sibling::div//div//a//span[1]`;
    const submenus = [];
    const els = await ElementHelper.getAllElementsByXPath(xpath);
    for (let i = 0; i < els.length; i++) {
      const text = await els[i].getText();
      submenus.push(text);
    }

    return submenus;
  }
}
