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
import FormField from 'components/Settings/FormField';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import FormInputSelect from 'components/Settings/FormInputSelect';
import { toastr } from 'react-redux-toastr';
import ConfirmationModal from '../../ConfirmationModal';
import DeviceList from './List';

import styles from './styles.scss';

export default class Devices extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteDevice = this.onHandleDeleteDevice.bind(this);
    this.onDeleteDevice = this.onDeleteDevice.bind(this);
    this.onEditDevice = this.onEditDevice.bind(this);
    this.loadDeviceTrait = this.loadDeviceTrait.bind(this);
    this.onHandleAddDevice = this.onHandleAddDevice.bind(this);
    this.onAddDevice = this.onAddDevice.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);
    this.onUpdateType = this.onUpdateType.bind(this);
    this.onUpdateManufacturer = this.onUpdateManufacturer.bind(this);
    this.onUpdateModel = this.onUpdateModel.bind(this);
    this.onUpdateOs = this.onUpdateOs.bind(this);
    this.onLoadMoreModels = this.onLoadMoreModels.bind(this);
    this.onLoadMoreOses = this.onLoadMoreOses.bind(this);

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
    if (e) e.preventDefault();
    const { newDevice, deviceTrait } = this.state;
    const { clearDeviceState } = this.props;
    this.setState({ isSubmit: true });
    if (this.onCheckFormValue(newDevice)) {
      return;
    }
    const deviceItems = deviceTrait.traits
      ? deviceTrait.traits.data.slice() : [];
    let exist = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const item of deviceItems) {
      if (item.deviceType === newDevice.deviceType
        && item.manufacturer === newDevice.manufacturer
        && item.model === newDevice.model
        && item.operatingSystem === newDevice.operatingSystem) {
        exist = true;
        break;
      }
    }
    if (exist === true) {
      const empty = {
        deviceType: '',
        manufacturer: '',
        model: '',
        operatingSystem: '',
      };
      this.setState({
        newDevice: empty,
        isEdit: false,
        indexNo: null,
        isSubmit: false,
      });
      clearDeviceState();
      setImmediate(() => {
        toastr.error('Looks like you\'ve already entered this device.');
      });
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
    const { deviceTrait, isEdit } = this.state;
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
    if (isEdit) {
      this.onCancelEditStatus();
    }
  }

  /**
   * Edit device by index
   * @param indexNo the device index no
   */
  onEditDevice(indexNo) {
    const { deviceTrait } = this.state;
    const {
      getManufacturers,
      getModels,
      getOses,
    } = this.props;
    this.setState({
      newDevice: {
        deviceType: deviceTrait.traits.data[indexNo].deviceType,
        manufacturer: _.isEmpty(deviceTrait.traits.data[indexNo].manufacturer) ? '' : deviceTrait.traits.data[indexNo].manufacturer,
        model: _.isEmpty(deviceTrait.traits.data[indexNo].model) ? '' : deviceTrait.traits.data[indexNo].model,
        operatingSystem: _.isEmpty(deviceTrait.traits.data[indexNo].operatingSystem) ? '' : deviceTrait.traits.data[indexNo].operatingSystem,
      },
      isEdit: true,
      indexNo,
      isSubmit: false,
    });
    const selectDevice = deviceTrait.traits.data[indexNo];
    const {
      deviceType,
      manufacturer,
      model,
    } = selectDevice;

    // preload all select
    getManufacturers(deviceType);
    getModels(1, deviceType, manufacturer);
    getOses(1, deviceType, manufacturer, model);
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
      clearDeviceState,
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
    };
    this.setState({
      newDevice: empty,
      isEdit: false,
      indexNo: null,
      isSubmit: false,
    });
    clearDeviceState();
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
   * Update deviceType
   * @param option selected value
   */
  onUpdateType(val) {
    const {
      getManufacturers,
    } = this.props;

    const newDevice = { deviceType: val.name };
    newDevice.manufacturer = '';
    newDevice.model = '';
    newDevice.operatingSystem = '';
    this.setState({ newDevice, isSubmit: false });

    // preload manufacturers
    getManufacturers(val.name);
  }

  /**
   * Update manufacturer
   * @param e event
   */
  onUpdateManufacturer(val) {
    const {
      getModels,
    } = this.props;
    const { newDevice: device } = this.state;
    const newDevice = { ..._.pick(device, ['deviceType']) };
    newDevice.manufacturer = val.name;
    newDevice.model = '';
    newDevice.operatingSystem = '';
    this.setState({ newDevice, isSubmit: false });
    // preload models
    getModels(1, newDevice.deviceType, newDevice.manufacturer);
  }

  /**
   * Update model
   * @param e event
   */
  onUpdateModel(val) {
    const {
      getOses,
      // lookupData: {modelPage}
    } = this.props;
    const { newDevice: device } = this.state;
    const newDevice = { ..._.pick(device, ['deviceType', 'manufacturer']) };
    newDevice.model = val.model;
    newDevice.operatingSystem = '';
    this.setState({ newDevice, isSubmit: false });

    // preload oses
    getOses(1, newDevice.deviceType, newDevice.manufacturer, newDevice.model);
  }

  /**
   * Update operatingSystem
   * @param e event
   */
  onUpdateOs(val) {
    const { newDevice: device } = this.state;
    const newDevice = { ..._.pick(device, ['deviceType', 'manufacturer', 'model']) };
    newDevice.operatingSystem = val.operatingSystem;
    this.setState({ newDevice, isSubmit: false });
  }

  onLoadMoreModels() {
    const {
      lookupData: {
        modelPage,
      },
      getMoreModels,
    } = this.props;

    const {
      newDevice: {
        deviceType,
        manufacturer,
      },
    } = this.state;
    getMoreModels(modelPage + 1, deviceType, manufacturer);
  }

  onLoadMoreOses() {
    const {
      lookupData: {
        osPage,
      },
      getMoreOses,
    } = this.props;
    const {
      newDevice: {
        deviceType,
        manufacturer, model,
      },
    } = this.state;
    getMoreOses(osPage + 1, deviceType, manufacturer, model);
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
    const { clearDeviceState } = this.props;
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
        },
      });
      clearDeviceState();
    }
  }

  render() {
    const {
      lookupData,
    } = this.props;
    const {
      types,
      manufacturers,
      models,
      oses,
      hasMoreModels,
      hasMoreOses,
      isModelsLoading,
      isOsesLoading,
    } = lookupData;
    const {
      deviceTrait, showConfirmation, indexNo, isEdit,
      formInvalid, isSubmit,
    } = this.state;
    const deviceItems = deviceTrait.traits
      ? deviceTrait.traits.data.slice() : [];
    const { newDevice } = this.state;
    const canModifyTrait = !this.props.traitRequestCount;

    return (
      <React.Fragment>
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
        <div styleName="form-container">
          <Collapse>
            <h2 styleName="form-title">
              Your Devices
            </h2>
            {
              deviceItems.length > 0
              && (
                <DeviceList
                  deviceList={{ items: deviceItems }}
                  onDeleteItem={this.onHandleDeleteDevice}
                  onEditItem={this.onEditDevice}
                />
              )
            }
            <div styleName="form-content">
              <div styleName="form-label">
                Add a new device to your devices list
              </div>
              <div styleName="form-body">
                <form styleName="device-form" noValidate autoComplete="off">
                  <FormField label="Device Type" style={{ flex: '0 0 100%' }} required>
                    <FormInputSelect
                      name="Device Type"
                      options={types}
                      value={newDevice.deviceType}
                      onChange={this.onUpdateType}
                      placeholder="Select"
                      labelKey="name"
                      valueKey="name"
                      disabled={!canModifyTrait}
                      clearable={false}
                      onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                    />
                    { isSubmit && formInvalid && (
                      <ErrorMessage
                        invalid={_.isEmpty(newDevice.deviceType) && formInvalid}
                        addMargin
                        message="Type cannot be empty"
                      />
                    )
                    }
                  </FormField>

                  <FormField label="Manufacturer" style={{ flex: '0 0 100%' }}>
                    <FormInputSelect
                      name="manufacturer"
                      options={manufacturers}
                      value={newDevice.manufacturer}
                      onChange={this.onUpdateManufacturer}
                      placeholder="Select"
                      labelKey="name"
                      valueKey="name"
                      disabled={!canModifyTrait}
                      onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                    />
                  </FormField>

                  <FormField label="Model" style={{ flex: '0 0 100%' }}>
                    <FormInputSelect
                      name="model"
                      options={models}
                      onChange={this.onUpdateModel}
                      value={newDevice.model}
                      placeholder="Select device Model"
                      valueKey="model"
                      labelKey="model"
                      onLoadMore={this.onLoadMoreModels}
                      isLoading={isModelsLoading}
                      hasMore={hasMoreModels}
                      disabled={!canModifyTrait}
                      onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                    />
                  </FormField>

                  <FormField label="Operating System" style={{ flex: '0 0 100%' }}>
                    <FormInputSelect
                      name="Operating System"
                      options={oses}
                      onChange={this.onUpdateOs}
                      value={newDevice.operatingSystem}
                      placeholder="Select device Operating System"
                      valueKey="operatingSystem"
                      labelKey="operatingSystem"
                      hasMore={hasMoreOses}
                      isLoading={isOsesLoading}
                      onLoadMore={this.onLoadMoreOses}
                      disabled={!canModifyTrait}
                      onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                    />
                  </FormField>
                </form>
              </div>
              <div styleName="form-footer">
                {!isEdit && (
                <PrimaryButton
                  theme={{ button: styles.button }}
                  onClick={this.onHandleAddDevice}
                >
                  <AddItemIcon styleName="icon" /> Add Device to Your List
                </PrimaryButton>
                )}

                { isEdit && (
                <React.Fragment>
                  <PrimaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onHandleAddDevice}
                  >
                    Edit Device to Your List
                  </PrimaryButton>
                  <SecondaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onCancelEditStatus}
                  >
                    Cancel
                  </SecondaryButton>
                </React.Fragment>
                )}
              </div>
            </div>
          </Collapse>
        </div>
      </React.Fragment>
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
