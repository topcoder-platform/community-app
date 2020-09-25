/**
 * Apply for a job page
 */

import _ from 'lodash';
import actions from 'actions/recruitCRM';
import GigApply from 'components/Gigs/GigApply';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { isValidEmail } from 'utils/tc';
import techSkills from './techSkills';

class RecruitCRMJobApplyContainer extends React.Component {
  constructor(props) {
    super(props);
    // initial state
    this.state = {
      formErrors: {},
      formData: {
        availFrom: new Date().toISOString(),
        skills: _.map(techSkills, label => ({ label, selected: false })),
        durationConfirm: [{ label: 'Yes', value: false }, { label: 'No', value: false }],
        timezoneConfirm: [{ label: 'Yes', value: false }, { label: 'No', value: false }],
        timeAvailability: [
          { label: '10 hours', checked: false }, { label: '20 hours', checked: false }, { label: '30 hours', checked: false }, { label: '40 hours', checked: false },
        ],
        agreedTerms: false,
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
    const { user } = this.props;
    this.setState({
      formData: _.merge(formData, user),
    });
    this.validateForm();
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
    // run form validation
    this.validateForm();
  }

  onApplyClick() {
    const { applyForJob, job } = this.props;
    const { formData } = this.state;
    applyForJob(job.slug, formData);
  }

  validateForm() {
    this.setState((state) => {
      const { formData, formErrors } = state;
      // Form validation happens here
      const requiredTextFields = [
        'fname', 'lname', 'city', 'country', 'reffereal', 'phone', 'email',
      ];
      // check required text fields for value
      _.each(requiredTextFields, (key) => {
        if (!formData[key] || !_.trim(formData[key])) formErrors[key] = 'Required field';
        else if (formData[key] && _.trim(formData[key]).length < 2) formErrors[key] = 'Must be at least 2 characters';
        else delete formErrors[key];
      });
      // check payExpectation to be a number
      if (formData.payExpectation && _.trim(formData.payExpectation)) {
        if (!_.isInteger(_.toNumber(formData.payExpectation))) formErrors.payExpectation = 'Must be integer value in $';
        else delete formErrors.payExpectation;
      } else delete formErrors.payExpectation;
      // check for valid email
      if (formData.email && _.trim(formData.email)) {
        if (!(isValidEmail(formData.email))) formErrors.email = 'Invalid email';
        else delete formErrors.email;
      }
      // require atleast 1 skill
      if (!_.find(formData.skills, { selected: true })) formErrors.skills = 'Please, add technical skills';
      else delete formErrors.skills;
      // have accepted terms
      if (!formData.agreedTerms) formErrors.agreedTerms = 'Please, accept our terms';
      else delete formErrors.agreedTerms;
      // has CV file ready for upload
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
          delete formErrors.fileCV;
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
    return (
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
};

RecruitCRMJobApplyContainer.propTypes = {
  job: PT.shape().isRequired,
  user: PT.shape(),
  applyForJob: PT.func.isRequired,
  applying: PT.bool,
  application: PT.shape(),
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
  };
}

function mapDispatchToActions(dispatch) {
  const a = actions.recruit;
  return {
    applyForJob: (id, payload) => {
      dispatch(a.applyForJobInit(id, payload));
      dispatch(a.applyForJobDone(id, payload));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(RecruitCRMJobApplyContainer);
