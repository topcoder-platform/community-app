import { ConfigHelper } from '../../../../utils/config-helper';

export class HeaderConstants {
  /**
   * Challenge Listing page menu
   */
  public static getMenu(isLoggedIn?: boolean) {
    const menuConfiguration = {
      Community: {
        submenus: [
          {
            text: 'Overview',
            url: ConfigHelper.getSubMenuUrl('overviewUrl', isLoggedIn),
          },
          {
            text: 'How It Works',
            url: ConfigHelper.getSubMenuUrl('howItWorks', isLoggedIn),
          },
        ],
        text: 'COMMUNITY',
      },
      Compete: {
        submenus: [
          {
            text: 'All Challenges',
            url: ConfigHelper.getSubMenuUrl('allChallenges', isLoggedIn),
          },
          {
            text: 'Competitive Programming',
            url: ConfigHelper.getSubMenuUrl(
              'competitiveProgramming',
              isLoggedIn
            ),
          },
          {
            text: 'Gig Work',
            url: ConfigHelper.getSubMenuUrl('taas', isLoggedIn),
          },
          {
            text: 'Practice',
            url: ConfigHelper.getSubMenuUrl('practice', isLoggedIn),
          },
        ],
        text: 'Compete',
      },
      Tracks: {
        submenus: [
          {
            text: 'Competitive Programming',
            url: ConfigHelper.getSubMenuUrl(
              'competitiveProgrammingThrive',
              isLoggedIn
            ),
          },
          {
            text: 'Data Science',
            url: ConfigHelper.getSubMenuUrl('dataScienceThrive', isLoggedIn),
          },
          {
            text: 'Design',
            url: ConfigHelper.getSubMenuUrl('designThrive', isLoggedIn),
          },
          {
            text: 'Development',
            url: ConfigHelper.getSubMenuUrl('developmentThrive', isLoggedIn),
          },
          {
            text: 'QA',
            url: ConfigHelper.getSubMenuUrl('qaThrive', isLoggedIn),
          },
        ],
        text: 'Tracks',
      },
      Explore: {
        submenus: [
          {
            text: 'TCO',
            url: ConfigHelper.getSubMenuUrl('tco', isLoggedIn),
          },
          {
            text: 'Programs',
            url: ConfigHelper.getSubMenuUrl('programs', isLoggedIn),
          },
          {
            text: 'Forums',
            url: ConfigHelper.getSubMenuUrl('forums', isLoggedIn),
          },
          {
            text: 'Statistics',
            url: ConfigHelper.getSubMenuUrl('statistics', isLoggedIn),
          },
          {
            text: 'Blog',
            url: ConfigHelper.getSubMenuUrl('blog', isLoggedIn),
          },
          {
            text: 'Thrive',
            url: ConfigHelper.getSubMenuUrl('thrive', isLoggedIn),
          },
        ],
        text: 'Explore',
      },
    };

    if (isLoggedIn) {
      menuConfiguration['Community'] = {
        submenus: [
          {
            text: 'Home',
            url: ConfigHelper.getSubMenuUrl('home', isLoggedIn) + "?ref=nav",
          },
          {
            text: 'My Profile',
            url: ConfigHelper.getSubMenuUrl('myProfile', isLoggedIn),
          },
          {
            text: 'Payments',
            url: ConfigHelper.getSubMenuUrl('payments', isLoggedIn),
          },
        ],
        text: 'COMMUNITY',
      };
    }

    return menuConfiguration;
  }
}
