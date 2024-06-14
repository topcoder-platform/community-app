import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../../../config/app-config.json';
import { logger } from '../../../../logger/logger';
import TcElement from 'topcoder-testing-lib/dist/src/tc-element';
import { TcElementImpl } from 'topcoder-testing-lib/dist/src/tc-element-impl';

/**
 * Wait until condition return true
 * @param func function for checking condition
 * @param extraMessage extra error message when timeout
 * @param isPageLoad wait for loading page
 */
const waitUntil = async (
  func: () => any,
  extraMessage: string,
  isPageLoad: boolean
) => {
  await BrowserHelper.waitUntil(
    func,
    isPageLoad
      ? appconfig.Timeout.PageLoad
      : appconfig.Timeout.ElementVisibility,
    (isPageLoad
      ? appconfig.LoggerErrors.PageLoad
      : appconfig.LoggerErrors.ElementVisibilty) +
    '.' +
    extraMessage
  );
};

export const CommonHelper = {
  /**
   * Click on an element containing text
   * @param {String} text
   */
  async clickOnElementContainingText(text: string) {
    const element = ElementHelper.getElementContainingText(text);
    await element.click();
    logger.info(`Clicked on element containing text ${text}`);
  },

  /**
   * Click on a html tag element containing text
   * @param {String} tag
   * @param {String} text
   */
  async clickOnTagElementContainingText(tag: string, text: string) {
    const element = CommonHelper.findElementByText(tag, text);
    await element.click();
    logger.info(`Clicked on ${tag} element containing text ${text}`);
  },

  /**
   * Verify page title
   * @param {String} title
   */
  async verifyPageTitle(title: string) {
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
  async verifyCurrentUrl(url: string) {
    const currentUrl = await BrowserHelper.getCurrentUrl();
    logger.info(`Current page url is ${currentUrl}`);
    expect(url).toEqual(
      currentUrl,
      `Provided Url ${url} does not match page URL ${currentUrl}`
    );
  },

  /**
   * Verify page url to contain the given url
   * @param {String} url
   */
  async verifyCurrentUrlToContain(url: string) {
    const currentUrl = await BrowserHelper.getCurrentUrl();
    logger.info(`Current page url is ${currentUrl}`);
    expect(currentUrl).toContain(
      url,
      `Provided Url ${url} is not present in page URL ${currentUrl}`
    );
  },

  /**
   * Verify pop window exists
   */
  async verifyPopupWindow() {
    const windows = await BrowserHelper.getAllWindowHandles();
    expect(windows.length).toBe(2, 'Popup window did not open');
    await BrowserHelper.switchToWindow(windows[1]);
    await BrowserHelper.close();
    await BrowserHelper.switchToWindow(windows[0]);
  },

  /**
   * Verify pop up window's title
   * @param {String} title
   */
  async verifyPopupWindowWithTitle(title: string) {
    const windows = await BrowserHelper.getAllWindowHandles();
    expect(windows.length).toBe(2, 'Popup window did not open');
    await BrowserHelper.switchToWindow(windows[1]);
    BrowserHelper.setIgnoreSync(true);
    await CommonHelper.waitUntilPresenceOf(
      () => ElementHelper.getElementByXPath('//title'),
      'wait for popup window with title',
      false
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
   * @param {String} customeErrorMessage
   */
  async verifyPopupWindowWithUrl(
    expectedUrl: string,
    customeErrorMessage: string = ''
  ) {
    const windows = await BrowserHelper.getAllWindowHandles();
    expect(windows.length).toBe(2, 'Popup window did not open');
    await BrowserHelper.switchToWindow(windows[1]);
    const url = await BrowserHelper.getCurrentUrl();
    expect(url).toBe(
      expectedUrl,
      customeErrorMessage
        ? customeErrorMessage
        : `Provided url ${expectedUrl} does not match current url ${url}`
    );
    await BrowserHelper.close();
    await BrowserHelper.switchToWindow(windows[0]);
  },

  /**
   * Get anchor element containing text and verify the href in that element
   * @param {String} text
   * @param {String} href
   */
  async verifyHrefInAnchorContainingText(text: string, href: string) {
    const anchorElement = CommonHelper.findElementByText('a', text);
    const anchorElementHref = await anchorElement.getAttribute('href');
    expect(anchorElementHref).toEqual(
      href,
      `Provided href ${href} does not match anchor element href ${anchorElementHref}`
    );
  },

  /**
   * Switch tab by opening tab and optionally verify header of new tab
   * @param {String} tag
   * @param {String} text
   */
  async switchTabByClickingOnTagWithText(tag: string, text: string) {
    await CommonHelper.waitUntilVisibilityOf(
      () => CommonHelper.findElementByText(tag, text),
      'new tag header show',
      false
    );
    await CommonHelper.findElementByText(tag, text).click();
  },

  /**
   * Wait until the element becomes visible
   * @param {TcElementImpl} tcElement element
   * @param {TcElementImpl} extraMessage extra message
   * @param {Boolean} isPageLoad is loading page
   */
  async waitUntilVisibilityOf(
    func: () => TcElement,
    extraMessage: string,
    isPageLoad: boolean
  ) {
    await waitUntil(
      () => async () => {
        try {
          return await func().isDisplayed();
        } catch {
          // element is not attached to the DOM of a page.
          return false;
        }
      },
      extraMessage,
      isPageLoad
    );
  },

  /**
   * Wait until the element becomes invisible
   * @param {TcElementImpl} tcElement element
   * @param {TcElementImpl} extraMessage extra message
   * @param {Boolean} isPageLoad is loading page
   */
  async waitUntilInVisibilityOf(
    func: () => TcElement,
    extraMessage: string,
    isPageLoad: boolean
  ) {
    await waitUntil(
      () => async () => {
        try {
          return !(await func().isDisplayed());
        } catch {
          // element is not attached to the DOM of a page.
          return true;
        }
      },
      extraMessage,
      isPageLoad
    );
  },

  /**
   * Check if element is displayed
   * @param {TcElementImpl} element element
   */
  async isDisplayed(element: TcElement): Promise<boolean> {
    try {
      return await element.isDisplayed();
    } catch {
      // element is not attached to the DOM of a page.
      return false;
    }
  },

  /**
   * Check if element is present
   * @param {TcElementImpl} element element
   */
  async isPresent(element: TcElement): Promise<boolean> {
    try {
      return await element.isPresent();
    } catch {
      // element is not attached to the DOM of a page.
      return false;
    }
  },

  /**
   * Wait until the element is present
   * @param {TcElementImpl} tcElement element
   * @param {TcElementImpl} extraMessage extra message
   * @param {Boolean} isPageLoad is loading page
   */
  async waitUntilPresenceOf(
    func: () => TcElement,
    extraMessage: string,
    isPageLoad: boolean
  ) {
    await BrowserHelper.waitUntil(
      () => async () => {
        try {
          return await func().isPresent();
        } catch {
          // element is not attached to the DOM of a page.
          return false;
        }
      },
      isPageLoad
        ? appconfig.Timeout.PageLoad
        : appconfig.Timeout.ElementPresence,
      (isPageLoad
        ? appconfig.LoggerErrors.PageLoad
        : appconfig.LoggerErrors.ElementPresence) +
      '.' +
      extraMessage
    );
  },

  /**
   * Wait until the condition is true
   * @param {function} func
   * @param {TcElementImpl} extraMessage extra message
   * @param {Boolean} isPageLoad is loading page
   */
  async waitUntil(func: () => any, extraMessage: string, isPageLoad: boolean) {
    await waitUntil(func, extraMessage, isPageLoad);
  },

  /**
   * Get link by arial label
   * @param label arial lable
   */
  getLinkByAriaLabel(label: string) {
    return ElementHelper.getElementByCss('[aria-label="' + label + '"]');
  },

  /**
   * Get all links by arial label
   * @param label arial lable
   */
  getAllLinksByAriaLabel(label: string) {
    return ElementHelper.getAllElementsByCss('[aria-label="' + label + '"]');
  },

  /**
   * Get element that contain text
   * @param tag tag
   * @param text text contain
   * @param parent parent element
   */
  findElementByText(
    tag: string,
    text: string,
    parent: TcElementImpl = undefined
  ) {
    return ElementHelper.getElementByXPath(
      '//' + tag + '[contains(text(), "' + text + '")]',
      parent
    );
  },

  /**
   * Get element by attribute value
   * @param tag tag
   * @param attribute attribute
   * @param value attribute value
   * @param parent parent element
   */
  findElementByAttribute(
    tag: string,
    attribute: string,
    value: string,
    parent: TcElementImpl = undefined
  ) {
    return ElementHelper.getElementByCss(
      `${tag}[${attribute}="${value}"]`,
      parent
    );
  },

  /**
   * Get all h2 fields
   */
  get h2Fields() {
    return ElementHelper.getAllElementsByTag('h2');
  },

  /**
   * get select option element
   */
  get selectOptionElement() {
    return ElementHelper.getElementByClassName('Select-option');
  },

  /**
   * get all select options element
   */
  get selectAllOptionsElement() {
    return ElementHelper.getAllElementsByClassName('Select-option');
  },
};
