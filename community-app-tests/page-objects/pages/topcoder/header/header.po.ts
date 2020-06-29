import { BrowserHelper, ElementHelper, Keys } from "topcoder-testing-lib";
import { logger } from "../../../../logger/logger";
import { ConfigHelper } from "../../../../utils/config-helper";

export class HeaderPage {
  /**
   * Gets the Challenge Listing page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getOverviewUrl());
  }

  /**
   * Gets the user handle menu
   */
  private async getUserHandleMenu() {
    const spans = await ElementHelper.getAllElementsByCssContainingText(
      "span",
      ConfigHelper.getUserName()
    );
    return spans[3];
  }

  /**
   * Gets the 'Switch to BUSINESS' link in user avatar menu
   */
  private async getSwitchToBusinessLink() {
    const spans = await ElementHelper.getAllElementsByCssContainingText(
      "span",
      "Switch to BUSINESS"
    );
    return spans[1];
  }

  /**
   * Gets the 'Menu' link
   * @param menu
   */
  private async getMenuLink(menu) {
    const spans = await ElementHelper.getElementByCssContainingText(
      "span",
      menu
    );
    return spans;
  }

  /**
   * Gets the user info span which redirects to profile page
   * in user avatar menu
   */
  private async getUserInfoSection() {
    const spans = await ElementHelper.getAllElementsByCssContainingText(
      "span",
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
      "a[href='/settings/profile']"
    );
    return links[1];
  }

  /**
   * Gets the help link in user avatar menu
   */
  private async getHelpLink() {
    const links = await ElementHelper.getAllElementsByCssContainingText(
      "a",
      "Help"
    );
    return links[1];
  }

  /**
   * Gets the log out link in user avatar menu
   */
  private async getLogoutLink() {
    const links = await ElementHelper.getAllElementsByCssContainingText(
      "a",
      "Log Out"
    );
    return links[1];
  }

  /**
   * Gets the login link
   */
  private get loginLink() {
    return ElementHelper.getElementByLinkText("LOGIN");
  }

  /**
   * Gets the 'BUSINESS' header link
   */
  private get businessLink() {
    return ElementHelper.getElementByLinkText("BUSINESS");
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
      "a",
      "View all Notifications"
    );
    return els[1];
  }

  /**
   * Gets the 'Notifications' label from notifications popup
   */
  private async getNotificationsLabel() {
    const els = await ElementHelper.getAllElementsByCssContainingText(
      "span",
      "Notifications"
    );
    return els[3];
  }

  /**
   * Clicks on the logo
   */
  public async clickOnLogoLink() {
    const logoLink = await this.getLogoLink();
    await logoLink.click();
    logger.info("Clicked on logo");
  }

  /**
   * Clicks on the Business link
   */
  public async clickOnBusinessLink() {
    const businessLink = this.businessLink;
    await BrowserHelper.waitUntilVisibilityOf(businessLink);
    await businessLink.click();
    logger.info("Clicked on BUSINESS link");
  }

  /**
   * Clicks on Login link
   */
  public async clickOnLoginLink() {
    const loginLink = this.loginLink;
    await BrowserHelper.waitUntilVisibilityOf(loginLink);
    await loginLink.click();
    logger.info("Clicked on LOGIN link");
  }

  /**
   * Clicks on the given menu item basis the link text
   * @param menu
   */
  public async clickOnMenu(menu) {
    const menuLink = await this.getMenuLink(menu);
    await menuLink.click();
    logger.info("Clicked on menu " + menu);
  }

  /**
   * Opens the user avatar menu
   */
  public async openUserMenu() {
    const userProfileLink = await this.getUserHandleMenu();
    await userProfileLink.click();
    // await BrowserHelper.waitUntilVisibilityOf(await this.getUserInfoSection());
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
    return await notificationsLabel.isDisplayed();
  }

  /**
   * Checks if the notifications popup is open
   */
  public async isViewAllNotificationsPresent() {
    return await (await this.getAllNotificationsLink()).isPresent();
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
