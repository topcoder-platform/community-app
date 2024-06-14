import * as config from '../config/automation-config-prod.json';
import { TcElementImpl } from 'topcoder-testing-lib/dist/src/tc-element-impl';

export interface ChallengeLinks {
  rssFeedUrl: string;
  aboutUrl: string;
  contactUrl: string;
  helpUrl: string;
  privacyUrl: string;
  termsUrl: string;
}

export interface ChallengeDetail {
  rssFeedUrl: string;
  url: string;
  termsLinkText: string;
  challengeName: string;
  challengeTag: string;
  termUrl: string;
  forumUrl: string;
  submissionUrl: string;
  scorecardUrl: string;
  searchText: string,
}

export interface CommunityCardInfo {
  name: string;
  learnMoreUrl: string;
}

export interface ChallengeCardInfo {
  name: string;
  currentPhase: string;
  linkToSubmit: string;
  userRole: string;
}

export interface MyDashboardConfig {
  url: string;
  challenge: ChallengeCardInfo;
  community: CommunityCardInfo;
}

export interface MemberHaveWebSectionInfoConfig {
  handle: string;
  webLink: string;
}

export interface MemberProfileInfoConfig {
  handle: string;
  numberOfCollapsedSkills: number;
  verifiedSkill?: string[];
  noneVerifiedSkill?: string;
  country: string;
  memberSince: string;
  tracks: string[];
  quote: string;
  forumLink: string;
}

export interface MemberProfileSubtrackConfig {
  name: string;
  link?: string;
  info?: string;
  infoTitle?: string;
  card?: TcElementImpl;
}

export interface MemberProfileTrackConfig {
  handle: string;
  trackName: string;
  numberOfSubtracks: number;
  winInfo?: MemberProfileSubtrackConfig;
  fullfillmentInfo?: MemberProfileSubtrackConfig;
  ratingInfo?: MemberProfileSubtrackConfig;
}

export interface MemberProfileConfig {
  url: string;
  profileInfo: MemberProfileInfoConfig;
  copilotProfile: MemberProfileTrackConfig;
  designProfile: MemberProfileTrackConfig;
  developmentProfile: MemberProfileTrackConfig;
  dataScienceProfile: MemberProfileTrackConfig;
  memberHaveWebSectionInfo: MemberHaveWebSectionInfoConfig;
}

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
   * Gets the url on redirection after clicking the Switch To business link
   */
  getSwitchToBusinessUrl() {
    return this.getConfig().switchToBusinessUrl;
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
   * Get Redirected login URL
   */
  getRedirectLoginUrl() {
    return this.getConfig().redirectLoginUrl;
  },

  /**
   * Get homepage URL
   */
  getHomePageUrl(): string {
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
   * Get splash listing URL
   */
  getSplashPageUrl() {
    return this.getConfig().splashPageUrl;
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
   */
  getFooterLink(name) {
    let link = null;
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
   * Gets the help page url
   */
  getOverviewUrl() {
    return this.getConfig().subMenuUrls['overview'];
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

  /**
   * Gets challenges link
   */
  getChallangesLinks(): ChallengeLinks {
    return this.getConfig().challangesLinks;
  },

  /**
   * Gets challenge detail
   */
  getChallengeDetail(): ChallengeDetail {
    return this.getConfig().challengeDetail;
  },

  /**
   * Get my dashboard config
   */
  getMyDashboardConfig(): MyDashboardConfig {
    return this.getConfig().myDashboard;
  },

  /**
   * Get member profile config
   */
  getMemberProfileConfig(): MemberProfileConfig {
    return this.getConfig().memberProfile;
  },
};
