/**
 * Child component of Settings/Profile/ renders the
 * 'Education' page.
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
import EducationList from './List';

import './styles.scss';


export default class Education extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteEducation = this.onDeleteEducation.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadEducationTrait = this.loadEducationTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddEducation = this.onAddEducation.bind(this);
    this.onShowUserConsent = this.onShowUserConsent.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);

    this.state = {
      formInvalid: false,
      showUserConsent: false,
      errorMessage: '',
      educationTrait: this.loadEducationTrait(props.userTraits),
      personalizationTrait: this.loadPersonalizationTrait(props.userTraits),
      newEducation: {
        type: '',
        schoolCollegeName: '',
        major: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        graduated: false,
      },
    };
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
      errorMessage += 'Name, ';
      invalid = true;
    }

    if (!_.trim(newEducation.major).length) {
      errorMessage += 'Major, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    const fromDate = new Date(newEducation.timePeriodFrom).getTime();
    const toDate = new Date(newEducation.timePeriodTo).getTime();

    if (fromDate > toDate) {
      dateError += 'From Date value should be smaller than To Date value. ';
      dateInvalid = true;
      haveDate = true;
    }

    if (!haveDate) {
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
      errorMessage = `${errorMessage}. ${dateError}`;
    } else if (dateError.length > 0) {
      errorMessage = dateError;
      invalid = dateInvalid;
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
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
  }

  /**
   * Add new education
   * @param e form submit event
   * @param answer user consent answer value
   */
  onAddEducation(e, answer) {
    e.preventDefault();
    this.setState({ showUserConsent: false });
    const { newEducation, personalizationTrait } = this.state;

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

    newEducation.timePeriodFrom = new Date(newEducation.timePeriodFrom).getTime();
    newEducation.timePeriodTo = new Date(newEducation.timePeriodTo).getTime();

    if (educationTrait.traits && educationTrait.traits.data.length > 0) {
      const newEducationTrait = { ...educationTrait };
      newEducationTrait.traits.data.push(newEducation);
      this.setState({ educationTrait: newEducationTrait });
      updateUserTrait(handle, 'education', newEducationTrait.traits.data, tokenV3);
    } else {
      const newEducations = [];
      newEducations.push(newEducation);
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
    this.setState({ newEducation: empty });
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
  onShowUserConsent(e) {
    e.preventDefault();
    const { newEducation } = this.state;
    if (this.onCheckFormValue(newEducation)) {
      return;
    }
    this.setState({ showUserConsent: true });
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

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      educationTrait,
      showUserConsent,
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
          showUserConsent && (<UserConsentModal onSaveTrait={this.onAddEducation} />)
        }
        <div styleName="education-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Education
          </h1>
          <div styleName="form-container">
            <form name="education-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Education
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="type">
                    Type
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
                    Name
                  </label>
                  <input id="schoolCollegeName" name="schoolCollegeName" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newEducation.schoolCollegeName} maxLength="64" required />
                </div>
                <div styleName="field col-3">
                  <label htmlFor="major">
                    Major
                  </label>
                  <input id="major" name="major" type="text" placeholder="Major" onChange={this.onUpdateInput} value={newEducation.major} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-date">
                  <label htmlFor="timePeriodFrom">
                    From
                  </label>
                  <input id="timePeriodFrom" styleName="date-input" name="timePeriodFrom" type="date" onChange={this.onUpdateInput} value={newEducation.timePeriodFrom} required />
                </div>
                <div styleName="field col-date">
                  <label htmlFor="timePeriodTo">
                    To
                  </label>
                  <input id="timePeriodTo" styleName="date-input" name="timePeriodTo" type="date" onChange={this.onUpdateInput} value={newEducation.timePeriodTo} required />
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
                    </label>
                  </div>
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onShowUserConsent}
              >
                Add Education
              </PrimaryButton>
            </div>
          </div>
          <EducationList
            educationList={{ items: educationItems }}
            onDeleteItem={this.onDeleteEducation}
          />
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
