import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../../../../logger/logger';
import { ConfigHelper } from '../../../../../../utils/config-helper';
import { SettingsPage } from '../../settings.po';
import { CommonHelper } from '../../../common-page/common.helper';

export class DevicePage extends SettingsPage {
  /**
   * Gets the Tools page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getToolsUrl());
    await this.switchTab('devices');
    logger.info('User navigated to Device Page');
  }

  /**
   * Delete all service providers
   */
  public async deleteAllDevices() {
    await this.deleteAll('Your devices');
  }

  /**
   * Gets the device form
   */
  private get deviceForm() {
    return ElementHelper.getElementByName('device-form');
  }

  /**
   * Gets the device type input field
   * @param type - if type isn't specified it would default to the placeholder
   * @param parentEl
   */
  private getDeviceType(type?: string, parentEl?) {
    const value = type || 'Select device Type';
    return ElementHelper.getTagElementMatchingText('div', value, parentEl);
  }

  /**
   * Gets the device manufacturer input field
   * @param manufacturer - if manufacturer isn't specified, it would default to the placeholder
   */
  private getDeviceManufacturer(manufacturer?: string) {
    const value = manufacturer || 'Select device Manufacturer';
    return CommonHelper.findElementByText('div', value);
  }

  /**
   * Gets the device model
   * @param model - if model isn't specified, it would default to the placeholder
   */
  private getDeviceModel(model?: string) {
    const value = model || 'Select device Model';
    return CommonHelper.findElementByText('div', value);
  }

  /**
   * Gets the device OS
   * @param os - if OS isn't provided, it would default to the placeholder
   */
  private getDeviceOS(os?: string) {
    const value = os || 'Select device Operating System';
    return CommonHelper.findElementByText('div', value);
  }

  /**
   * Generic method to get a device input field basis the value provided
   * @param option - value basis which the element would be queried
   */
  private getDeviceInputWithOption(option) {
    return CommonHelper.findElementByText('div', option);
  }

  /**
   * Adds a device with the provided device object
   * @param {Object} device
   */
  public async addDevice(device) {
    await this.setDeviceType(device.type);
    await this.setDeviceManufacturer(device.manufacturer);
    await this.setDeviceModel(device.model);
    await this.setDeviceOS(device.os);
    await this.getAddButton('device').click();
  }

  /**
   * Edits the given device with the new provided device
   * @param {Object} oldDevice
   * @param {Object} newDevice
   */
  public async editDevice(oldDevice, newDevice) {
    const name = `${oldDevice.model}`;
    await this.getEditIconbyName(name).click();
    await this.editDeviceType(oldDevice.type, newDevice.type);
    await this.setDeviceManufacturer(newDevice.manufacturer);
    await this.setDeviceModel(newDevice.model);
    await this.setDeviceOS(newDevice.os);
    await this.getEditButton('device').click();
  }

  /**
   * Deletes the given device
   * @param {Object} device
   */
  public async deleteDevice(device) {
    const name = `${device.model}`;
    await this.getDeleteIconbyName(name).click();
    await this.deleteConfirmation.click();
  }

  /**
   * Sets the device type
   * @param type
   */
  private async setDeviceType(type: string) {
    await this.setDeviceOption(this.getDeviceType(), type);
  }

  /**
   * Updates the device type
   * @param oldType
   * @param newType
   */
  private async editDeviceType(oldType: string, newType: string) {
    await this.setDeviceOption(
      this.getDeviceType(oldType, this.deviceForm),
      newType
    );
  }

  /**
   * Sets the device manufacturer
   * @param manufacturer
   */
  private async setDeviceManufacturer(manufacturer: string) {
    await this.setDeviceOption(this.getDeviceManufacturer(), manufacturer);
  }

  /**
   * Updates the device manufacturer
   * @param oldManufacturer
   * @param newManufacturer
   */
  private async editDeviceManufacturer(
    oldManufacturer: string,
    newManufacturer: string
  ) {
    await this.setDeviceOption(
      this.getDeviceManufacturer(oldManufacturer),
      newManufacturer
    );
  }

  /**
   * Sets the device model
   * @param model
   */
  private async setDeviceModel(model: string) {
    await this.setDeviceOption(this.getDeviceModel(), model);
  }

  /**
   * Updates the device model
   * @param oldModel
   * @param newModel
   */
  private async editDeviceModel(oldModel: string, newModel: string) {
    await this.setDeviceOption(this.getDeviceModel(oldModel), newModel);
  }

  /**
   * Sets the device OS
   * @param os
   */
  private async setDeviceOS(os: string) {
    await this.setDeviceOption(this.getDeviceOS(), os);
  }

  /**
   * Updates the device OS
   * @param oldOS
   * @param newOS
   */
  private async editDeviceOS(oldOS: string, newOS: string) {
    await this.setDeviceOption(this.getDeviceOS(oldOS), newOS);
  }

  /**
   * Generic method to set the device properties
   * @param element - element which should be filled
   * @param value - value to be entered
   */
  private async setDeviceOption(element, value: string) {
    await BrowserHelper.waitUntilClickableOf(element);
    await element.click();
    await CommonHelper.waitUntilVisibilityOf(
      () => this.getDeviceInputWithOption(value),
      'Wait for device input with option',
      false
    );
    const optionEl = this.getDeviceInputWithOption(value);
    await optionEl.click();
  }
}
