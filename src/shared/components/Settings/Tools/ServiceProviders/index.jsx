/**
 * Child component of Settings/Tools/ renders the
 * 'ServiceProvider' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import UserConsentModal from 'components/Settings/UserConsentModal';
import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import dropdowns from './dropdowns.json';
import ServiceProviderList from './List';

import './styles.scss';


export default class ServiceProviders extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteServiceProvider = this.onDeleteServiceProvider.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadServiceProviderTrait = this.loadServiceProviderTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddServiceProvider = this.onAddServiceProvider.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.onShowUserConsent = this.onShowUserConsent.bind(this);

    this.state = {
      formInvalid: false,
      showUserConsent: false,
      errorMessage: '',
      serviceProviderTrait: this.loadServiceProviderTrait(props.userTraits),
      personalizationTrait: this.loadPersonalizationTrait(props.userTraits),
      newServiceProvider: {
        serviceProviderType: '',
        name: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const serviceProviderTrait = this.loadServiceProviderTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      serviceProviderTrait,
      personalizationTrait,
      formInvalid: false,
      errorMessage: '',
      newServiceProvider: {
        serviceProviderType: '',
        name: '',
      },
    });
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onShowUserConsent(e) {
    e.preventDefault();
    const { newServiceProvider } = this.state;
    if (this.onCheckFormValue(newServiceProvider)) {
      return;
    }
    this.setState({ showUserConsent: true });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newServiceProvider object
   */
  onCheckFormValue(newServiceProvider) {
    let invalid = false;

    let errorMessage = '';
    if (!_.trim(newServiceProvider.serviceProviderType).length) {
      errorMessage += 'ServiceProvider type, ';
      invalid = true;
    }

    if (!_.trim(newServiceProvider.name).length) {
      errorMessage += 'Name, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
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
  }

  /**
   * Add new serviceProvider
   * @param e form submit event
   * @param answer user consent answer value
   */
  onAddServiceProvider(e, answer) {
    e.preventDefault();
    this.setState({ showUserConsent: false });
    const { newServiceProvider, personalizationTrait } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { serviceProviderTrait } = this.state;
    if (serviceProviderTrait.traits && serviceProviderTrait.traits.data.length > 0) {
      const newServiceProviderTrait = { ...serviceProviderTrait };
      newServiceProviderTrait.traits.data.push(newServiceProvider);
      this.setState({ serviceProviderTrait: newServiceProviderTrait });
      updateUserTrait(handle, 'service_provider', newServiceProviderTrait.traits.data, tokenV3);
    } else {
      const newServiceProviders = [];
      newServiceProviders.push(newServiceProvider);
      const traits = {
        data: newServiceProviders,
      };
      this.setState({ serviceProviderTrait: { traits } });
      addUserTrait(handle, 'service_provider', newServiceProviders, tokenV3);
    }
    const empty = {
      serviceProviderType: '',
      name: '',
    };
    this.setState({ newServiceProvider: empty });
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
    this.setState({ newServiceProvider });
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
      this.setState({ newServiceProvider });
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

  render() {
    const { serviceProviderTrait, showUserConsent } = this.state;
    const serviceProviderItems = serviceProviderTrait.traits
      ? serviceProviderTrait.traits.data.slice() : [];
    const { newServiceProvider, formInvalid, errorMessage } = this.state;

    return (
      <div styleName="service-provider-container">
        {
          showUserConsent && (<UserConsentModal onSaveTrait={this.onAddServiceProvider} />)
        }
        <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
          { errorMessage }
        </div>
        <h1>
Service Providers
        </h1>
        <div styleName="form-container">
          <form name="service-provider-form" noValidate autoComplete="off">
            <div styleName="row">
              <p>
Add Service Provider
              </p>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="serviceProviderType">
Type
                </label>
                <Select
                  name="serviceProviderType"
                  options={dropdowns.serviceProviderType}
                  onChange={this.onUpdateSelect}
                  value={newServiceProvider.serviceProviderType}
                  placeholder="Service Provider Type"
                  labelKey="name"
                  valueKey="name"
                  clearable={false}
                />
              </div>
              <div styleName="field col-2">
                <label htmlFor="name">
Provider Name
                </label>
                <input id="name" name="name" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newServiceProvider.name} maxLength="64" required />
              </div>
            </div>
          </form>
          <div styleName="button-save">
            <PrimaryButton
              styleName="complete"
              onClick={this.onShowUserConsent}
            >
              Add Provider
            </PrimaryButton>
          </div>
        </div>
        <ServiceProviderList
          serviceProviderList={{ items: serviceProviderItems }}
          onDeleteItem={this.onDeleteServiceProvider}
        />
      </div>
    );
  }
}

ServiceProviders.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
