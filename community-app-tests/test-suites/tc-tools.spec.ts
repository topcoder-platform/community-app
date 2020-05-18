import { BrowserHelper } from "topcoder-testing-lib";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import * as testData from "../test-data/test-data.json";
import { ConfigHelper } from "../utils/config-helper";
import { DevicePageHelper } from "../page-objects/pages/topcoder/settings/tools/devices/device.helper";
import { SoftwarePageHelper } from "../page-objects/pages/topcoder/settings/tools/softwares/software.helper";
import { ServiceProviderPageHelper } from "../page-objects/pages/topcoder/settings/tools/service-providers/service-provider.helper";
import { SubscriptionsPageHelper } from "../page-objects/pages/topcoder/settings/tools/subscriptions/subscriptions.helper";

describe("Topcoder Tools Page Tests: ", () => {
  /**
   * Sets up the browser and logs in
   */
  beforeAll(async () => {
    await BrowserHelper.initialize();
    // This line is to bypass https://github.com/topcoder-platform/community-app/issues/4287
    await BrowserHelper.open(ConfigHelper.getHomePageUrl());
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
   * Verifies Add/Update/Delete Device functionality
   */
  it("should Verify User can Add/Update/Delete Device", async () => {
    await DevicePageHelper.open();
    await DevicePageHelper.deleteAll();
    await DevicePageHelper.verifyAddDevice(testData.tools.device);
    await DevicePageHelper.verifyEditDevice(
      testData.tools.device,
      testData.tools.newDevice
    );
    await DevicePageHelper.verifyDeleteDevice(testData.tools.newDevice);
  });

  /**
   * Verifies Add/Update/Delete Software functionality
   */
  it("should Verify User can Add/Update/Delete Software", async () => {
    await SoftwarePageHelper.open();
    await SoftwarePageHelper.deleteAll();
    await SoftwarePageHelper.verifyAddSoftware(testData.tools.software);
    await SoftwarePageHelper.verifyEditSoftware(
      testData.tools.software,
      testData.tools.newSoftware
    );
    await SoftwarePageHelper.verifyDeleteSoftware(testData.tools.newSoftware);
  });

  /**
   * Verifies Add/Update/Delete Service Provider functionality
   */
  it("should Verify User can Add/Update/Delete Service Provider", async () => {
    await ServiceProviderPageHelper.open();
    await ServiceProviderPageHelper.deleteAll();
    await ServiceProviderPageHelper.verifyAddServiceProvider(
      testData.tools.serviceProvider
    );
    await ServiceProviderPageHelper.verifyEditServiceProvider(
      testData.tools.serviceProvider,
      testData.tools.newServiceProvider
    );
    await ServiceProviderPageHelper.verifyDeleteServiceProvider(
      testData.tools.newServiceProvider
    );
  });

  /**
   * Verifies Add/Update/Delete Subscriptions functionalty
   */
  it("should Verify User can Add/Update/Delete Subscriptions", async () => {
    await SubscriptionsPageHelper.open();
    await SubscriptionsPageHelper.deleteAll();
    await SubscriptionsPageHelper.verifyAddSubscription(
      testData.tools.subscription
    );
    await SubscriptionsPageHelper.verifyEditSubscription(
      testData.tools.subscription,
      testData.tools.newSubscription
    );
    await SubscriptionsPageHelper.verifyDeleteSubscription(
      testData.tools.newSubscription
    );
  });
});
