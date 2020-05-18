import * as config from "../config.json";

export const ConfigHelper = {
  /**
   * Get current config
   */
  getConfig() {
    return config;
  },

  /**
   * Gets the url on redirection after clicking the header logo
   */
  getLogoRedirectionUrl() {
    return this.getConfig().logoRedirectionUrl;
  },

  /**
   * Gets the url on redirection after clicking the business link
   */
  getBusinessUrl() {
    return this.getConfig().businessUrl;
  },

  /**
   * Gets the policies url
   */
  getPoliciesUrl() {
    return this.getConfig().policiesUrl;
  },

  /**
   * Get login URL
   */
  getLoginUrl() {
    return this.getConfig().loginUrl;
  },

  /**
   * Get homepage URL
   */
  getHomePageUrl() {
    return this.getConfig().homePageUrl;
  },

  /**
   * Get logout URL
   */
  getLogoutUrl() {
    return this.getConfig().logoutUrl;
  },

  /**
   * Get tools URL
   */
  getToolsUrl() {
    return this.getConfig().toolsUrl;
  },

  /**
   * Get account URL
   */
  getAccountUrl() {
    return this.getConfig().accountUrl;
  },

  /**
   * Get profile URL
   */
  getProfileUrl() {
    return this.getConfig().profileUrl;
  },

  /**
   * Get challenge listing URL
   */
  getChallengeListingUrl() {
    return this.getConfig().challengeListingUrl;
  },

  /**
   * Get Username
   */
  getUserName() {
    return this.getConfig().username;
  },

  /**
   * Gets the sub-menu url given the sub-menu name
   * @param name
   * @param isLoggedIn
   */
  getSubMenuUrl(name, isLoggedIn) {
    let menu = null;
    if (isLoggedIn) {
      menu = this.getConfig().subMenuUrlsAfterLogin[name];
    }
    return menu || this.getConfig().subMenuUrls[name];
  },

  /**
   * Gets the footer url given the footer link name
   * @param name
   * @param isLoggedIn
   */
  getFooterLink(name, isLoggedIn) {
    let link = null;
    if (isLoggedIn) {
      link = this.getConfig().footerLinksAfterLogin[name];
    }
    return link || this.getConfig().footerLinks[name];
  },

  /**
   * Gets the social media url given the social media
   * @param socialMedia
   */
  getSocialLink(socialMedia) {
    return this.getConfig().socialLinks[socialMedia];
  },

  /**
   * Gets the preferences url
   */
  getPreferencesUrl() {
    return this.getConfig().preferencesUrl;
  },

  /**
   * Gets the forum settings url
   */
  getForumSettingUrl() {
    return this.getConfig().forumSettingUrl;
  },

  /**
   * Get the payment settings url
   */
  getPaymentSettingUrl() {
    return this.getConfig().paymentSettingUrl;
  },

  /**
   * Gets the help page url
   */
  getHelpUrl() {
    return this.getConfig().helpUrl;
  },

  /**
   * Gets the search page url
   */
  getSearchUrl() {
    return this.getConfig().searchUrl;
  },

  /**
   * Gets the notifications page url
   */
  getAllNotificationsUrl() {
    return this.getConfig().allNotificationsUrl;
  },

  /**
   * Get Password
   */
  getPassword() {
    return this.getConfig().password;
  },

  /**
   * Get Email
   */
  getEmail() {
    return this.getConfig().email;
  },
};
