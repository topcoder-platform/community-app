/**
 * Child component of Settings/Tools/ renders the
 * 'Devices' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ConsentComponent from 'components/Settings/ConsentComponent';
import ErrorMessage from 'components/Settings/ErrorMessage';
import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import ConfirmationModal from '../../CofirmationModal';
import dropdowns from './dropdowns.json';
import DeviceList from './List';

import './styles.scss';

export default class Devices extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteDevice = this.onHandleDeleteDevice.bind(this);
    this.onDeleteDevice = this.onDeleteDevice.bind(this);
    this.onEditDevice = this.onEditDevice.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadDeviceTrait = this.loadDeviceTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddDevice = this.onHandleAddDevice.bind(this);
    this.onAddDevice = this.onAddDevice.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

    const { userTraits } = props;
    this.state = {
      isSubmit: false,
      formInvalid: false,
      deviceTrait: this.loadDeviceTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newDevice: {
        deviceType: '',
        manufacturer: '',
        model: '',
        operatingSystem: '',
        osVersion: '',
        osLanguage: '',
      },
      isMobileView: false,
      screenSM: 767,
      showConfirmation: false,
      indexNo: null,
      isEdit: false,
    };
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const deviceTrait = this.loadDeviceTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      deviceTrait,
      personalizationTrait,
      formInvalid: false,
      isSubmit: false,
      newDevice: {
        deviceType: '',
        manufacturer: '',
        model: '',
        operatingSystem: '',
        osVersion: '',
        osLanguage: '',
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddDevice(e) {
    e.preventDefault();
    const { newDevice } = this.state;
    this.setState({ isSubmit: true });
    if (this.onCheckFormValue(newDevice)) {
      return;
    }
    this.showConsent(this.onAddDevice.bind(this));
  }

  onHandleDeleteDevice(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
  }

  /**
   * Delete device by index
   * @param indexNo the device index no
   */
  onDeleteDevice(indexNo) {
    const { deviceTrait } = this.state;
    const newDeviceTrait = { ...deviceTrait };
    newDeviceTrait.traits.data.splice(indexNo, 1);
    this.setState({
      deviceTrait: newDeviceTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newDeviceTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'device', newDeviceTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'device', tokenV3);
    }
    this.setState({
      showConfirmation: false,
      indexNo: null,
      isSubmit: false,
      formInvalid: false,
    });
  }

  /**
   * Edit device by index
   * @param indexNo the device index no
   */
  onEditDevice(indexNo) {
    const { deviceTrait } = this.state;
    this.setState({
      newDevice: {
        deviceType: deviceTrait.traits.data[indexNo].deviceType,
        manufacturer: _.isEmpty(deviceTrait.traits.data[indexNo].manufacturer) ? '' : deviceTrait.traits.data[indexNo].manufacturer,
        model: _.isEmpty(deviceTrait.traits.data[indexNo].model) ? '' : deviceTrait.traits.data[indexNo].model,
        operatingSystem: _.isEmpty(deviceTrait.traits.data[indexNo].operatingSystem) ? '' : deviceTrait.traits.data[indexNo].operatingSystem,
        osVersion: _.isEmpty(deviceTrait.traits.data[indexNo].osVersion) ? '' : deviceTrait.traits.data[indexNo].osVersion,
        osLanguage: _.isEmpty(deviceTrait.traits.data[indexNo].osLanguage) ? '' : deviceTrait.traits.data[indexNo].osLanguage,
      },
      isEdit: true,
      indexNo,
      isSubmit: false,
    });
  }

  /**
   * Add new device
   * @param answer user consent answer value
   */
  onAddDevice(answer) {
    const {
      newDevice, personalizationTrait, isEdit, indexNo,
    } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const {
      deviceTrait,
    } = this.state;
    const device = _.clone(newDevice);
    if (_.isEmpty(device.manufacturer)) {
      delete device.manufacturer;
    }
    if (_.isEmpty(device.model)) {
      delete device.model;
    }
    if (_.isEmpty(device.operatingSystem)) {
      delete device.operatingSystem;
    }
    if (_.isEmpty(device.osVersion)) {
      delete device.osVersion;
    }
    if (_.isEmpty(device.osVersion)) {
      delete device.osVersion;
    }
    if (deviceTrait.traits && deviceTrait.traits.data.length > 0) {
      const newDeviceTrait = _.cloneDeep(deviceTrait);
      if (isEdit) {
        newDeviceTrait.traits.data.splice(indexNo, 1);
      }
      newDeviceTrait.traits.data.push(device);
      updateUserTrait(handle, 'device', newDeviceTrait.traits.data, tokenV3);
    } else {
      const newDevices = [];
      newDevices.push(device);
      addUserTrait(handle, 'device', newDevices, tokenV3);
    }
    const empty = {
      deviceType: '',
      manufacturer: '',
      model: '',
      operatingSystem: '',
      osVersion: '',
      osLanguage: '',
    };
    this.setState({
      newDevice: empty,
      isEdit: false,
      indexNo: null,
      isSubmit: false,
    });
    // save personalization
    if (_.isEmpty(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newDevice object
   */
  onCheckFormValue(newDevice, updateState = true) {
    let invalid = false;

    if (!_.trim(newDevice.deviceType).length) {
      invalid = true;
    }

    if (updateState) {
      this.setState({ formInvalid: invalid });
    }
    return invalid;
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newDevice: device } = this.state;
    const newDevice = { ...device };
    newDevice[e.target.name] = e.target.value;
    this.setState({ newDevice, isSubmit: false });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newDevice: device } = this.state;
      const newDevice = { ...device };
      newDevice[option.key] = option.name;
      this.setState({
        newDevice,
        isSubmit: false,
      });
    }
  }

  /**
   * Get device trait
   * @param userTraits the all user traits
   */
  loadDeviceTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'device');
    const devices = trait.length === 0 ? {} : trait[0];
    return _.assign({}, devices);
  }

  /**
   * Get personalization trait
   * @param userTraits the all user traits
   */
  loadPersonalizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    const personalization = trait.length === 0 ? {} : trait[0];
    return _.assign({}, personalization);
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  isFormValid() {
    const { newDevice } = this.state;
    return this.onCheckFormValue(newDevice, false);
  }

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        isSubmit: false,
        indexNo: null,
        formInvalid: false,
        newDevice: {
          deviceType: '',
          manufacturer: '',
          model: '',
          operatingSystem: '',
          osVersion: '',
          osLanguage: '',
        },
      });
    }
  }

  render() {
    const {
      deviceTrait, isMobileView, showConfirmation, indexNo, isEdit,
      formInvalid, isSubmit,
    } = this.state;
    const deviceItems = deviceTrait.traits
      ? deviceTrait.traits.data.slice() : [];
    const { newDevice } = this.state;
    const canModifyTrait = !this.props.traitRequestCount;
    return (
      <div styleName="devices-container">
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {showConfirmation
        && (
          <ConfirmationModal
            onConfirm={() => this.showConsent(this.onDeleteDevice.bind(this, indexNo))}
            onCancel={() => this.setState({ showConfirmation: false, indexNo: null })}
            name={`${deviceTrait.traits.data[indexNo].deviceType}${!_.isEmpty(deviceTrait.traits.data[indexNo].manufacturer) ? ` ${deviceTrait.traits.data[indexNo].manufacturer}` : ''}`}
          />
        )}
        <h1>
          Devices
        </h1>
        <div styleName={`sub-title ${deviceItems.length > 0 ? '' : 'hidden'}`}>
          Your devices
        </div>
        {
          !isMobileView && deviceItems.length > 0
          && (
            <DeviceList
              deviceList={{ items: deviceItems }}
              onDeleteItem={this.onHandleDeleteDevice}
              disabled={!canModifyTrait}
              onEditItem={this.onEditDevice}
            />
          )
        }
        <div styleName={`sub-title ${deviceItems.length > 0 ? 'second' : 'first'}`}>
          {
            isEdit ? (<React.Fragment>Edit device</React.Fragment>)
              : (<React.Fragment>Add a new device</React.Fragment>)
          }
        </div>
        <div styleName="form-container-default">
          <form name="device-form" noValidate autoComplete="off">
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="deviceType">
                  Type
                  <input type="hidden" />
                </label>
              </div>
              <div styleName="field col-2">
                <span styleName="text-required">* Required</span>
                <Select
                  name="deviceType"
                  options={dropdowns.type}
                  onChange={this.onUpdateSelect}
                  value={newDevice.deviceType}
                  placeholder="Device Type"
                  labelKey="name"
                  valueKey="name"
                  clearable={false}
                  disabled={!canModifyTrait}
                />
                {
                  isSubmit && (
                    <ErrorMessage invalid={_.isEmpty(newDevice.deviceType) && formInvalid} addMargin message="Type cannot be empty" />
                  )
                }
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1-no-padding">
                <label htmlFor="manufacturer">
                  Manufacturer
                  <input type="hidden" />
                </label>
              </div>
              <div styleName="field col-2">
                <input disabled={!canModifyTrait} id="manufacturer" name="manufacturer" type="text" placeholder="Manufacturer" value={newDevice.manufacturer} onChange={this.onUpdateInput} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1-no-padding">
                <label htmlFor="model">
                  Model
                  <input type="hidden" />
                </label>
              </div>
              <div styleName="field col-2">
                <input disabled={!canModifyTrait} id="model" name="model" type="text" placeholder="Model" onChange={this.onUpdateInput} value={newDevice.model} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1-no-padding">
                <label htmlFor="operating-system">
                  Operating System(OS)
                  <input type="hidden" />
                </label>
              </div>
              <div styleName="field col-2">
                <input disabled={!canModifyTrait} id="operating-system" name="operatingSystem" type="text" onChange={this.onUpdateInput} placeholder="Operating System" value={newDevice.operatingSystem} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1-no-padding">
                <label htmlFor="osVersion">
                  OS Version
                  <input type="hidden" />
                </label>
              </div>
              <div styleName="field col-2">
                <input disabled={!canModifyTrait} id="os-version" name="osVersion" type="text" onChange={this.onUpdateInput} placeholder="OS version" value={newDevice.osVersion} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1-no-padding">
                <label htmlFor="osLanguage">
                  OS Language
                  <input type="hidden" />
                </label>
              </div>
              <div styleName="field col-2">
                <input disabled={!canModifyTrait} id="os-language" name="osLanguage" type="text" onChange={this.onUpdateInput} placeholder="OS Language" value={newDevice.osLanguage} maxLength="64" required />
              </div>
            </div>
          </form>
          <div styleName="button-container">
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddDevice}
              >
                {
                  isEdit ? (<React.Fragment>Edit device to your list</React.Fragment>)
                    : (<React.Fragment>Add device to your list</React.Fragment>)
                }
              </PrimaryButton>
            </div>
            {
              isEdit && (
                <div styleName="button-cancel">
                  <PrimaryButton
                    styleName="complete"
                    onClick={this.onCancelEditStatus}
                  >
                    Cancel
                  </PrimaryButton>
                </div>
              )
            }
          </div>
        </div>
        <div styleName="form-container-mobile">
          <form name="device-form" noValidate autoComplete="off">
            <div styleName="row">
              <p>
                {
                  isEdit ? (<React.Fragment>Edit Device</React.Fragment>)
                    : (<React.Fragment>Add Device</React.Fragment>)
                }
              </p>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="deviceType">
                  Type
                  <span styleName="text-required">* Required</span>
                  <input type="hidden" />
                </label>
                <Select
                  name="deviceType"
                  options={dropdowns.type}
                  onChange={this.onUpdateSelect}
                  value={newDevice.deviceType}
                  placeholder="Device Type"
                  labelKey="name"
                  valueKey="name"
                  clearable={false}
                  disabled={!canModifyTrait}
                />
                {
                  isSubmit && (
                    <ErrorMessage invalid={_.isEmpty(newDevice.deviceType) && formInvalid} addMargin message="Type cannot be empty" />
                  )
                }
              </div>
              <div styleName="field col-1">
                <label htmlFor="manufacturer">
                  Manufacturer
                  <input type="hidden" />
                </label>
                <input disabled={!canModifyTrait} id="manufacturer" name="manufacturer" type="text" placeholder="Manufacturer" value={newDevice.manufacturer} onChange={this.onUpdateInput} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-2">
                <label htmlFor="model">
                  Model
                  <input type="hidden" />
                </label>
                <input disabled={!canModifyTrait} id="model" name="model" type="text" placeholder="Model" onChange={this.onUpdateInput} value={newDevice.model} maxLength="64" required />
              </div>
              <div styleName="field col-2">
                <label htmlFor="operating-system">
                  Operating System
                  <input type="hidden" />
                </label>
                <input disabled={!canModifyTrait} d="operating-system" name="operatingSystem" type="text" onChange={this.onUpdateInput} placeholder="Operating System" value={newDevice.operatingSystem} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-2">
                <label htmlFor="osVersion">
                  OS version
                  <input type="hidden" />
                </label>
                <input disabled={!canModifyTrait} id="os-version" name="osVersion" type="text" onChange={this.onUpdateInput} placeholder="OS version" value={newDevice.osVersion} maxLength="64" required />
              </div>
              <div styleName="field col-2">
                <label htmlFor="osLanguage">
                  OS Language
                  <input type="hidden" />
                </label>
                <input disabled={!canModifyTrait} id="os-language" name="osLanguage" type="text" onChange={this.onUpdateInput} placeholder="OS Language" value={newDevice.osLanguage} maxLength="64" required />
              </div>
            </div>
          </form>
          <div styleName="button-container">
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddDevice}
              >
                {
                  isEdit ? (<React.Fragment>Edit Device</React.Fragment>)
                    : (<React.Fragment>Add Device</React.Fragment>)
                }
              </PrimaryButton>
            </div>
            {
              isEdit && (
                <div styleName="button-cancel">
                  <PrimaryButton
                    styleName="complete"
                    onClick={this.onCancelEditStatus}
                  >
                    Cancel
                  </PrimaryButton>
                </div>
              )
            }
          </div>
        </div>
        {
          isMobileView
          && (
            <DeviceList
              deviceList={{ items: deviceItems }}
              onDeleteItem={this.onHandleDeleteDevice}
              disabled={!canModifyTrait}
              onEditItem={this.onEditDevice}
            />
          )
        }
      </div>
    );
  }
}

Devices.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  traitRequestCount: PT.number.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
