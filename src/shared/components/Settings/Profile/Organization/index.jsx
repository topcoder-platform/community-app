/**
 * Child component of Settings/Profile/ renders the
 * 'Organization' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import ConsentComponent from 'components/Settings/ConsentComponent';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import OrganizationList from './List';

import './styles.scss';

export default class Organization extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteOrganization = this.onHandleDeleteOrganization.bind(this);
    this.onDeleteOrganization = this.onDeleteOrganization.bind(this);
    this.loadOrganizationTrait = this.loadOrganizationTrait.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddOrganization = this.onHandleAddOrganization.bind(this);
    this.onAddOrganization = this.onAddOrganization.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      errorMessage: '',
      organizationTrait: this.loadOrganizationTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newOrganization: {
        name: '',
        sector: '',
        city: '',
        timePeriodFrom: '',
        timePeriodTo: '',
      },
      isMobileView: false,
      screenSM: 768,
    };
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const organizationTrait = this.loadOrganizationTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      organizationTrait,
      personalizationTrait,
      formInvalid: false,
      errorMessage: '',
      newOrganization: {
        name: '',
        sector: '',
        city: '',
        timePeriodFrom: '',
        timePeriodTo: '',
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
  onHandleAddOrganization(e) {
    e.preventDefault();
    const { newOrganization } = this.state;
    if (this.onCheckFormValue(newOrganization)) {
      return;
    }
    this.showConsent(this.onAddOrganization.bind(this));
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newOrganization object
   */
  onCheckFormValue(newOrganization) {
    let invalid = false;
    let dateInvalid = false;
    let errorMessage = '';
    let dateCount = 0;
    let dateError = '';
    let haveFromDate = false;
    let haveToDate = false;

    if (!_.trim(newOrganization.name).length) {
      errorMessage += 'Organization Name, ';
      invalid = true;
    }

    if (!_.trim(newOrganization.sector).length) {
      errorMessage += 'Sector, ';
      invalid = true;
    }

    if (!_.trim(newOrganization.city).length) {
      errorMessage += 'City, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    const fromDate = new Date(newOrganization.timePeriodFrom).getTime();
    const toDate = new Date(newOrganization.timePeriodTo).getTime();
    const nowDate = new Date(moment().format('YYYY-MM-DD')).getTime();

    if (_.trim(newOrganization.timePeriodFrom).length > 0) {
      haveFromDate = true;
    }

    if (_.trim(newOrganization.timePeriodTo).length > 0) {
      haveToDate = true;
    }

    if (fromDate >= nowDate) {
      dateError += 'From Date value should be smaller than current date. ';
      dateInvalid = true;
    }

    if (fromDate >= toDate) {
      dateError += 'From Date value should be smaller than To Date value. ';
      dateInvalid = true;
    }

    if (!haveFromDate || !haveToDate) {
      if (!_.trim(newOrganization.timePeriodFrom).length) {
        dateError += 'From Date, ';
        dateInvalid = true;
        dateCount += 1;
      }

      if (!_.trim(newOrganization.timePeriodTo).length) {
        dateError += 'To Date, ';
        dateInvalid = true;
        dateCount += 1;
      }
      if (dateError.length > 0) {
        dateError = `The ${dateError} ${dateCount > 1 ? 'are' : 'is'} incomplete or ${dateCount > 1 ? 'have' : 'has'} an invalid date.`;
      }
    }

    if (errorMessage.length > 0) {
      errorMessage = `${errorMessage}. ${dateError}`;
    } else if (dateError.length > 0) {
      errorMessage = dateError;
      invalid = dateInvalid;
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  onHandleDeleteOrganization(indexNo) {
    this.showConsent(this.onDeleteOrganization.bind(this, indexNo));
  }

  /**
   * Delete organization by index
   * @param indexNo the organization index no
   */
  onDeleteOrganization(indexNo) {
    const { organizationTrait } = this.state;
    const newOrganizationTrait = { ...organizationTrait };
    newOrganizationTrait.traits.data.splice(indexNo, 1);
    this.setState({
      organizationTrait: newOrganizationTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newOrganizationTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'organization', newOrganizationTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'organization', tokenV3);
    }
  }

  /**
   * Add new organization
   * @param e from submit event
   * @param answer user consent answer value
   */
  onAddOrganization(answer) {
    const { newOrganization, organizationTrait, personalizationTrait } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    newOrganization.timePeriodFrom = new Date(newOrganization.timePeriodFrom).getTime();
    newOrganization.timePeriodTo = new Date(newOrganization.timePeriodTo).getTime();

    // save organiazation
    if (organizationTrait.traits && organizationTrait.traits.data.length > 0) {
      const newOrganizationTrait = { ...organizationTrait };
      newOrganizationTrait.traits.data.push(newOrganization);
      this.setState({ organizationTrait: newOrganizationTrait });
      updateUserTrait(handle, 'organization', newOrganizationTrait.traits.data, tokenV3);
    } else {
      const newOrganizations = [];
      newOrganizations.push(newOrganization);
      const traits = {
        data: newOrganizations,
      };
      this.setState({ organizationTrait: { traits } });
      addUserTrait(handle, 'organization', newOrganizations, tokenV3);
    }
    const empty = {
      name: '',
      sector: '',
      city: '',
      timePeriodFrom: '',
      timePeriodTo: '',
    };
    this.setState({ newOrganization: empty });

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
    const { newOrganization: oldOrganization } = this.state;
    const newOrganization = { ...oldOrganization };
    newOrganization[e.target.name] = e.target.value;
    this.setState({ newOrganization });
  }

  /**
   * Get organization trait
   * @param userTraits the all user traits
   */
  loadOrganizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'organization');
    const organizations = trait.length === 0 ? {} : trait[0];
    return _.assign({}, organizations);
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
    const {
      settingsUI,
    } = this.props;
    const {
      organizationTrait,
      isMobileView,
    } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.ORGANIZATION ? '' : 'hide';
    const organizationItems = organizationTrait.traits
      ? organizationTrait.traits.data.slice() : [];
    const { newOrganization, formInvalid, errorMessage } = this.state;

    return (
      <div styleName={containerStyle}>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        <div styleName="organization-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Organization
          </h1>
          <div styleName={`sub-title ${organizationItems.length > 0 ? '' : 'hidden'}`}>
            Your organizations
          </div>
          {
            !isMobileView && organizationItems.length > 0
            && (
              <OrganizationList
                organizationList={{ items: organizationItems }}
                onDeleteItem={this.onDeleteOrganization}
              />
            )
          }
          <div styleName={`sub-title ${organizationItems.length > 0 ? 'second' : 'first'}`}>
            Add a new organization
          </div>
          <div styleName="form-container-default">
            <form name="device-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="name">
                    Organization Name
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="name" name="name" type="text" placeholder="Organization" onChange={this.onUpdateInput} value={newOrganization.name} maxLength="128" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="sector">
                    Sector
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="sector" name="sector" type="text" placeholder="Sector" onChange={this.onUpdateInput} value={newOrganization.sector} maxLength="128" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="city">
                    City
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="city" name="city" type="text" placeholder="City" onChange={this.onUpdateInput} value={newOrganization.city} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="timePeriodFrom">
                    From
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="timePeriodFrom" styleName="date-input" name="timePeriodFrom" type="date" onChange={this.onUpdateInput} value={newOrganization.timePeriodFrom} required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="timePeriodTo">
                    To
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="timePeriodTo" styleName="date-input" name="timePeriodTo" type="date" onChange={this.onUpdateInput} value={newOrganization.timePeriodTo} required />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddOrganization}
              >
                Add organizations to your list
              </PrimaryButton>
            </div>
          </div>
          <div styleName="form-container-mobile">
            <form name="organization-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Organization
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="name">
                    Organization Name
                  </label>
                  <input id="name" name="name" type="text" placeholder="Organization" onChange={this.onUpdateInput} value={newOrganization.name} maxLength="128" required />
                </div>
                <div styleName="field col-2">
                  <label htmlFor="sector">
                    Sector
                  </label>
                  <input id="sector" name="sector" type="text" placeholder="Sector" onChange={this.onUpdateInput} value={newOrganization.sector} maxLength="128" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field city">
                  <label htmlFor="city">
                    City
                  </label>
                  <input id="city" name="city" type="text" placeholder="City" onChange={this.onUpdateInput} value={newOrganization.city} maxLength="64" required />
                </div>
                <div styleName="field date">
                  <label htmlFor="timePeriodFrom">
                    From
                  </label>
                  <input id="timePeriodFrom" styleName="date-input" name="timePeriodFrom" type="date" onChange={this.onUpdateInput} value={newOrganization.timePeriodFrom} required />
                </div>
                <div styleName="field date">
                  <label htmlFor="timePeriodTo">
                    To
                  </label>
                  <input id="timePeriodTo" styleName="date-input" name="timePeriodTo" type="date" onChange={this.onUpdateInput} value={newOrganization.timePeriodTo} required />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddOrganization}
              >
                Add Organization
              </PrimaryButton>
            </div>
          </div>
          {
            isMobileView && organizationItems.length > 0
            && (
              <OrganizationList
                organizationList={{ items: organizationItems }}
                onDeleteItem={this.onHandleDeleteOrganization}
              />
            )
          }
        </div>
      </div>
    );
  }
}

Organization.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};
