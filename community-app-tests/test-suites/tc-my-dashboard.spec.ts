import { BrowserHelper } from 'topcoder-testing-lib';
import { LoginPageHelper } from '../page-objects/pages/topcoder/login/login.helper';
import { ConfigHelper } from '../utils/config-helper';
import { MyDashboardPageHelper } from '../page-objects/pages/topcoder/my-dashboard-page/my-dashboard.helper';

describe('Topcoder My Dashboard Page Tests:', () => {
  /**
   * Sets up the browser and logs in
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    await BrowserHelper.maximize();
    await LoginPageHelper.open();
    await LoginPageHelper.login(
      ConfigHelper.getUserName(),
      ConfigHelper.getPassword()
    );
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    try {
      await LoginPageHelper.logout();
    } catch (e) {
      await BrowserHelper.restart();
    }
  });

  /**
   * Go to my dashboard page
   */
  beforeEach(async () => {
    await MyDashboardPageHelper.open();
  });

  it('[TC_002] should check my active challenges tab', async () => {
    await MyDashboardPageHelper.checkIfTabIsActive('My Active Challenge');
    await MyDashboardPageHelper.checkChallengeCardIsDisplayed();
  });

  it('[TC_003] should check my communities tab', async () => {
    await MyDashboardPageHelper.selectTab('My Communities');
    await MyDashboardPageHelper.verifyUserCommunitiesAreDisplayed();
    await MyDashboardPageHelper.verifyLearnMoreLink();
  });

  it('[TC_003] should check my SRMs tab', async () => {
    await MyDashboardPageHelper.selectTab('SRMs');
    await MyDashboardPageHelper.verifySRMTabIsDisplayed();
  });
});
