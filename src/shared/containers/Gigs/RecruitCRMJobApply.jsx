/**
 * Apply for a job page
 */

import _ from 'lodash';
import actions from 'actions/recruitCRM';
import GigApply from 'components/Gigs/GigApply';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { isValidEmail } from 'utils/tc';
import techSkills from './techSkills';

const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

class RecruitCRMJobApplyContainer extends React.Component {
  constructor(props) {
    super(props);
    // initial state
    this.state = {
      formErrors: {},
      formData: {
        skills: _.map(techSkills, label => ({ label, selected: false })),
        durationConfirm: [{ label: 'Yes', value: false }, { label: 'No', value: false }],
        timezoneConfirm: [{ label: 'Yes', value: false }, { label: 'No', value: false }],
        agreedTerms: false,
        country: _.map(countries.getNames('en'), val => ({ label: val, selected: false })),
        reffereal: [
          { label: 'Google', selected: false },
        ],
        // eslint-disable-next-line react/destructuring-assignment
      },
    };

    // binds
    this.onFormInputChange = this.onFormInputChange.bind(this);
    this.onApplyClick = this.onApplyClick.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
    const { formData } = this.state;
    const { user, recruitProfile, searchCandidates } = this.props;
    this.setState({
      formData: _.merge(formData, user),
    });
    if (user && !recruitProfile) {
      searchCandidates(user.email);
    }
  }

  onFormInputChange(key, value) {
    // update the state
    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
    this.validateForm(key);
  }

  onApplyClick() {
    const { applyForJob, job } = this.props;
    const { formData } = this.state;
    this.validateForm();
    this.setState((state) => {
      if (_.isEmpty(state.formErrors)) {
        applyForJob(job, formData);
      }
    });
  }

  validateForm(prop) {
    this.setState((state) => {
      const { formData, formErrors } = state;
      // Form validation happens here
      const requiredTextFields = [
        'fname', 'lname', 'city', 'phone', 'email',
      ];
      // check required text fields for value
      // check min/max lengths
      _.each(requiredTextFields, (key) => {
        // validate only modified prop if set
        // and do not touch the others
        if (prop && prop !== key) return;
        if (!formData[key] || !_.trim(formData[key])) formErrors[key] = 'Required field';
        else if (formData[key] && _.trim(formData[key]).length < 2) formErrors[key] = 'Must be at least 2 characters';
        else if (formData[key] && _.trim(formData[key]).length > 2) {
          switch (key) {
            case 'city':
            case 'phone':
              if (_.trim(formData[key]).length > 50) formErrors[key] = 'Must be max 50 characters';
              else delete formErrors[key];
              break;
            default:
              if (_.trim(formData[key]).length > 40) formErrors[key] = 'Must be max 40 characters';
              else delete formErrors[key];
              break;
          }
        } else delete formErrors[key];
      });
      // check for selected country
      if (!prop || prop === 'country') {
        if (!_.find(formData.country, { selected: true })) formErrors.country = 'Please, select your country';
        else delete formErrors.country;
      }
      // check for selected reffereal
      if (!prop || prop === 'reffereal') {
        if (!_.find(formData.reffereal, { selected: true })) formErrors.reffereal = 'Please, select your reffereal';
        else delete formErrors.reffereal;
      }
      // check payExpectation to be a number
      if (!prop || prop === 'payExpectation') {
        if (formData.payExpectation && _.trim(formData.payExpectation)) {
          if (!_.isInteger(_.toNumber(formData.payExpectation))) formErrors.payExpectation = 'Must be integer value in $';
          else delete formErrors.payExpectation;
        } else formErrors.payExpectation = 'Required field';
      }
      // check for valid email
      if (!prop || prop === 'email') {
        if (formData.email && _.trim(formData.email)) {
          if (!(isValidEmail(formData.email))) formErrors.email = 'Invalid email';
          else delete formErrors.email;
        }
      }
      // require atleast 1 skill
      if (!prop || prop === 'skills') {
        const skills = _.filter(formData.skills, ['selected', true]);
        if (!skills.length) formErrors.skills = 'Please, add technical skills';
        else if (skills.map(skill => skill.label).join(',').length >= 100) formErrors.skills = 'Sum of all skill characters may not be greater than 100';
        else delete formErrors.skills;
      }
      // have accepted terms
      if (!prop || prop === 'agreedTerms') {
        if (!formData.agreedTerms) formErrors.agreedTerms = 'Please, accept our terms';
        else delete formErrors.agreedTerms;
      }
      // has CV file ready for upload
      if (!prop || prop === 'fileCV') {
        if (!formData.fileCV) formErrors.fileCV = 'Please, pick your CV file for uploading';
        else {
          const sizeInMB = (formData.fileCV.size / (1024 * 1024)).toFixed(2);
          if (sizeInMB > 8) {
            formErrors.fileCV = 'Max file size is limited to 8 MB';
            delete formData.fileCV;
          } else if (_.endsWith(formData.fileCV.name, '.pdf') || _.endsWith(formData.fileCV.name, '.docx')) {
            delete formErrors.fileCV;
          } else {
            formErrors.fileCV = 'Only .pdf and .docx files are allowed';
          }
        }
      }
      // timezone & duration
      if (!prop || prop === 'timezoneConfirm' || prop === 'durationConfirm') {
        const a = _.find(formData[prop], { value: true });
        if (a) {
          if (a.label === 'No') formErrors[prop] = 'Sorry, we are only looking for candidates that can work the hours and duration listed';
          else delete formErrors[prop];
        }
      }
      // updated state
      return {
        ...state,
        formErrors,
      };
    });
  }

  render() {
    const { formErrors, formData } = this.state;
    const { recruitProfile } = this.props;
    return !recruitProfile ? <LoadingIndicator /> : (
      <GigApply
        {...this.props}
        onFormInputChange={this.onFormInputChange}
        formErrors={formErrors}
        formData={formData}
        onApplyClick={this.onApplyClick}
      />
    );
  }
}

RecruitCRMJobApplyContainer.defaultProps = {
  user: null,
  applying: false,
  application: null,
  recruitProfile: null,
};

RecruitCRMJobApplyContainer.propTypes = {
  job: PT.shape().isRequired,
  user: PT.shape(),
  applyForJob: PT.func.isRequired,
  applying: PT.bool,
  application: PT.shape(),
  searchCandidates: PT.func.isRequired,
  recruitProfile: PT.shape(),
};

function mapStateToProps(state, ownProps) {
  const { profile } = state.auth;
  const { job } = ownProps;
  let userData = null;
  if (profile && profile.email) {
    userData = {
      fname: profile.firstName,
      lname: profile.lastName,
      email: profile.email,
      city: profile.addresses && profile.addresses[0] ? profile.addresses[0].city : '',
      handle: profile.handle,
    };
  }
  return {
    user: userData,
    applying: state.recruitCRM && state.recruitCRM[job.slug]
      ? state.recruitCRM[job.slug].applying : false,
    application: state.recruitCRM && state.recruitCRM[job.slug]
      ? state.recruitCRM[job.slug].application : null,
    recruitProfile: state.recruitCRM && state.recruitCRM[profile.email]
      ? state.recruitCRM[profile.email].profile : null,
  };
}

function mapDispatchToActions(dispatch) {
  const a = actions.recruit;
  return {
    applyForJob: (job, payload) => {
      dispatch(a.applyForJobInit(job, payload));
      dispatch(a.applyForJobDone(job, payload));
    },
    searchCandidates: (email) => {
      dispatch(a.searchCandidatesInit(email));
      dispatch(a.searchCandidatesDone(email));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(RecruitCRMJobApplyContainer);
