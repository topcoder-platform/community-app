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
import moment from 'moment';
import ConsentComponent from 'components/Settings/ConsentComponent';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import DatePicker from 'components/challenge-listing/Filters/DatePicker';
import ConfirmationModal from '../../CofirmationModal';
import WorkList from './List';

import './styles.scss';


export default class Work extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteWork = this.onHandleDeleteWork.bind(this);
    this.onDeleteWork = this.onDeleteWork.bind(this);
    this.onEditWork = this.onEditWork.bind(this);
    this.loadWorkTrait = this.loadWorkTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddWork = this.onHandleAddWork.bind(this);
    this.onAddWork = this.onAddWork.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onUpdateDate = this.onUpdateDate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

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
      screenSM: 767,
      isEdit: false,
      indexNo: null,
      showConfirmation: false,
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
      errorMessage += 'Company ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    if (!_.isEmpty(newWork.timePeriodFrom) && !_.isEmpty(newWork.timePeriodTo)) {
      const fromDate = new Date(newWork.timePeriodFrom).getTime();
      const toDate = new Date(newWork.timePeriodTo).getTime();

      if (fromDate > toDate) {
        dateError += 'From Date value should be smaller than To Date value. ';
        dateInvalid = true;
        haveDate = true;
      }
    }

    if (!haveDate
      && !(_.isEmpty(newWork.timePeriodFrom) && _.isEmpty(newWork.timePeriodTo))) {
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
      errorMessage = `${errorMessage}. \n${dateError}`;
    } else if (dateError.length > 0) {
      errorMessage = dateError;
      invalid = dateInvalid;
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  onHandleDeleteWork(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
  }

  onUpdateDate(date, timePeriod) {
    if (date) {
      const { newWork: oldWork } = this.state;
      const newWork = { ...oldWork };
      newWork[timePeriod] = date;
      this.setState({ newWork });
    }
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

    this.setState({
      showConfirmation: false,
      indexNo: null,
    });
  }

  /**
   * Edit work by index
   * @param indexNo the work index no
   */
  onEditWork(indexNo) {
    const { workTrait } = this.state;
    this.setState({
      newWork: {
        company: workTrait.traits.data[indexNo].company,
        position: _.isEmpty(workTrait.traits.data[indexNo].position) ? '' : workTrait.traits.data[indexNo].position,
        cityTown: _.isEmpty(workTrait.traits.data[indexNo].cityTown) ? '' : workTrait.traits.data[indexNo].cityTown,
        timePeriodFrom: _.isEmpty(workTrait.traits.data[indexNo].timePeriodFrom) ? '' : workTrait.traits.data[indexNo].timePeriodFrom,
        timePeriodTo: _.isEmpty(workTrait.traits.data[indexNo].timePeriodTo) ? '' : workTrait.traits.data[indexNo].timePeriodTo,
        industry: _.isEmpty(workTrait.traits.data[indexNo].industry) ? '' : workTrait.traits.data[indexNo].industry,
      },
      isEdit: true,
      indexNo,
    });
  }

  /**
   * Add new work
   * @param answer user consent answer value
   */
  onAddWork(answer) {
    const {
      newWork, personalizationTrait, isEdit, indexNo,
    } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    const { workTrait } = this.state;

    const work = _.clone(newWork);
    if (_.isEmpty(work.position)) {
      delete work.position;
    }
    if (_.isEmpty(work.cityTown)) {
      delete work.cityTown;
    }
    if (_.isEmpty(work.timePeriodFrom)) {
      delete work.timePeriodFrom;
    } else {
      work.timePeriodFrom = new Date(work.timePeriodFrom).getTime();
    }
    if (_.isEmpty(work.timePeriodTo)) {
      delete work.timePeriodTo;
    } else {
      work.timePeriodTo = new Date(work.timePeriodTo).getTime();
    }
    if (_.isEmpty(work.industry)) {
      delete work.industry;
    }

    if (workTrait.traits && workTrait.traits.data.length > 0) {
      const newWorkTrait = { ...workTrait };
      if (isEdit) {
        newWorkTrait.traits.data.splice(indexNo, 1);
      }
      newWorkTrait.traits.data.push(work);
      this.setState({ workTrait: newWorkTrait });
      updateUserTrait(handle, 'work', newWorkTrait.traits.data, tokenV3);
    } else {
      const newWorks = [];
      newWorks.push(work);
      const traits = {
        data: newWorks,
      };
      this.setState({ workTrait: { traits } });
      addUserTrait(handle, 'work', newWorks, tokenV3);
    }
    this.setState({
      isEdit: false,
      indexNo: null,
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

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        indexNo: null,
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
  }

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      workTrait,
      isMobileView,
      isEdit,
      showConfirmation,
      indexNo,
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
        {
          showConfirmation && (
            <ConfirmationModal
              onConfirm={() => this.showConsent(this.onDeleteWork.bind(this, indexNo))}
              onCancel={() => this.setState({
                showConfirmation: false,
                indexNo: null,
              })}
            />
          )
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
                onEditItem={this.onEditWork}
              />
            )
          }
          <div styleName={`sub-title ${workItems.length > 0 ? 'second' : 'first'}`}>
            {
              isEdit ? (<React.Fragment>Edit workplace</React.Fragment>)
                : (<React.Fragment>Add a new workplace</React.Fragment>)
            }
          </div>
          <div styleName="form-container-default">
            <form name="device-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="company">
                    Company
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="company" name="company" type="text" placeholder="Company" onChange={this.onUpdateInput} value={newWork.company} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1-no-padding">
                  <label htmlFor="position">
                    Position
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <input id="position" name="position" type="text" placeholder="Position" onChange={this.onUpdateInput} value={newWork.position} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1-no-padding">
                  <label htmlFor="industry">
                    Industry
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <input id="industry" name="industry" type="text" placeholder="Industry" onChange={this.onUpdateInput} value={newWork.industry} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1-no-padding">
                  <label htmlFor="cityTown">
                    City
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <input id="cityTown" name="cityTown" type="text" placeholder="City" onChange={this.onUpdateInput} value={newWork.cityTown} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1-no-padding">
                  <label htmlFor="timePeriodFrom">
                    From
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <DatePicker
                    readOnly
                    numberOfMonths={1}
                    isOutsideRange={moment()}
                    date={newWork.timePeriodFrom}
                    id="date-from1"
                    onDateChange={date => this.onUpdateDate(date, 'timePeriodFrom')}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1-no-padding">
                  <label htmlFor="timePeriodTo">
                    To
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <DatePicker
                    readOnly
                    numberOfMonths={1}
                    isOutsideRange={moment()}
                    date={newWork.timePeriodTo}
                    id="date-to1"
                    onDateChange={date => this.onUpdateDate(date, 'timePeriodTo')}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
            </form>
            <div styleName="button-container">
              <div styleName="button-save">
                <PrimaryButton
                  styleName="complete"
                  onClick={this.onHandleAddWork}
                >
                  {
                    isEdit ? (<React.Fragment>Edit workplace to your list</React.Fragment>)
                      : (<React.Fragment>Add workplace to your list</React.Fragment>)
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
            <form name="work-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  {
                    isEdit ? (<React.Fragment>Edit Workplace</React.Fragment>)
                      : (<React.Fragment>Add Workplace</React.Fragment>)
                  }
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="company">
                    Company
                    <span styleName="text-required">* Required</span>
                    <input type="hidden" />
                  </label>
                  <input id="company" name="company" type="text" placeholder="Company" onChange={this.onUpdateInput} value={newWork.company} maxLength="64" required />
                </div>
                <div styleName="field col-2">
                  <label htmlFor="position">
                    Position
                    <input type="hidden" />
                  </label>
                  <input id="position" name="position" type="text" placeholder="Position" onChange={this.onUpdateInput} value={newWork.position} maxLength="64" required />
                </div>
                <div styleName="field col-3">
                  <label htmlFor="industry">
                    Industry
                    <input type="hidden" />
                  </label>
                  <input id="industry" name="industry" type="text" placeholder="Industry" onChange={this.onUpdateInput} value={newWork.industry} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-city">
                  <label htmlFor="cityTown">
                    City
                    <input type="hidden" />
                  </label>
                  <input id="cityTown" name="cityTown" type="text" placeholder="City" onChange={this.onUpdateInput} value={newWork.cityTown} maxLength="64" required />
                </div>
                <div styleName="field col-date">
                  <label htmlFor="timePeriodFrom">
                    From
                    <input type="hidden" />
                  </label>
                  <DatePicker
                    readOnly
                    numberOfMonths={1}
                    isOutsideRange={moment()}
                    date={newWork.timePeriodFrom}
                    id="date-from2"
                    onDateChange={date => this.onUpdateDate(date, 'timePeriodFrom')}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div styleName="field col-date">
                  <label htmlFor="timePeriodTo">
                    To
                    <input type="hidden" />
                  </label>
                  <DatePicker
                    readOnly
                    numberOfMonths={1}
                    isOutsideRange={moment()}
                    date={newWork.timePeriodTo}
                    id="date-to2"
                    onDateChange={date => this.onUpdateDate(date, 'timePeriodTo')}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
            </form>
            <div styleName="button-container">
              <div styleName="button-save">
                <PrimaryButton
                  styleName="complete"
                  onClick={this.onHandleAddWork}
                >
                  {
                    isEdit ? (<React.Fragment>Edit Workplace</React.Fragment>)
                      : (<React.Fragment>Add Workplace</React.Fragment>)
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
            isMobileView && workItems.length > 0
            && (
              <WorkList
                workList={{ items: workItems }}
                onDeleteItem={this.onHandleDeleteWork}
                onEditItem={this.onEditWork}
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
