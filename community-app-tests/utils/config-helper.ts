import * as config from "../config-dev.json";

export const ConfigHelper = {
  /**
   * Get current config
   */
  getConfig() {
    return config;
  },

  /**
   * Get login URL
   */
  getLoginURL() {
    return this.getConfig().loginUrl;
  },

  /**
   * Get homepage URL
   */
  getHomePageURL() {
    return this.getConfig().homePageUrl;
  },

  /**
   * Get logout URL
   */
  getLogoutURL() {
    return this.getConfig().logoutUrl;
  },
  /**
   * Get logout URL
   */
  getToolsURL() {
    return this.getConfig().toolsUrl;
  },

  /**
   * Get Username
   */
  getUserName() {
    return this.getConfig().username;
  },

  /**
   * Get Username
   */
  getPassword() {
    return this.getConfig().password;
  }
};
