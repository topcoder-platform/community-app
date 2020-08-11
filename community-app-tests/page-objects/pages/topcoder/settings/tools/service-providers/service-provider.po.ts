import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../../../logger/logger';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { SettingsPage } from '../../settings.po';

export class ServiceProviderPage extends SettingsPage {
  /**
   * Gets the Tools page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getToolsUrl());
    await this.switchTab('service providers');
    logger.info('User navigated to ServiceProvider Page');
  }

  /**
   * Delete all service providers
   */
  public async deleteAllServiceProviders() {
    await this.deleteAll('Your service providers');
  }

  /**
   * Gets the service provider type input
   */
  private get serviceProviderType() {
    return ElementHelper.getElementByCss('[role="combobox"]');
  }

  /**
   * Gets the service provider Name textbox
   */
  private get serviceProviderName() {
    return ElementHelper.getElementById('name');
  }

  /**
   * Adds a service provider with the provided name
   * @param {String} name
   */
  public async addServiceProvider(serviceProvider) {
    await this.setServiceProviderType(serviceProvider.type);
    await this.setServiceProviderName(serviceProvider.name);
    await this.getAddButton('service provider').click();
  }

  /**
   * Edits the given service provider name with the new provided name
   * @param {String} name
   * @param {String} newname
   */
  public async editServiceProvider(serviceProvider, newServiceProvider) {
    await this.getEditIconbyName(serviceProvider.name).click();
    await this.setServiceProviderType(newServiceProvider.type);
    await this.setServiceProviderName(newServiceProvider.name);
    await this.getEditButton('service provider').click();
  }

  /**
   * Deletes the given service provider
   * @param {String} name
   */
  public async deleteServiceProvider(serviceProvider) {
    await this.getDeleteIconbyName(serviceProvider.name).click();
    await this.deleteConfirmation.click();
  }

  /**
   * Fills the software provider type input by selecting from the given options
   * @param {string} type - software provider type
   */
  private async setServiceProviderType(type) {
    await this.performSelection(this.serviceProviderType, null, type);
  }

  /**
   * Fills the service provider name textbox with given name
   * @param {String} name
   */
  private async setServiceProviderName(name: string) {
    await this.serviceProviderName.clear();
    await this.serviceProviderName.sendKeys(name);
  }
}
