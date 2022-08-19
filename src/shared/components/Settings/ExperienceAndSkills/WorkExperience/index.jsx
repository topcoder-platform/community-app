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
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import ErrorMessage from 'components/Settings/ErrorMessage';
import { validateStartDate, validateEndDate } from 'utils/settings';
import FormField from 'components/Settings/FormField';
import FormInputText from 'components/Settings/FormInputText';
import FormInputCheckbox from 'components/Settings/FormInputCheckbox';
import FormInputDatePicker from 'components/Settings/FormInputDatePicker';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import WorkplaceList from './WorkplaceList';
import ConfirmationModal from '../../ConfirmationModal';

import styles from './styles.scss';

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
    this.onUpdateDate = this.onUpdateDate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateDisabled: false,
      endDateInvalidMsg: '',
      isSumbit: false,
      workTrait: this.loadWorkTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newWork: {
        company: '',
        position: '',
        cityTown: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        industry: '',
        working: false,
      },
      isEdit: false,
      indexNo: null,
      showConfirmation: false,
      windowInnerWidth: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const workTrait = this.loadWorkTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      workTrait,
      personalizationTrait,
      isSubmit: false,
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateDisabled: false,
      endDateInvalidMsg: '',
    });
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ windowInnerWidth: window.innerWidth });
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddWork(e) {
    if (e) e.preventDefault();
    const { newWork } = this.state;
    this.setState({ isSubmit: true });
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

    if (!_.trim(newWork.company).length) {
      invalid = true;
    }

    const fromDateValidResult = validateStartDate(newWork.working,
      newWork.timePeriodFrom, newWork.timePeriodTo);
    const endDateValidResult = validateEndDate(newWork.working,
      newWork.timePeriodFrom, newWork.timePeriodTo);
    const formInvalid = invalid || fromDateValidResult.invalid || endDateValidResult.invalid;

    this.setState({
      formInvalid,
      startDateInvalid: fromDateValidResult.invalid,
      startDateInvalidMsg: fromDateValidResult.message,
      endDateInvalid: endDateValidResult.invalid,
      endDateInvalidMsg: endDateValidResult.message,
    });

    return formInvalid;
  }

  onHandleDeleteWork(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
  }

  onUpdateDate(date, timePeriod) {
    const { newWork: oldWork } = this.state;
    const newWork = { ...oldWork };
    newWork[timePeriod] = date;
    this.setState({ newWork, isSubmit: false });
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
      newWork: {
        company: '',
        position: '',
        cityTown: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        industry: '',
        working: false,
      },
      isEdit: false,
      indexNo: null,
      isSubmit: false,
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateDisabled: false,
      endDateInvalidMsg: '',
    });
  }

  /**
   * Edit work by index
   * @param indexNo the work index no
   */
  onEditWork(indexNo) {
    const { workTrait } = this.state;
    const isEmpty = val => val == null || val === '';

    this.setState({
      newWork: {
        company: workTrait.traits.data[indexNo].company,
        position: isEmpty(workTrait.traits.data[indexNo].position) ? '' : workTrait.traits.data[indexNo].position,
        cityTown: isEmpty(workTrait.traits.data[indexNo].cityTown) ? '' : workTrait.traits.data[indexNo].cityTown,
        timePeriodFrom: isEmpty(workTrait.traits.data[indexNo].timePeriodFrom) ? '' : workTrait.traits.data[indexNo].timePeriodFrom,
        timePeriodTo: isEmpty(workTrait.traits.data[indexNo].timePeriodTo) ? '' : workTrait.traits.data[indexNo].timePeriodTo,
        industry: isEmpty(workTrait.traits.data[indexNo].industry) ? '' : workTrait.traits.data[indexNo].industry,
        working: workTrait.traits.data[indexNo].working,
      },
      isEdit: true,
      indexNo,
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateDisabled: workTrait.traits.data[indexNo].working,
      endDateInvalidMsg: '',
      isSubmit: false,
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
    const isEmpty = val => val == null || val === '';
    const isEmptyObject = val => _.isEmpty(val);

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    const { workTrait } = this.state;

    const work = _.clone(newWork);
    if (isEmpty(work.position)) {
      delete work.position;
    }
    if (isEmpty(work.cityTown)) {
      delete work.cityTown;
    }
    if (isEmpty(work.timePeriodFrom)) {
      delete work.timePeriodFrom;
    } else {
      work.timePeriodFrom = new Date(work.timePeriodFrom).getTime();
    }
    if (isEmpty(work.timePeriodTo)) {
      delete work.timePeriodTo;
    } else {
      work.timePeriodTo = new Date(work.timePeriodTo).getTime();
    }
    if (isEmpty(work.industry)) {
      delete work.industry;
    }

    if (workTrait.traits && workTrait.traits.data.length > 0) {
      const newWorkTrait = _.cloneDeep(workTrait);
      if (isEdit) {
        newWorkTrait.traits.data.splice(indexNo, 1);
      }
      newWorkTrait.traits.data.push(work);
      updateUserTrait(handle, 'work', newWorkTrait.traits.data, tokenV3);
    } else {
      const newWorks = [];
      newWorks.push(work);
      addUserTrait(handle, 'work', newWorks, tokenV3);
    }
    this.setState({
      isEdit: false,
      indexNo: null,
      isSubmit: false,
    });
    // save personalization
    if (isEmptyObject(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }

    this.clearForm();
  }

  clearForm() {
    this.setState({
      newWork: {
        company: '',
        position: '',
        cityTown: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        industry: '',
        working: false,
      },
    });
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newWork: oldWork } = this.state;
    const newWork = { ...oldWork };
    let endDateDisabled = newWork.working;
    if (e.target.type !== 'checkbox') {
      newWork[e.target.name] = e.target.value;
    } else {
      newWork[e.target.name] = e.target.checked;
      if (e.target.checked) { // if working nullify toDate
        newWork.timePeriodTo = '';
        endDateDisabled = true;
      } else {
        endDateDisabled = false;
      }
    }
    this.setState({ newWork, isSubmit: false, endDateDisabled });
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

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        isSubmit: false,
        indexNo: null,
        newWork: {
          company: '',
          position: '',
          cityTown: '',
          timePeriodFrom: '',
          timePeriodTo: '',
          industry: '',
          working: false,
        },
        formInvalid: false,
        startDateInvalid: false,
        startDateInvalidMsg: '',
        endDateInvalid: false,
        endDateDisabled: false,
        endDateInvalidMsg: '',
      });
    }
  }

  render() {
    const {
      workTrait,
      isEdit,
      showConfirmation,
      indexNo,
      formInvalid,
      startDateInvalid,
      startDateInvalidMsg,
      endDateInvalid,
      endDateDisabled,
      endDateInvalidMsg,
      isSubmit,
      windowInnerWidth,
    } = this.state;
    const workItems = workTrait.traits
      ? workTrait.traits.data.slice() : [];
    const { newWork } = this.state;

    return (
      <React.Fragment>
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
              name={workTrait.traits.data[indexNo].company}
            />
          )
        }
        <div styleName="work-container">
          <h2 styleName="title">
            Work Experience
          </h2>

          <div styleName="form-container">
            <Collapse>
              <div styleName="form-title">
                {
                  isEdit ? (<React.Fragment>Edit workplace</React.Fragment>)
                    : (<React.Fragment>Add a new workplace</React.Fragment>)
                }
              </div>
              {
                workItems.length > 0
                && (
                  <WorkplaceList
                    workList={{ items: workItems }}
                    onDeleteItem={this.onHandleDeleteWork}
                    onEditItem={this.onEditWork}
                  />
                )
              }
              <div styleName="form-content">
                <div styleName="form-label">
                  Enter your work experience to show customers the roles and responsibilites
                  you have held in the past.
                </div>
                <div styleName="form-body">
                  <form styleName="workplace-form" noValidate autoComplete="off">
                    <FormField label="Company *" style={{ flex: '0 0 100%' }}>
                      <FormInputText
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Enter company"
                        onChange={this.onUpdateInput}
                        value={newWork.company}
                        maxLength="64"
                        required
                      />
                      {isSubmit && formInvalid && (
                        <ErrorMessage
                          invalid={_.isEmpty(newWork.company)}
                          message="Company cannot be empty"
                        />
                      )}
                    </FormField>

                    <FormField label="Position" style={{ flex: '0 0 100%' }}>
                      <FormInputText
                        id="position"
                        name="position"
                        type="text"
                        placeholder="Enter position"
                        onChange={this.onUpdateInput}
                        value={newWork.position}
                        maxLength="64"
                        required={false}
                      />
                    </FormField>

                    <FormField label="Industry" style={{ flex: '0 0 calc(50% - 5px)', marginRight: '5px' }}>
                      <FormInputText
                        id="industry"
                        name="industry"
                        value={newWork.industry}
                        onChange={this.onUpdateInput}
                        placeholder="Enter industry"
                        maxLength="64"
                      />
                    </FormField>

                    <FormField label="City" style={{ flex: '0 0 calc(50% - 5px)', marginLeft: '5px' }}>
                      <FormInputText
                        id="cityTown"
                        name="cityTown"
                        type="text"
                        placeholder="Enter city"
                        onChange={this.onUpdateInput}
                        value={newWork.cityTown}
                        maxLength="64"
                        required={false}
                      />
                    </FormField>

                    <FormField label="Start Date" style={{ flex: '0 0 calc(50% - 5px)', marginRight: '5px' }}>
                      <FormInputDatePicker
                        readOnly
                        displayFormat="MM/DD/YYYY"
                        placeholder={windowInnerWidth < 768 ? 'Select start' : 'Select start date'}
                        isOutsideRange={date => moment(date).add(-1, 'days').isAfter()}
                        value={newWork.timePeriodFrom}
                        id="date-from1"
                        onChange={date => this.onUpdateDate(date, 'timePeriodFrom')}
                      />
                      {
                        isSubmit && formInvalid && (
                          <ErrorMessage
                            invalid={startDateInvalid}
                            message={startDateInvalidMsg}
                          />
                        )
                      }
                    </FormField>

                    <FormField label="End Date" style={{ flex: '0 0 calc(50% - 5px)', marginLeft: '5px' }}>
                      <FormInputDatePicker
                        readOnly
                        displayFormat="MM/DD/YYYY"
                        placeholder={windowInnerWidth < 768 ? 'Select end' : 'Select end date'}
                        isOutsideRange={date => moment(date).add(-1, 'days').isAfter()}
                        value={newWork.timePeriodTo}
                        id="date-to1"
                        onChange={date => this.onUpdateDate(date, 'timePeriodTo')}
                        anchorDirection="right"
                        disabled={endDateDisabled}
                      />
                      {
                        isSubmit && formInvalid && (
                          <ErrorMessage
                            invalid={endDateInvalid}
                            message={endDateInvalidMsg}
                          />
                        )
                      }
                    </FormField>

                    <FormInputCheckbox
                      checked={newWork.working}
                      id="working"
                      name="working"
                      label="I am currently working in this role"
                      onChange={this.onUpdateInput}
                      style={{ flex: '0 0 100%' }}
                    />

                  </form>
                </div>
              </div>
              <div styleName="form-footer">
                {!isEdit && (
                  <PrimaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onHandleAddWork}
                  >
                    <AddItemIcon styleName="icon" /> Add Another Job
                  </PrimaryButton>
                )}

                { isEdit && (
                  <React.Fragment>
                    <PrimaryButton
                      theme={{ button: styles.button }}
                      onClick={this.onHandleAddWork}
                    >
                      Edit workplace to your list
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
            </Collapse>
          </div>
        </div>
      </React.Fragment>
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
};
