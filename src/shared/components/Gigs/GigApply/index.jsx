/**
 * The Gig apply page.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Link, config } from 'topcoder-react-utils';
import TextInput from 'components/GUIKit/TextInput';
import DropdownTerms from 'components/GUIKit/DropdownTerms';
import RadioButton from 'components/GUIKit/RadioButton';
import Checkbox from 'components/GUIKit/Checkbox';
import { getCustomField } from 'utils/gigs';
import Modal from 'components/Contentful/Modal';
import FilestackFilePicker from 'components/GUIKit/FilePicker';
import Dropdown from 'components/GUIKit/Dropdown';
import LoadingIndicator from 'components/LoadingIndicator';
import './style.scss';
import bigCheckmark from 'assets/images/big-checkmark.png';
import SadFace from 'assets/images/sad-face-icon.svg';
import BackArrowGig from 'assets/images/back-arrow-gig-apply.svg';

export default function GigApply(props) {
  const {
    job, onFormInputChange, formData, formErrors, onApplyClick, applying, application, user,
    recruitProfile,
  } = props;
  const retUrl = window.location.href;

  return user ? (
    <div styleName="container">
      {
        job.error || job.enable_job_application_form !== 1 ? (
          <div styleName="error">
            <h3>Gig does not exist.</h3>
            <div styleName="cta-buttons">
              <Link to={config.GIGS_PAGES_PATH}>VIEW OTHER GIGS</Link>
            </div>
          </div>
        ) : (
          <div styleName="wrap">
            <h2>{job.name}</h2>
            <Link to={`${config.GIGS_PAGES_PATH}/${job.slug}`} styleName="back-link"><BackArrowGig /> GIG DETAILS</Link>
            <div styleName="separator" />
            {
              application ? (
                <div styleName="apply-state">
                  { application.error ? <SadFace /> : <img src={bigCheckmark} alt="bigCheckmark OK" /> }
                  <h2>{application.error ? 'OOPS!' : 'APPLICATION SUBMITTED'}</h2>
                  {
                    application.error ? (
                      <React.Fragment>
                        <p styleName="error-text">{application.errorObj.message || JSON.stringify(application.errorObj)}</p>
                        <p>Looks like there is a problem on our end. Please try again.<br />If this persists please contact <a href="mailto:support@topcoder.com">support@topcoder.com</a>.</p>
                        <p>Please send us an email at <a href="mailto:gigwork@topcoder.com">gigwork@topcoder.com</a> with the subject ‘Gig Error’<br />and paste the URL for the gig you are attempting to apply for so that we know of your interest.</p>
                      </React.Fragment>
                    ) : (
                      <p>We will contact you via email if it seems like a fit!</p>
                    )
                  }
                  <div styleName="cta-buttons">
                    {
                      application.error ? (
                        <React.Fragment>
                          <a
                            href="#"
                            styleName="primaryBtn"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.reload();
                            }}
                          >APPLY AGAIN
                          </a>
                          <Link to={`${config.GIGS_PAGES_PATH}`}>VIEW OTHER GIGS</Link>
                        </React.Fragment>
                      ) : (
                        <Link to={`${config.GIGS_PAGES_PATH}`} styleName="primaryBtn">GO TO GIGS LIST</Link>
                      )
                    }
                  </div>
                </div>
              ) : null
            }
            {
              applying ? (
                <div styleName="loading-wrap">
                  <LoadingIndicator />
                  <p styleName="loading-text">Processing your application…</p>
                </div>
              ) : null
            }
            {
              !application && !applying ? (
                <div styleName="form-wrap">
                  {!_.isEmpty(recruitProfile)
                  && (
                  <p styleName="info-text">It looks like you have applied to a gig previously.
                    Perfect! We have most of your information.
                    Is there anything you would like to update to your Gig Work Profile?
                  </p>
                  )}
                  <h4>PERSONAL INFORMATION</h4>
                  {_.isEmpty(recruitProfile)
                  && <p>Welcome to Topcoder Gigs! We’d like to get to know you.</p>}
                  <div styleName="form-section">
                    <div styleName="form-row">
                      <TextInput
                        placeholder="First Name"
                        label="First Name"
                        onChange={val => onFormInputChange('fname', val)}
                        errorMsg={formErrors.fname}
                        value={formData.fname}
                        required
                        readonly
                      />
                      <TextInput
                        placeholder="Last Name"
                        label="Last Name"
                        onChange={val => onFormInputChange('lname', val)}
                        errorMsg={formErrors.lname}
                        value={formData.lname}
                        required
                        readonly
                      />
                    </div>
                    <div styleName="form-row">
                      <TextInput
                        placeholder="Email"
                        label="Email"
                        onChange={val => onFormInputChange('email', val)}
                        errorMsg={formErrors.email}
                        value={formData.email}
                        required
                        readonly
                      />
                      <TextInput
                        placeholder="Phone Including Country Code"
                        label="Phone"
                        onChange={val => onFormInputChange('phone', val)}
                        errorMsg={formErrors.phone}
                        value={formData.phone}
                        required
                      />
                    </div>
                    <div styleName="form-row">
                      <TextInput
                        placeholder="City"
                        label="City"
                        onChange={val => onFormInputChange('city', val)}
                        errorMsg={formErrors.city}
                        value={formData.city}
                        required
                      />
                      <Dropdown
                        placeholder="Country"
                        label="Country"
                        onChange={val => onFormInputChange('country', val)}
                        errorMsg={formErrors.country}
                        options={formData.country}
                        required
                      />
                    </div>
                  </div>
                  {_.isEmpty(recruitProfile) && <h4>TOPCODER INFORMATION</h4>}
                  {_.isEmpty(recruitProfile) && (
                  <div styleName="form-section">
                    <div styleName="form-row">
                      <TextInput
                        placeholder="Topcoder Username"
                        label="Topcoder Username"
                        onChange={val => onFormInputChange('handle', val)}
                        errorMsg={formErrors.handle}
                        value={formData.handle}
                        readonly
                      />
                      <TextInput
                        placeholder="Topcoder Profile (topcoder.com/members/[username])"
                        label="Topcoder Profile"
                        onChange={val => onFormInputChange('tcProfileLink', val)}
                        errorMsg={formErrors.tcProfileLink}
                        value={formData.handle ? `https://topcoder.com/members/${formData.handle}` : null}
                        readonly
                      />
                    </div>
                  </div>
                  )}
                  <h4>SHARE YOUR WEEKLY PAY EXPECTATIONS</h4>
                  <div styleName="form-section">
                    <div styleName="form-row">
                      <TextInput
                        placeholder="Weekly Pay Expectation in $ (eg. 500)"
                        label="Weekly Pay Expectation"
                        onChange={val => onFormInputChange('payExpectation', val)}
                        errorMsg={formErrors.payExpectation}
                        value={formData.payExpectation}
                        required
                      />
                    </div>
                  </div>
                  <h4>RESUME & SKILLS</h4>
                  {
                    recruitProfile.resume ? (
                      <p>Upload Your Resume or CV, <a href={recruitProfile.resume.file_link} target="_blank" rel="noreferrer">{recruitProfile.resume.filename}</a></p>
                    ) : (
                      <p>Upload Your Resume or CV</p>
                    )
                  }
                  <div styleName="form-section">
                    <FilestackFilePicker
                      file={formData.fileCV}
                      onFilePick={files => onFormInputChange('fileCV', files[0])}
                      inputOptions={{
                        accept: '.pdf,.docx',
                      }}
                      infoText="Drag & drop your resume or CV here - please omit contact information *"
                      errorMsg={formErrors.fileCV}
                    />
                    <div styleName="input-bot-margin" />
                    <DropdownTerms
                      terms={formData.skills}
                      label="Tech Skills"
                      placeholder="Tech Skills"
                      onChange={val => onFormInputChange('skills', val)}
                      errorMsg={formErrors.skills}
                      addNewOptionPlaceholder="Type to add another skill..."
                      required
                    />
                  </div>
                  <h4>FINAL QUESTIONS</h4>
                  <div styleName="form-section">
                    {_.isEmpty(recruitProfile) && (
                    <Dropdown
                      placeholder="How did you find out about Topcoder Gig Work?"
                      label="How did you find out about Topcoder Gig Work?"
                      onChange={val => onFormInputChange('reffereal', val)}
                      errorMsg={formErrors.reffereal}
                      options={formData.reffereal}
                      required
                    />
                    )}
                    <div styleName="input-bot-margin" />
                    <p>Are you able to work during the specified timezone? (<strong>{`${getCustomField(job.custom_fields, 'Timezone')}`}</strong>) *</p>
                    <RadioButton
                      onChange={val => onFormInputChange('timezoneConfirm', val)}
                      errorMsg={formErrors.timezoneConfirm}
                      options={formData.timezoneConfirm}
                      size="lg"
                    />
                    <div styleName="last-input">
                      <p>Are you ok to work with the duration of the gig? (<strong>{`${getCustomField(job.custom_fields, 'Duration')}`}</strong>) *</p>
                      <RadioButton
                        onChange={val => onFormInputChange('durationConfirm', val)}
                        errorMsg={formErrors.durationConfirm}
                        options={formData.durationConfirm}
                        size="lg"
                      />
                    </div>
                  </div>
                  <div styleName="separator" />
                  <div styleName="bottom-section">
                    <div styleName="checkboxes-row">
                      <div styleName="checkbox">
                        <Checkbox
                          onChange={val => onFormInputChange('agreedTerms', val)}
                          checked={formData.agreedTerms}
                          errorMsg={formErrors.agreedTerms}
                          size="lg"
                        />
                        <span styleName="label">I agree to <Modal id="2gkc8LtNkZw6p0AExwSIcA"><span styleName="moldal-link">Candidate Terms</span></Modal> *</span>
                      </div>
                    </div>
                    <span>View Our Equal <Modal id="VAeo0vZ5tQFjPZlIcdt0m"><span styleName="moldal-link">Employment Opportunity Policy</span></Modal></span>
                  </div>
                  <button type="button" styleName="primaryBtn" onClick={onApplyClick} disabled={!_.isEmpty(formErrors) || applying}>
                    APPLY TO THIS JOB
                  </button>
                </div>
              ) : null
          }
          </div>
        )
      }
    </div>
  ) : (
    <div styleName="container">
      <div styleName="wrap">
        <div styleName="error">
          <h3>You must be a Topcoder member to apply!</h3>
          <div styleName="cta-buttons">
            <Link to={`${config.URL.AUTH}/member?retUrl=${encodeURIComponent(retUrl)}`} styleName="primaryBtn">Login</Link>
          </div>
          <p styleName="regTxt">Not a member? Register <a href={`${config.URL.AUTH}/member/registration?retUrl=${encodeURIComponent(retUrl)}&mode=signUp&utm_source=gig_listing`}>here</a>.</p>
        </div>
      </div>
    </div>
  );
}

GigApply.defaultProps = {
  formErrors: {},
  applying: false,
  application: null,
  user: null,
};

GigApply.propTypes = {
  job: PT.shape().isRequired,
  formErrors: PT.shape(),
  formData: PT.shape().isRequired,
  onFormInputChange: PT.func.isRequired,
  onApplyClick: PT.func.isRequired,
  applying: PT.bool,
  application: PT.shape(),
  user: PT.shape(),
  recruitProfile: PT.shape().isRequired,
};
