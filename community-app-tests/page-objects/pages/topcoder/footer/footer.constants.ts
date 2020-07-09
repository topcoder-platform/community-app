import { ConfigHelper } from "../../../../utils/config-helper";

export class FooterConstants {
  /**
   * Footer menu links
   * @param isLoggedIn - is user logged in
   */
  public static getFooterMenu(isLoggedIn?: boolean) {
    const menuConfiguration = {
      Compete: {
        submenus: [
          {
            text: "All Challenges",
            url: ConfigHelper.getFooterLink("allChallenges", isLoggedIn),
          },
          {
            text: "Competitive Programming",
            url: ConfigHelper.getFooterLink(
              "competitiveProgramming",
              isLoggedIn
            ),
          },
          {
            text: "Gig Work",
            url: ConfigHelper.getFooterLink("taas", isLoggedIn),
          },
        ],
        text: "COMPETE",
      },
      Tracks: {
        submenus: [
          {
            text: "Competitive Programming",
            url: ConfigHelper.getFooterLink(
              "competitiveProgrammingThrive",
              isLoggedIn
            ),
          },
          {
            text: "Data Science",
            url: ConfigHelper.getFooterLink("dataScienceThrive", isLoggedIn),
          },
          {
            text: "Design",
            url: ConfigHelper.getFooterLink("designThrive", isLoggedIn),
          },
          {
            text: "Development",
            url: ConfigHelper.getFooterLink("developmentThrive", isLoggedIn),
          },
          {
            text: "QA",
            url: ConfigHelper.getFooterLink("qaThrive", isLoggedIn),
          },
        ],
        text: "TRACKS",
      },
      Community: {
        submenus: [
          {
            text: "Blog",
            url: ConfigHelper.getFooterLink("blog", isLoggedIn),
          },
          {
            text: "Events Calendar",
            url: ConfigHelper.getFooterLink("events", isLoggedIn),
          },
          {
            text: "Forums",
            url: ConfigHelper.getFooterLink("forums", isLoggedIn),
          },
          {
            text: "Programs",
            url: ConfigHelper.getFooterLink("programs", isLoggedIn),
          },
          {
            text: "Statistics",
            url: ConfigHelper.getFooterLink("statistics", isLoggedIn),
          },
          {
            text: "TCO",
            url: ConfigHelper.getFooterLink("tco", isLoggedIn),
          },
          {
            text: "Thrive",
            url: ConfigHelper.getFooterLink("thrive", isLoggedIn),
          },
        ],
        text: "COMMUNITY",
      },
      HelpCenter: {
        submenus: [
          {
            text: "Getting Paid",
            url: ConfigHelper.getFooterLink("gettingPaid", isLoggedIn),
          },
          {
            text: "FAQ",
            url: ConfigHelper.getFooterLink("faq", isLoggedIn),
          },
          {
            text: "General Info",
            url: ConfigHelper.getFooterLink("generalInfo", isLoggedIn),
          },
          {
            text: "Website Help",
            url: ConfigHelper.getFooterLink("websiteHelp", isLoggedIn),
          },
        ],
        text: "HELP CENTER",
      },
      About: {
        submenus: [
          {
            text: "Admins",
            url: ConfigHelper.getFooterLink("admins", isLoggedIn),
          },
          {
            text: "Contact Us",
            url: ConfigHelper.getFooterLink("contactUs", isLoggedIn),
          },
          {
            text: "Join Community",
            url: ConfigHelper.getFooterLink("joinCommunity", isLoggedIn),
          },
          {
            text: "About Community",
            url: ConfigHelper.getFooterLink("aboutCommunity", isLoggedIn),
          },
          {
            text: "Changelog",
            url: ConfigHelper.getFooterLink("changeLog", isLoggedIn),
          },
          {
            text: "Talk to Sales",
            url: ConfigHelper.getFooterLink("talkToSales", isLoggedIn),
          },
          {
            text: "Terms",
            url: ConfigHelper.getFooterLink("terms", isLoggedIn),
          },
        ],
        text: "ABOUT",
      },
    };

    return menuConfiguration;
  }

  /**
   * Social media links
   */
  public static getSocialLinks() {
    return [
      ConfigHelper.getSocialLink("facebook"),
      ConfigHelper.getSocialLink("youtube"),
      ConfigHelper.getSocialLink("linkedin"),
      ConfigHelper.getSocialLink("twitter"),
      ConfigHelper.getSocialLink("instagram"),
    ];
  }
}
