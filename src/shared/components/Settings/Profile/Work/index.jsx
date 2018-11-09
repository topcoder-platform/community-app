/**
 * Child component of Settings/Profile/ renders the
 * 'Work' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import UserConsentModal from 'components/Settings/UserConsentModal';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import WorkList from './List';

import './styles.scss';


export default class Work extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteWork = this.onDeleteWork.bind(this);
    this.loadWorkTrait = this.loadWorkTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddWork = this.onAddWork.bind(this);
    this.onShowUserConsent = this.onShowUserConsent.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.state = {
      formInvalid: false,
      showUserConsent: false,
      errorMessage: '',
      workTrait: this.loadWorkTrait(props.userTraits),
      personalizationTrait: this.loadPersonalizationTrait(props.userTraits),
      newWork: {
        company: '',
        position: '',
        cityTown: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        industry: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const workTrait = this.loadWorkTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      workTrait,
      personalizationTrait,
      formInvalid: false,
      errorMessage: '',
      newWork: {
        company: '',
        position: '',
        cityTown: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        industry: '',
      },
    });
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onShowUserConsent(e) {
    e.preventDefault();
    const { newWork } = this.state;
    if (this.onCheckFormValue(newWork)) {
      return;
    }
    this.setState({ showUserConsent: true });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newWork object
   */
  onCheckFormValue(newWork) {
    let invalid = false;
    let dateInvalid = false;
    let errorMessage = '';
    let dateCount = 0;
    let dateError = '';
    let haveDate = false;

    if (!_.trim(newWork.company).length) {
      errorMessage += 'Company, ';
      invalid = true;
    }

    if (!_.trim(newWork.position).length) {
      errorMessage += 'Position, ';
      invalid = true;
    }

    if (!_.trim(newWork.cityTown).length) {
      errorMessage += 'City, ';
      invalid = true;
    }


    if (!_.trim(newWork.industry).length) {
      errorMessage += 'Industry, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    const fromDate = new Date(newWork.timePeriodFrom).getTime();
    const toDate = new Date(newWork.timePeriodTo).getTime();

    if (fromDate > toDate) {
      dateError += 'From Date value should be smaller than To Date value. ';
      dateInvalid = true;
      haveDate = true;
    }

    if (!haveDate) {
      if (!_.trim(newWork.timePeriodFrom).length) {
        dateError += 'From Date, ';
        dateInvalid = true;
        dateCount += 1;
      }

      if (!_.trim(newWork.timePeriodTo).length) {
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

  /**
   * Delete work by index
   * @param indexNo the work index no
   */
  onDeleteWork(indexNo) {
    const { workTrait } = this.state;
    const newWorkTrait = { ...workTrait };
    newWorkTrait.traits.data.splice(indexNo, 1);
    this.setState({
      workTrait: newWorkTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newWorkTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'work', newWorkTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'work', tokenV3);
    }
  }

  /**
   * Add new work
   * @param e form submit event
   * @param answer user consent answer value
   */
  onAddWork(e, answer) {
    e.preventDefault();
    this.setState({ showUserConsent: false });
    const { newWork, personalizationTrait } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    const { workTrait } = this.state;

    newWork.timePeriodFrom = new Date(newWork.timePeriodFrom).getTime();
    newWork.timePeriodTo = new Date(newWork.timePeriodTo).getTime();

    if (workTrait.traits && workTrait.traits.data.length > 0) {
      const newWorkTrait = { ...workTrait };
      newWorkTrait.traits.data.push(newWork);
      this.setState({ workTrait: newWorkTrait });
      updateUserTrait(handle, 'work', newWorkTrait.traits.data, tokenV3);
    } else {
      const newWorks = [];
      newWorks.push(newWork);
      const traits = {
        data: newWorks,
      };
      this.setState({ workTrait: { traits } });
      addUserTrait(handle, 'work', newWorks, tokenV3);
    }
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
    const { newWork: oldWork } = this.state;
    const newWork = { ...oldWork };
    newWork[e.target.name] = e.target.value;
    this.setState({ newWork });
  }

  /**
   * Get work trait
   * @param userTraits the all user traits
   */
  loadWorkTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'work');
    const works = trait.length === 0 ? {} : trait[0];
    return _.assign({}, works);
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
    const {
      settingsUI,
    } = this.props;
    const {
      workTrait,
      showUserConsent,
    } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.WORK ? '' : 'hide';
    const workItems = workTrait.traits
      ? workTrait.traits.data.slice() : [];
    const { newWork, formInvalid, errorMessage } = this.state;

    return (
      <div styleName={containerStyle}>
        {
          showUserConsent && (<UserConsentModal onSaveTrait={this.onAddWork} />)
        }
        <div styleName="work-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Work
          </h1>
          <div styleName="form-container">
            <form name="work-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Workplace
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="company">
                    Company
                  </label>
                  <input id="company" name="company" type="text" placeholder="Company" onChange={this.onUpdateInput} value={newWork.company} maxLength="64" required />
                </div>
                <div styleName="field col-2">
                  <label htmlFor="position">
                    Position
                  </label>
                  <input id="position" name="position" type="text" placeholder="Position" onChange={this.onUpdateInput} value={newWork.position} maxLength="64" required />
                </div>
                <div styleName="field col-3">
                  <label htmlFor="industry">
                    Industry
                  </label>
                  <input id="industry" name="industry" type="text" placeholder="Industry" onChange={this.onUpdateInput} value={newWork.industry} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-city">
                  <label htmlFor="cityTown">
                    City
                  </label>
                  <input id="cityTown" name="cityTown" type="text" placeholder="City" onChange={this.onUpdateInput} value={newWork.cityTown} maxLength="64" required />
                </div>
                <div styleName="field col-date">
                  <label htmlFor="timePeriodFrom">
                    From
                  </label>
                  <input id="timePeriodFrom" styleName="date-input" name="timePeriodFrom" type="date" onChange={this.onUpdateInput} value={newWork.timePeriodFrom} required />
                </div>
                <div styleName="field col-date">
                  <label htmlFor="timePeriodTo">
                    To
                  </label>
                  <input id="timePeriodTo" styleName="date-input" name="timePeriodTo" type="date" onChange={this.onUpdateInput} value={newWork.timePeriodTo} required />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onShowUserConsent}
              >
                Add Workplace
              </PrimaryButton>
            </div>
          </div>
          <WorkList
            workList={{ items: workItems }}
            onDeleteItem={this.onDeleteWork}
          />
        </div>
      </div>
    );
  }
}

Work.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};
