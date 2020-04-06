import * as config from "../config.json";

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
   * Get logout URL
   */
  getToolsUrl() {
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
