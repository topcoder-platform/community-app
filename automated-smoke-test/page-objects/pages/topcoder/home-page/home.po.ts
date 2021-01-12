import { ElementHelper } from 'topcoder-testing-lib';

export class HomePage {
  /**
   * Gets the home page container element
   */
  public get container() {
    return ElementHelper.getElementByClassName('home');
  }
}
