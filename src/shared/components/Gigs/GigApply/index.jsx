/* eslint-disable max-len */
/**
 * The Gig apply page.
 */

import _ from 'lodash';
import React, { useMemo } from 'react';
import PT from 'prop-types';
import { Link, config } from 'topcoder-react-utils';
import TextInput from 'components/GUIKit/TextInput';
import DropdownSkills from 'components/GUIKit/DropdownSkills';
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
import CheckmarkGreen from 'assets/images/checkmark-green.svg';
import { getService } from 'services/skills';

export default function GigApply(props) {
  const {
    job,
    onFormInputChange,
    formData,
    formErrors,
    onApplyClick,
    applying,
    application,
    user,
    recruitProfile,
    auth,
  } = props;
  const retUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}`);
  const duration = getCustomField(job.custom_fields, 'Duration');
  const isPlaced = _.find(_.isEmpty(recruitProfile) ? [] : recruitProfile.custom_fields, { field_id: 12 });
  const fetchSkills = useMemo(() => _.debounce((inputValue, callback) => {
    if (!inputValue) {
      callback(null);
    } else {
      getService(auth.tokenV3).getSkills(inputValue).then(
        (response) => {
          const skills = response || [];
          const suggestedOptions = skills.map(skillItem => ({
            label: skillItem.name,
            value: skillItem.name,
          }));
          return callback(null, {
            options: suggestedOptions,
          });
        },
      ).catch(() => callback(null));
    }
  }, 150), [auth.tokenV3]);

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
              isPlaced && isPlaced.value === 'Placed' ? (
                <div styleName="apply-state">
                  <SadFace />
                  <h2>One Gig Limit!</h2>
                  <React.Fragment>
                    <p>Apologies, you are not allowed to apply to gigs if you are already placed on a gig.<br /><br />You can however refer a friend to this gig and receive $500 if they get placed in that gig. To do that, you can enter their email on the right side of the Gigs Description page.<br /><br />If you have any questions or feel this is an error, please email <a href="mailto:talent.topcoder@wipro.com">talent.topcoder@wipro.com</a>.</p>
                  </React.Fragment>
                  <div styleName="cta-buttons">
                    <Link to={`${config.GIGS_PAGES_PATH}/${job.slug}`} styleName="primaryBtn">Back To Gig</Link>
                  </div>
                </div>
              ) : null
            }
            {
              application ? (
                <div styleName="apply-state">
                  { application.error ? <SadFace /> : <img src={bigCheckmark} alt="bigCheckmark OK" />}
                  <h2>{application.error ? 'OOPS!' : 'APPLICATION SUBMITTED'}</h2>
                  {
                    application.error ? (
                      <React.Fragment>
                        {
                          application.errorObj ? (
                            <p styleName="error-text">{application.errorObj.message || JSON.stringify(application.errorObj)}</p>
                          ) : null
                        }
                        {
                          application.errorObj && application.errorObj.notAllowed ? (
                            <p>If you have any questions or feel this is an error, please email <a href="mailto:talent.topcoder@wipro.com">talent.topcoder@wipro.com</a>.</p>
                          ) : (
                            <React.Fragment>
                              <p>Looks like there is a problem on our end. Please try again.<br />If this persists please contact <a href="mailto:support@topcoder.com">support@topcoder.com</a>.</p>
                              <p>Please send us an email at <a href="mailto:talent.topcoder@wipro.com">talent.topcoder@wipro.com</a> with the subject ‘Gig Error’<br />and paste the URL for the gig you are attempting to apply for so that we know of your interest.</p>
                            </React.Fragment>
                          )
                        }
                      </React.Fragment>
                    ) : (
                      <p>We will contact you via email if it seems like a fit!</p>
                    )
                  }
                  <div styleName="cta-buttons">
                    {
                      application.error ? (
                        <React.Fragment>
                          {
                            !application.errorObj.notAllowed ? (
                              <a
                                href="#"
                                styleName="primaryBtn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.location.reload();
                                }}
                              >APPLY AGAIN
                              </a>
                            ) : null
                          }
                          <Link to={`${config.GIGS_PAGES_PATH}`}>VIEW OTHER GIGS</Link>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <a href={`${config.GIGS_PAGES_PATH}`} styleName="gig-list-btn">GO TO GIGS LIST</a>
                          <a href={`${config.PLATFORM_SITE_URL}/earn/my-gigs?externalId=${job.slug}`} styleName="primaryBtn">CHECK GIG APPLICATION STATUS</a>
                        </React.Fragment>
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
              !application && !applying && (!isPlaced || isPlaced.value !== 'Placed') ? (
                <div styleName="form-wrap">
                  {!_.isEmpty(recruitProfile)
                    && (
                      <div styleName="info-text">
                        <h6>It looks like you have applied to a gig previously. Perfect!<CheckmarkGreen /></h6>
                        <p>We have most of your information. Is there anything you would like to update to your Gig Work Profile?</p>
                      </div>
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
                      <p>Please upload your resume/CV. Double-check that all of your tech skills are listed in your resume/CV and add them to the tech skills section below, <a href={recruitProfile.resume.file_link} target="_blank" rel="noreferrer">{recruitProfile.resume.filename}</a></p>
                    ) : (
                      <p>Please upload your resume/CV. Double-check that all of your tech skills are listed in your resume/CV and add them to the tech skills section below.</p>
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
                    <DropdownSkills
                      terms={formData.skills}
                      label="Tech Skills"
                      placeholder="Type to search"
                      onChange={val => onFormInputChange('skills', val)}
                      errorMsg={formErrors.skills}
                      addNewOptionPlaceholder="Type to add another skill..."
                      required
                      cacheOptions
                      loadOptions={fetchSkills}
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
                      <p>Are you ok to work with the duration of the gig? (<strong>{/^\d+$/.test(duration) ? `${duration} Weeks` : duration}</strong>) *</p>
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
            <Link to={`${config.URL.AUTH}/member?retUrl=${retUrl}`} styleName="primaryBtn">Login</Link>
          </div>
          <p styleName="regTxt">Not a member? Register <a href={`${config.URL.AUTH}/?retUrl=${retUrl}&mode=signUp&utm_source=gig_listing&regSource=gigs`}>here</a>.</p>
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
  auth: {},
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
  auth: PT.object,
};
