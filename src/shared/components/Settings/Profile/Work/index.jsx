/**
 * Child component of Settings/Profile/ renders the
 * 'Work' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import ConsentComponent from 'components/Settings/ConsentComponent';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import WorkList from './List';

import './styles.scss';


export default class Work extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteWork = this.onHandleDeleteWork.bind(this);
    this.onDeleteWork = this.onDeleteWork.bind(this);
    this.loadWorkTrait = this.loadWorkTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddWork = this.onHandleAddWork.bind(this);
    this.onAddWork = this.onAddWork.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      errorMessage: '',
      workTrait: this.loadWorkTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newWork: {
        company: '',
        position: '',
        cityTown: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        industry: '',
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddWork(e) {
    e.preventDefault();
    const { newWork } = this.state;
    if (this.onCheckFormValue(newWork)) {
      return;
    }
    this.showConsent(this.onAddWork.bind(this));
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

  onHandleDeleteWork(indexNo) {
    this.showConsent(this.onDeleteWork.bind(this, indexNo));
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
   * @param answer user consent answer value
   */
  onAddWork(answer) {
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

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      workTrait,
      isMobileView,
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
          this.shouldRenderConsent() && this.renderConsent()
        }
        <div styleName="work-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Work
          </h1>
          <div styleName={`sub-title ${workItems.length > 0 ? '' : 'hidden'}`}>
            Your workplaces
          </div>
          {
            !isMobileView && workItems.length > 0
            && (
              <WorkList
                workList={{ items: workItems }}
                onDeleteItem={this.onDeleteWork}
              />
            )
          }
          <div styleName={`sub-title ${workItems.length > 0 ? 'second' : 'first'}`}>
            Add a new workplace
          </div>
          <div styleName="form-container-default">
            <form name="device-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="company">
                    Company
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="company" name="company" type="text" placeholder="Company" onChange={this.onUpdateInput} value={newWork.company} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="position">
                    Position
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="position" name="position" type="text" placeholder="Position" onChange={this.onUpdateInput} value={newWork.position} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="industry">
                    Industry
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="industry" name="industry" type="text" placeholder="Industry" onChange={this.onUpdateInput} value={newWork.industry} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="cityTown">
                    City
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="cityTown" name="cityTown" type="text" placeholder="City" onChange={this.onUpdateInput} value={newWork.cityTown} maxLength="64" required />
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
                  <input id="timePeriodFrom" styleName="date-input" name="timePeriodFrom" type="date" onChange={this.onUpdateInput} value={newWork.timePeriodFrom} required />
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
                  <input id="timePeriodTo" styleName="date-input" name="timePeriodTo" type="date" onChange={this.onUpdateInput} value={newWork.timePeriodTo} required />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddWork}
              >
                Add workplace to your list
              </PrimaryButton>
            </div>
          </div>
          <div styleName="form-container-mobile">
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
                onClick={this.onHandleAddWork}
              >
                Add Workplace
              </PrimaryButton>
            </div>
          </div>
          {
            isMobileView && workItems.length > 0
            && (
              <WorkList
                workList={{ items: workItems }}
                onDeleteItem={this.onHandleDeleteWork}
              />
            )
          }
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
