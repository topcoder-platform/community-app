/**
 * Child component of Settings/Tools/ renders the
 * 'ServiceProvider' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import ConsentComponent from 'components/Settings/ConsentComponent';
import ErrorMessage from 'components/Settings/ErrorMessage';
import FormField from 'components/Settings/FormField';
import FormInputText from 'components/Settings/FormInputText';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import FormInputSelect from 'components/Settings/FormInputSelect';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import ConfirmationModal from '../../ConfirmationModal';
import dropdowns from './dropdowns.json';
import ServiceProviderList from './List';

import styles from './styles.scss';

export default class ServiceProviders extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteServiceProvider = this.onHandleDeleteServiceProvider.bind(this);
    this.onDeleteServiceProvider = this.onDeleteServiceProvider.bind(this);
    this.onEditServiceProvider = this.onEditServiceProvider.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadServiceProviderTrait = this.loadServiceProviderTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddServiceProvider = this.onHandleAddServiceProvider.bind(this);
    this.onAddServiceProvider = this.onAddServiceProvider.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      isSubmit: false,
      serviceProviderTrait: this.loadServiceProviderTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newServiceProvider: {
        serviceProviderType: '',
        name: '',
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
    const serviceProviderTrait = this.loadServiceProviderTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      serviceProviderTrait,
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
  onHandleAddServiceProvider(e) {
    if (e) e.preventDefault();
    const { newServiceProvider } = this.state;
    this.setState({ isSubmit: true });
    if (this.onCheckFormValue(newServiceProvider)) {
      return;
    }
    this.showConsent(this.onAddServiceProvider.bind(this));
  }

  /**
   * Edit Service Provider by index
   * @param indexNo the Service Provider index no
   */
  onEditServiceProvider(indexNo) {
    const { serviceProviderTrait } = this.state;
    this.setState({
      newServiceProvider: {
        serviceProviderType: serviceProviderTrait.traits.data[indexNo].serviceProviderType,
        name: serviceProviderTrait.traits.data[indexNo].name,
      },
      isEdit: true,
      indexNo,
      isSubmit: false,
    });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newServiceProvider object
   */
  onCheckFormValue(newServiceProvider) {
    let invalid = false;

    if (!_.trim(newServiceProvider.serviceProviderType).length) {
      invalid = true;
    }

    if (!_.trim(newServiceProvider.name).length) {
      invalid = true;
    }

    this.setState({ formInvalid: invalid });
    return invalid;
  }

  onHandleDeleteServiceProvider(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
  }

  /**
   * Delete serviceProvider by index
   * @param indexNo the serviceProvider index no
   */
  onDeleteServiceProvider(indexNo) {
    const { serviceProviderTrait } = this.state;
    const newServiceProviderTrait = { ...serviceProviderTrait };
    newServiceProviderTrait.traits.data.splice(indexNo, 1);
    this.setState({
      serviceProviderTrait: newServiceProviderTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newServiceProviderTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'service_provider', newServiceProviderTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'service_provider', tokenV3);
    }
    this.setState({
      showConfirmation: false,
      isEdit: false,
      indexNo: null,
      formInvalid: false,
      isSubmit: false,
    });
  }

  /**
   * Add new serviceProvider
   * @param answer user consent answer value
   */
  onAddServiceProvider(answer) {
    const {
      newServiceProvider, personalizationTrait, isEdit, indexNo,
    } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { serviceProviderTrait } = this.state;
    if (serviceProviderTrait.traits && serviceProviderTrait.traits.data.length > 0) {
      const newServiceProviderTrait = _.cloneDeep(serviceProviderTrait);
      if (isEdit) {
        newServiceProviderTrait.traits.data.splice(indexNo, 1);
      }
      newServiceProviderTrait.traits.data.push(newServiceProvider);
      updateUserTrait(handle, 'service_provider', newServiceProviderTrait.traits.data, tokenV3);
    } else {
      const newServiceProviders = [];
      newServiceProviders.push(newServiceProvider);
      addUserTrait(handle, 'service_provider', newServiceProviders, tokenV3);
    }
    const empty = {
      serviceProviderType: '',
      name: '',
    };
    this.setState({
      newServiceProvider: empty,
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
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newServiceProvider: oldServiceProvider } = this.state;
    const newServiceProvider = { ...oldServiceProvider };
    newServiceProvider[e.target.name] = e.target.value;
    this.setState({ newServiceProvider, isSubmit: false });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newServiceProvider: oldServiceProvider } = this.state;
      const newServiceProvider = { ...oldServiceProvider };
      newServiceProvider[option.key] = option.name;
      this.setState({ newServiceProvider, isSubmit: false });
    }
  }

  /**
   * Get serviceProvider trait
   * @param userTraits the all user traits
   */
  loadServiceProviderTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'service_provider');
    const serviceProviders = trait.length === 0 ? {} : trait[0];
    return _.assign({}, serviceProviders);
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
    const { newServiceProvider } = this.state;
    if (newServiceProvider.serviceProviderType && (newServiceProvider.name.trim().length !== 0)) {
      return true;
    }
    return false;
  }

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        isSubmit: false,
        indexNo: null,
        formInvalid: false,
        newServiceProvider: {
          serviceProviderType: '',
          name: '',
        },
      });
    }
  }

  render() {
    const {
      serviceProviderTrait, showConfirmation, indexNo, isEdit,
      formInvalid, isSubmit,
    } = this.state;
    const serviceProviderItems = serviceProviderTrait.traits
      ? serviceProviderTrait.traits.data.slice() : [];
    const { newServiceProvider } = this.state;
    const canModifyTrait = !this.props.traitRequestCount;
    return (
      <React.Fragment>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {showConfirmation
        && (
          <ConfirmationModal
            onConfirm={() => this.showConsent(this.onDeleteServiceProvider.bind(this, indexNo))}
            onCancel={() => this.setState({ showConfirmation: false, indexNo: null })}
            name={serviceProviderTrait.traits.data[indexNo].name}
          />
        )}
        <div styleName="form-container">
          <Collapse>
            <h2 styleName="form-title">
              Service Provider
            </h2>
            {
              serviceProviderItems.length > 0
              && (
                <ServiceProviderList
                  serviceProviderList={{ items: serviceProviderItems }}
                  onDeleteItem={this.onHandleDeleteServiceProvider}
                  disabled={!canModifyTrait}
                  onEditItem={this.onEditServiceProvider}
                />
              )
            }
            <div styleName="form-content">
              <div styleName="form-label">
                Add a new service provider
              </div>
              <div styleName="form-body">
                <form styleName="service-provider-form" noValidate autoComplete="off">
                  <FormField label="Service Provider Type" style={{ flex: '0 0 100%' }} required>
                    <FormInputSelect
                      name="serviceProviderType"
                      options={dropdowns.serviceProviderType}
                      onChange={this.onUpdateSelect}
                      value={newServiceProvider.serviceProviderType}
                      placeholder="Select"
                      labelKey="name"
                      valueKey="name"
                      clearable={false}
                      disabled={!canModifyTrait}
                    />
                    {
                      isSubmit && (
                        <ErrorMessage invalid={_.isEmpty(newServiceProvider.serviceProviderType) && formInvalid} addMargin message="Type cannot be empty" />
                      )
                    }
                  </FormField>

                  <FormField label="Service Provider Name" style={{ flex: '0 0 100%' }} required>
                    <FormInputText
                      disabled={!canModifyTrait}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Type here the Service Provider Name"
                      onChange={this.onUpdateInput}
                      value={newServiceProvider.name}
                      maxLength="64"
                      required
                    />
                    {
                      isSubmit && (
                        <ErrorMessage invalid={_.isEmpty(newServiceProvider.name) && formInvalid} message="Name cannot be empty" />
                      )
                    }
                  </FormField>
                </form>
              </div>
              <div styleName="form-footer">
                {!isEdit && (
                <PrimaryButton
                  theme={{ button: styles.button }}
                  onClick={this.onHandleAddServiceProvider}
                >
                  <AddItemIcon styleName="icon" /> Add Service Provider to Your List
                </PrimaryButton>
                )}

                { isEdit && (
                <React.Fragment>
                  <PrimaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onHandleAddServiceProvider}
                  >
                    Edit Service Provider to Your List
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

ServiceProviders.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  traitRequestCount: PT.number.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
