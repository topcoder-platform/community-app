import {
  BrowserHelper,
  ElementHelper,
  ExpectedConditionsHelper,
} from "topcoder-testing-lib";
import * as appconfig from "../../../../app-config.json";
import { logger } from "../../../../logger/logger";

export const CommonHelper = {
  /**
   * Click on an element containing text
   * @param {String} text
   */
  async clickOnElementContainingText(text) {
    const element = ElementHelper.getElementContainingText(text);
    await element.click();
    logger.info(`Clicked on element containing text ${text}`);
  },

  /**
   * Click on a html tag element containing text
   * @param {String} tag
   * @param {String} text
   */
  async clickOnTagElementContainingText(tag, text) {
    const element = ElementHelper.getTagElementContainingText(tag, text);
    await element.click();
    logger.info(`Clicked on ${tag} element containing text ${text}`);
  },

  /**
   * Verify page title
   * @param {String} title
   */
  async verifyPageTitle(title) {
    const pageTitle = await BrowserHelper.getTitle();
    logger.info(`Current page title is ${pageTitle}`);
    expect(pageTitle).toEqual(
      title,
      `Provided title ${title} does not match page title ${pageTitle}`
    );
  },

  /**
   * Verify page url
   * @param {String} url
   */
  async verifyCurrentUrl(url) {
    const currentUrl = await BrowserHelper.getCurrentUrl();
    logger.info(`Current page url is ${currentUrl}`);
    expect(url).toEqual(
      currentUrl,
      `Provided Url ${url} does not match page URL ${currentUrl}`
    );
  },

  /**
   * Verify pop window exists
   */
  async verifyPopupWindow() {
    const windows = await BrowserHelper.getAllWindowHandles();
    expect(windows.length).toBe(2, "Popup window did not open");
    await BrowserHelper.switchToWindow(windows[1]);
    await BrowserHelper.close();
    await BrowserHelper.switchToWindow(windows[0]);
  },

  /**
   * Verify pop up window's title
   * @param {String} title
   */
  async verifyPopupWindowWithTitle(title) {
    await this.verifyPopupWindow();
    const windows = await BrowserHelper.getAllWindowHandles();
    const windowTitle = ElementHelper.getElementByXPath("//title");
    BrowserHelper.setIgnoreSync(true);
    await BrowserHelper.switchToWindow(windows[1]);
    const condition = await ExpectedConditionsHelper.getUntilPresenceOfCondition(
      windowTitle
    );
    await BrowserHelper.wait(
      condition,
      appconfig.Timeout.ElementPresence,
      appconfig.LoggerErrors.ElementPresence
    );
    const popupWindowTitle = await BrowserHelper.getTitle();
    expect(popupWindowTitle).toEqual(
      title,
      `Provided title ${title} does not match page title ${popupWindowTitle}`
    );
    await BrowserHelper.close();
    await BrowserHelper.switchToWindow(windows[0]);
  },

  /**
   * Verify pop up window's url
   * @param {String} expectedUrl
   */
  async verifyPopupWindowWithUrl(expectedUrl) {
    await this.verifyPopupWindow();
    const windows = await BrowserHelper.getAllWindowHandles();
    await BrowserHelper.switchToWindow(windows[1]);
    const url = await BrowserHelper.getCurrentUrl();
    expect(url).toEqual(
      expectedUrl,
      `Provided url ${expectedUrl} does not match current url ${url}`
    );
    await BrowserHelper.close();
    await BrowserHelper.switchToWindow(windows[0]);
  },

  /**
   * Get anchor element containing text and verify the href in that element
   * @param {String} text
   * @param {String} href
   */
  async verifyHrefInAnchorContainingText(text, href) {
    const anchorElement = ElementHelper.getTagElementContainingText("a", text);
    const anchorElementHref = await anchorElement.getAttribute("href");
    expect(anchorElementHref).toEqual(
      href,
      `Provided href ${href} does not match anchor element href ${anchorElementHref}`
    );
  },

  /**
   * Switch tab by opening tab and optionally verify header of new tab
   * @param {String} tag
   * @param {String} text
   * @param {String|Null} newTabHeaderTag
   * @param {String|Null} newTabHeaderText
   */
  async switchTabByClickingOnTagWithText(
    tag,
    text,
    newTabHeaderTag = null,
    newTabHeaderText = null
  ) {
    await ElementHelper.getTagElementContainingText(tag, text).click();

    if (!newTabHeaderTag || !newTabHeaderText) {
      // Don't verify header if not given
      return;
    }
    const headerElement = ElementHelper.getTagElementContainingText(
      newTabHeaderTag,
      newTabHeaderText
    );
    const condition = await ExpectedConditionsHelper.getUntilVisibilityOfCondition(
      headerElement
    );
    await BrowserHelper.wait(
      condition,
      appconfig.Timeout.ElementVisibility,
      appconfig.LoggerErrors.ElementVisibilty
    );
  },
};
