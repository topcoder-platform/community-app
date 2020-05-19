import { ElementHelper } from "topcoder-testing-lib";

export class SplashPage {
  /**
   * Gets the home page container element
   */
  public get container() {
    return ElementHelper.getElementByClassName("page-template-template-splash");
  }
}
