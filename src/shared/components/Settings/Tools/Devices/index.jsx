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
import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import dropdowns from './dropdowns.json';
import DeviceList from './List';

import './styles.scss';

export default class Devices extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteDevice = this.onHandleDeleteDevice.bind(this);
    this.onDeleteDevice = this.onDeleteDevice.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadDeviceTrait = this.loadDeviceTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddDevice = this.onHandleAddDevice.bind(this);
    this.onAddDevice = this.onAddDevice.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);

    const { userTraits } = props;
    this.state = {
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
      errorMessage: '',
      isMobileView: false,
      screenSM: 768,
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
      errorMessage: '',
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
    if (this.onCheckFormValue(newDevice)) {
      return;
    }
    this.showConsent(this.onAddDevice.bind(this));
  }

  onHandleDeleteDevice(indexNo) {
    this.showConsent(this.onDeleteDevice.bind(this, indexNo));
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
  }

  /**
   * Add new device
   * @param answer user consent answer value
   */
  onAddDevice(answer) {
    const { newDevice, personalizationTrait } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const {
      deviceTrait,
    } = this.state;
    if (deviceTrait.traits && deviceTrait.traits.data.length > 0) {
      const newDeviceTrait = { ...deviceTrait };
      newDeviceTrait.traits.data.push(newDevice);
      this.setState({ deviceTrait: newDeviceTrait });
      updateUserTrait(handle, 'device', newDeviceTrait.traits.data, tokenV3);
    } else {
      const newDevices = [];
      newDevices.push(newDevice);
      const traits = {
        data: newDevices,
      };
      this.setState({ deviceTrait: { traits } });
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
    this.setState({ newDevice: empty });
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
  onCheckFormValue(newDevice) {
    let invalid = false;

    let errorMessage = '';
    if (!_.trim(newDevice.deviceType).length) {
      errorMessage += 'Type, ';
      invalid = true;
    }

    if (!_.trim(newDevice.model).length) {
      errorMessage += 'Model, ';
      invalid = true;
    }

    if (!_.trim(newDevice.manufacturer).length) {
      errorMessage += 'Manufacturer, ';
      invalid = true;
    }

    if (!_.trim(newDevice.operatingSystem).length) {
      errorMessage += 'Operating system, ';
      invalid = true;
    }

    if (!_.trim(newDevice.osLanguage).length) {
      errorMessage += 'OS Language, ';
      invalid = true;
    }

    if (!_.trim(newDevice.osVersion).length) {
      errorMessage += 'OS Version, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
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
    this.setState({ newDevice });
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
      this.setState({ newDevice });
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

  render() {
    const { deviceTrait, isMobileView } = this.state;
    const deviceItems = deviceTrait.traits
      ? deviceTrait.traits.data.slice() : [];
    const { newDevice, formInvalid, errorMessage } = this.state;

    return (
      <div styleName="devices-container">
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
          {errorMessage}
        </div>
        <h1>
          Devices
        </h1>
        <div styleName={`sub-title ${deviceItems.length > 0 ? '' : 'hidden'}`}>
          Your devices
        </div>
        {
          !isMobileView && deviceItems.length > 0
          && (<DeviceList deviceList={{ items: deviceItems }} onDeleteItem={this.onDeleteDevice} />)
        }
        <div styleName={`sub-title ${deviceItems.length > 0 ? 'second' : 'first'}`}>
          Add a new device
        </div>
        <div styleName="form-container-default">
          <form name="device-form" noValidate autoComplete="off">
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="deviceType">
                  Type
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
                />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="manufacturer">
                  Manufacturer
                </label>
              </div>
              <div styleName="field col-2">
                <span styleName="text-required">* Required</span>
                <input id="manufacturer" name="manufacturer" type="text" placeholder="Manufacturer" value={newDevice.manufacturer} onChange={this.onUpdateInput} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="model">
                  Model
                </label>
              </div>
              <div styleName="field col-2">
                <span styleName="text-required">* Required</span>
                <input id="model" name="model" type="text" placeholder="Model" onChange={this.onUpdateInput} value={newDevice.model} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="operating-system">
                  Operating System(OS)
                </label>
              </div>
              <div styleName="field col-2">
                <span styleName="text-required">* Required</span>
                <input id="operating-system" name="operatingSystem" type="text" onChange={this.onUpdateInput} placeholder="Operating System" value={newDevice.operatingSystem} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="osVersion">
                  OS version
                </label>
              </div>
              <div styleName="field col-2">
                <span styleName="text-required">* Required</span>
                <input id="os-version" name="osVersion" type="text" onChange={this.onUpdateInput} placeholder="OS version" value={newDevice.osVersion} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="osLanguage">
                  OS Language
                </label>
              </div>
              <div styleName="field col-2">
                <span styleName="text-required">* Required</span>
                <input id="os-language" name="osLanguage" type="text" onChange={this.onUpdateInput} placeholder="OS Language" value={newDevice.osLanguage} maxLength="64" required />
              </div>
            </div>
          </form>
          <div styleName="button-save">
            <PrimaryButton
              styleName="complete"
              onClick={this.onHandleAddDevice}
            >
              Add device to your list
            </PrimaryButton>
          </div>
        </div>
        <div styleName="form-container-mobile">
          <form name="device-form" noValidate autoComplete="off">
            <div styleName="row">
              <p>
                Add Device
              </p>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="deviceType">
                  Device Type
                  <span styleName="text-required">* Required</span>
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
                />
              </div>
              <div styleName="field col-1">
                <label htmlFor="manufacturer">
                  Manufacturer
                  <span styleName="text-required">* Required</span>
                </label>
                <input id="manufacturer" name="manufacturer" type="text" placeholder="Manufacturer" value={newDevice.manufacturer} onChange={this.onUpdateInput} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-2">
                <label htmlFor="model">
                  Model
                  <span styleName="text-required">* Required</span>
                </label>
                <input id="model" name="model" type="text" placeholder="Model" onChange={this.onUpdateInput} value={newDevice.model} maxLength="64" required />
              </div>
              <div styleName="field col-2">
                <label htmlFor="operating-system">
                  Operating System
                  <span styleName="text-required">* Required</span>
                </label>
                <input id="operating-system" name="operatingSystem" type="text" onChange={this.onUpdateInput} placeholder="Operating System" value={newDevice.operatingSystem} maxLength="64" required />
              </div>
            </div>
            <div styleName="row">
              <div styleName="field col-2">
                <label htmlFor="osVersion">
                  OS version
                  <span styleName="text-required">* Required</span>
                </label>
                <input id="os-version" name="osVersion" type="text" onChange={this.onUpdateInput} placeholder="OS version" value={newDevice.osVersion} maxLength="64" required />
              </div>
              <div styleName="field col-2">
                <label htmlFor="osLanguage">
                  OS Language
                  <span styleName="text-required">* Required</span>
                </label>
                <input id="os-language" name="osLanguage" type="text" onChange={this.onUpdateInput} placeholder="OS Language" value={newDevice.osLanguage} maxLength="64" required />
              </div>
            </div>
          </form>
          <div styleName="button-save">
            <PrimaryButton
              styleName="complete"
              onClick={this.onHandleAddDevice}
            >
              Add Device
            </PrimaryButton>
          </div>
        </div>
        {
          isMobileView
          && (
            <DeviceList
              deviceList={{ items: deviceItems }}
              onDeleteItem={this.onHandleDeleteDevice}
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
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
