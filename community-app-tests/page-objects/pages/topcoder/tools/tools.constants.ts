import { ConfigHelper } from "../../../../utils/config-helper";

export class ToolsPageConstants {
  /**
   * gets  the Tools page URL
   */
  public static get url() {
    return ConfigHelper.getToolsURL();
  }

  /**
   * Tools page messages
   */
  public static get Messages() {
    return {
      SuccessMessage: "Your information has been updated"
    };
  }
}
