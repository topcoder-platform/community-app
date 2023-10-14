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
            url: ConfigHelper.getFooterLink("allChallenges"),
          },
          {
            text: "Competitive Programming",
            url: ConfigHelper.getFooterLink("competitiveProgramming"),
          },
          {
            text: "Gig Work",
            url: ConfigHelper.getFooterLink("taas"),
          },
          {
            text: "Practice",
            url: ConfigHelper.getFooterLink("practice"),
          },
        ],
        text: "COMPETE",
      },
      Tracks: {
        submenus: [
          {
            text: "Competitive Programming",
            url: ConfigHelper.getFooterLink("competitiveProgrammingThrive"),
          },
          {
            text: "Data Science",
            url: ConfigHelper.getFooterLink("dataScienceThrive"),
          },
          {
            text: "Design",
            url: ConfigHelper.getFooterLink("designThrive"),
          },
          {
            text: "Development",
            url: ConfigHelper.getFooterLink("developmentThrive"),
          },
          {
            text: "QA",
            url: ConfigHelper.getFooterLink("qaThrive"),
          },
        ],
        text: "TRACKS",
      },
      Community: {
        submenus: [
          {
            text: "Blog",
            url: ConfigHelper.getFooterLink("blog"),
          },
          {
            text: "Events Calendar",
            url: ConfigHelper.getFooterLink("events"),
          },
          {
            text: "Forums",
            url: ConfigHelper.getFooterLink("forums"),
          },
          {
            text: "Programs",
            url: ConfigHelper.getFooterLink("programs"),
          },
          {
            text: "Statistics",
            url: ConfigHelper.getFooterLink("statistics"),
          },
          {
            text: "TCO",
            url: ConfigHelper.getFooterLink("tco"),
          },
          {
            text: "Thrive",
            url: ConfigHelper.getFooterLink("thrive"),
          },
          {
            text: "Discord",
            url: ConfigHelper.getFooterLink("discord_href"),
          },
        ],
        text: "COMMUNITY",
      },
      HelpCenter: {
        submenus: [
          {
            text: "Getting Paid",
            url: ConfigHelper.getFooterLink("gettingPaid"),
          },
          {
            text: "FAQ",
            url: ConfigHelper.getFooterLink("faq"),
          },
          {
            text: "General Info",
            url: ConfigHelper.getFooterLink("generalInfo"),
          },
          {
            text: "Website Help",
            url: ConfigHelper.getFooterLink("websiteHelp"),
          },
        ],
        text: "HELP CENTER",
      },
      About: {
        submenus: [
          {
            text: "Contact Us",
            url: ConfigHelper.getFooterLink("contactUs"),
          },
          {
            text: "Join Community",
            url: ConfigHelper.getFooterLink("joinCommunity"),
          },
          {
            text: "About Community",
            url: ConfigHelper.getFooterLink("aboutCommunity"),
          },
          {
            text: "Releases & Updates",
            url: ConfigHelper.getFooterLink("releasesAndUpdate"),
          },
          {
            text: "Talk to Sales",
            url: ConfigHelper.getFooterLink("talkToSales"),
          },
        ],
        text: "ABOUT",
      },
    };
    if (isLoggedIn) {
      menuConfiguration['About'].submenus.splice(1, 1)
    }
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
      ConfigHelper.getSocialLink("discord")
    ];
  }
}
