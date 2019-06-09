/**
 * Child component of Settings/Profile/ renders the
 * 'Education' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import Select from 'components/Select';
import ConsentComponent from 'components/Settings/ConsentComponent';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import DatePicker from 'components/challenge-listing/Filters/DatePicker';
import dropdowns from './dropdowns.json';
import ConfirmationModal from '../../CofirmationModal';
import EducationList from './List';

import './styles.scss';


export default class Education extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteEducation = this.onHandleDeleteEducation.bind(this);
    this.onDeleteEducation = this.onDeleteEducation.bind(this);
    this.onEditEducation = this.onEditEducation.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadEducationTrait = this.loadEducationTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddEducation = this.onHandleAddEducation.bind(this);
    this.onAddEducation = this.onAddEducation.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onUpdateDate = this.onUpdateDate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      errorMessage: '',
      educationTrait: this.loadEducationTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newEducation: {
        type: '',
        schoolCollegeName: '',
        major: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        graduated: false,
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
    const educationTrait = this.loadEducationTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      educationTrait,
      personalizationTrait,
      formInvalid: false,
      errorMessage: '',
      newEducation: {
        type: '',
        schoolCollegeName: '',
        major: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        graduated: false,
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newEducation object
   */
  onCheckFormValue(newEducation) {
    let invalid = false;
    let dateInvalid = false;
    let errorMessage = '';
    let dateCount = 0;
    let dateError = '';
    let haveDate = false;

    if (!_.trim(newEducation.type).length) {
      errorMessage += 'Type, ';
      invalid = true;
    }

    if (!_.trim(newEducation.schoolCollegeName).length) {
      errorMessage += 'Name of College or University, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    if (!_.isEmpty(newEducation.timePeriodFrom) && !_.isEmpty(newEducation.timePeriodTo)) {
      const fromDate = new Date(newEducation.timePeriodFrom).getTime();
      const toDate = new Date(newEducation.timePeriodTo).getTime();

      if (fromDate > toDate) {
        dateError += 'From Date value should be smaller than To Date value. ';
        dateInvalid = true;
        haveDate = true;
      }
    }

    if (!haveDate
      && !(_.isEmpty(newEducation.timePeriodFrom) && _.isEmpty(newEducation.timePeriodTo))) {
      if (!_.trim(newEducation.timePeriodFrom).length) {
        dateError += 'From Date, ';
        dateInvalid = true;
        dateCount += 1;
      }

      if (!_.trim(newEducation.timePeriodTo).length) {
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

  onHandleDeleteEducation(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
  }

  onUpdateDate(date, timePeriod) {
    if (date) {
      const { newEducation: oldEducation } = this.state;
      const newEducation = { ...oldEducation };
      newEducation[timePeriod] = date;
      this.setState({ newEducation });
    }
  }

  /**
   * Delete education by index
   * @param indexNo the education index no
   */
  onDeleteEducation(indexNo) {
    const { educationTrait } = this.state;
    const newEducationTrait = { ...educationTrait };
    newEducationTrait.traits.data.splice(indexNo, 1);
    this.setState({
      educationTrait: newEducationTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newEducationTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'education', newEducationTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'education', tokenV3);
    }

    this.setState({
      showConfirmation: false,
      indexNo: null,
    });
  }

  /**
   * Edit Education by index
   * @param indexNo the education index no
   */
  onEditEducation(indexNo) {
    const { educationTrait } = this.state;
    this.setState({
      newEducation: {
        type: educationTrait.traits.data[indexNo].type,
        schoolCollegeName: educationTrait.traits.data[indexNo].schoolCollegeName,
        major: _.isEmpty(educationTrait.traits.data[indexNo].major) ? '' : educationTrait.traits.data[indexNo].major,
        timePeriodFrom: _.isEmpty(educationTrait.traits.data[indexNo].timePeriodFrom) ? '' : educationTrait.traits.data[indexNo].timePeriodFrom,
        timePeriodTo: _.isEmpty(educationTrait.traits.data[indexNo].timePeriodTo) ? '' : educationTrait.traits.data[indexNo].timePeriodTo,
        graduated: educationTrait.traits.data[indexNo].graduated,
      },
      isEdit: true,
      indexNo,
    });
  }

  /**
   * Add new education
   * @param answer user consent answer value
   */
  onAddEducation(answer) {
    const {
      newEducation, personalizationTrait, isEdit, indexNo,
    } = this.state;

    if (this.onCheckFormValue(newEducation)) {
      return;
    }

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    const { educationTrait } = this.state;

    const education = _.clone(newEducation);
    if (_.isEmpty(education.major)) {
      delete education.major;
    }
    if (_.isEmpty(education.timePeriodFrom)) {
      delete education.timePeriodFrom;
    } else {
      education.timePeriodFrom = new Date(newEducation.timePeriodFrom).getTime();
    }
    if (_.isEmpty(education.timePeriodTo)) {
      delete education.timePeriodTo;
    } else {
      education.timePeriodTo = new Date(newEducation.timePeriodTo).getTime();
    }

    if (educationTrait.traits && educationTrait.traits.data.length > 0) {
      const newEducationTrait = { ...educationTrait };
      if (isEdit) {
        newEducationTrait.traits.data.splice(indexNo, 1);
      }
      newEducationTrait.traits.data.push(education);
      this.setState({ educationTrait: newEducationTrait });
      updateUserTrait(handle, 'education', newEducationTrait.traits.data, tokenV3);
    } else {
      const newEducations = [];
      newEducations.push(education);
      const traits = {
        data: newEducations,
      };
      this.setState({ educationTrait: { traits } });
      addUserTrait(handle, 'education', newEducations, tokenV3);
    }
    const empty = {
      type: '',
      schoolCollegeName: '',
      major: '',
      timePeriodFrom: '',
      timePeriodTo: '',
      graduated: false,
    };
    this.setState({
      newEducation: empty,
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
    const { newEducation: oldEducation } = this.state;
    const newEducation = { ...oldEducation };
    newEducation[e.target.name] = e.target.type !== 'checkbox' ? e.target.value : e.target.checked;
    this.setState({ newEducation });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newEducation: oldEducation } = this.state;
      const newEducation = { ...oldEducation };
      newEducation[option.key] = option.name;
      this.setState({ newEducation });
    }
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddEducation(e) {
    e.preventDefault();
    const { newEducation } = this.state;
    if (this.onCheckFormValue(newEducation)) {
      return;
    }
    this.showConsent(this.onAddEducation.bind(this));
  }

  /**
   * Get education trait
   * @param userTraits the all user traits
   */
  loadEducationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'education');
    const educations = trait.length === 0 ? {} : trait[0];
    return _.assign({}, educations);
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
        newEducation: {
          type: '',
          schoolCollegeName: '',
          major: '',
          timePeriodFrom: '',
          timePeriodTo: '',
          graduated: false,
        },
      });
    }
  }

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      educationTrait,
      isMobileView,
      isEdit,
      showConfirmation,
      indexNo,
    } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.EDUCATION ? '' : 'hide';
    const educationItems = educationTrait.traits
      ? educationTrait.traits.data.slice() : [];
    const { newEducation, formInvalid, errorMessage } = this.state;


    return (
      <div styleName={containerStyle}>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {
          showConfirmation && (
            <ConfirmationModal
              onConfirm={() => this.showConsent(this.onDeleteEducation.bind(this, indexNo))}
              onCancel={() => this.setState({
                showConfirmation: false,
                indexNo: null,
              })}
            />
          )
        }
        <div styleName="education-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Education
          </h1>
          <div styleName={`sub-title ${educationItems.length > 0 ? '' : 'hidden'}`}>
            Your education
          </div>
          {
            !isMobileView && educationItems.length > 0
            && (
              <EducationList
                educationList={{ items: educationItems }}
                onDeleteItem={this.onHandleDeleteEducation}
                onEditItem={this.onEditEducation}
              />
            )
          }
          <div styleName={`sub-title ${educationItems.length > 0 ? 'second' : 'first'}`}>
            {
              isEdit ? (<React.Fragment>Edit education</React.Fragment>)
                : (<React.Fragment>Add a new education</React.Fragment>)
            }
          </div>
          <div styleName="form-container-default">
            <form name="device-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="educationType">
                    Type
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <Select
                    name="type"
                    options={dropdowns.type}
                    onChange={this.onUpdateSelect}
                    value={newEducation.type}
                    placeholder="School"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="name">
                    Name of College or University
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="schoolCollegeName" name="schoolCollegeName" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newEducation.schoolCollegeName} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1-no-padding">
                  <label htmlFor="major">
                    Major
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <input id="major" name="major" type="text" placeholder="Major" onChange={this.onUpdateInput} value={newEducation.major} maxLength="64" required />
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
                    date={newEducation.timePeriodFrom}
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
                    date={newEducation.timePeriodTo}
                    id="date-to1"
                    onDateChange={date => this.onUpdateDate(date, 'timePeriodTo')}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="graduated">
                    Graduated
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <div styleName="tc-checkbox">
                    <input
                      name="graduated"
                      checked={newEducation.graduated}
                      id="graduated"
                      onChange={this.onUpdateInput}
                      type="checkbox"
                    />
                    <label htmlFor="graduated">
                      <div styleName="tc-checkbox-label">
                        &nbsp;
                      </div>
                      <input type="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </form>
            <div styleName="button-container">
              <div styleName="button-save">
                <PrimaryButton
                  styleName="complete"
                  onClick={this.onHandleAddEducation}
                >
                  {
                    isEdit ? (<React.Fragment>Edit education to your list</React.Fragment>)
                      : (<React.Fragment>Add education to your list</React.Fragment>)
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
            <form name="education-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  {
                    isEdit ? (<React.Fragment>Edit Education</React.Fragment>)
                      : (<React.Fragment>Add Education</React.Fragment>)
                  }
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="type">
                    Type
                    <span styleName="text-required">* Required</span>
                    <input type="hidden" />
                  </label>
                  <Select
                    name="type"
                    options={dropdowns.type}
                    onChange={this.onUpdateSelect}
                    value={newEducation.type}
                    placeholder="School"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>
                <div styleName="field col-2">
                  <label htmlFor="schoolCollegeName">
                    Name of College or University
                    <span styleName="text-required">* Required</span>
                    <input type="hidden" />
                  </label>
                  <input id="schoolCollegeName" name="schoolCollegeName" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newEducation.schoolCollegeName} maxLength="64" required />
                </div>
                <div styleName="field col-3">
                  <label htmlFor="major">
                    Major
                    <input type="hidden" />
                  </label>
                  <input id="major" name="major" type="text" placeholder="Major" onChange={this.onUpdateInput} value={newEducation.major} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-date">
                  <label htmlFor="timePeriodFrom">
                    From
                    <input type="hidden" />
                  </label>
                  <DatePicker
                    readOnly
                    numberOfMonths={1}
                    isOutsideRange={moment()}
                    date={newEducation.timePeriodFrom}
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
                    date={newEducation.timePeriodTo}
                    id="date-to2"
                    onDateChange={date => this.onUpdateDate(date, 'timePeriodTo')}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div styleName="field col-checkbox">
                  <div styleName="tc-checkbox">
                    <input
                      name="graduated"
                      checked={newEducation.graduated}
                      id="graduated"
                      onChange={this.onUpdateInput}
                      type="checkbox"
                    />
                    <label htmlFor="graduated">
                      <div styleName="tc-checkbox-label">
                        Graduated
                      </div>
                      <input type="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </form>
            <div styleName="button-container">
              <div styleName="button-save">
                <PrimaryButton
                  styleName="complete"
                  onClick={this.onHandleAddEducation}
                >
                  {
                    isEdit ? (<React.Fragment>Edit Education</React.Fragment>)
                      : (<React.Fragment>Add Education</React.Fragment>)
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
            isMobileView && educationItems.length > 0
            && (
              <EducationList
                educationList={{ items: educationItems }}
                onDeleteItem={this.onHandleDeleteEducation}
                onEditItem={this.onEditEducation}
              />
            )
          }
        </div>
      </div>
    );
  }
}

Education.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};
