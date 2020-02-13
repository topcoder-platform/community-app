import { element, by} from 'protractor';
import { commonPageObjects } from '../../../common/common.po';
import { commonPageHelper } from '../../../common/common.helper';

export class TermsPageObject {
  static get container() {
    const config = commonPageHelper.getConfig();
    if (config.terms.container.class) {
      return element(by.className(config.terms.container.class));
    }
    const containerH3Text = config.terms.container.h3Text? config.terms.container.h3Text :
        'Acceptance of Terms and Conditions';
      return commonPageObjects.getTextFromH3(containerH3Text);
  }
}