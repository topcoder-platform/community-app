/**
 * components.page.challenge-details.Submit
 * <Submit> Component
 *
 * Description:
 *   Page that is shown when a user is trying to submit a Submission.
 *   Allows user to upload Submission.zip file using a Filestack plugin.
 */
/* eslint-env browser */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';

import FilestackFilePicker from '../FilestackFilePicker';

import Uploading from '../Uploading';
import './styles.scss';

/**
 * Submissions Page shown to develop challengers.
 */
class Submit extends React.Component {
  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retry = this.retry.bind(this);
    this.back = this.back.bind(this);
    this.getFormData = this.getFormData.bind(this);
  }

  componentWillUnmount() {
    const { resetForm } = this.props;
    resetForm();
  }

  getFormData() {
    const {
      submissionFilestackData: sub,
      challengeId,
      userId,
    } = this.props;

    const formData = new FormData();
    formData.append('url', sub.fileUrl);
    formData.append('type', this.getSubType());
    formData.append('memberId', userId);
    formData.append('challengeId', challengeId);
    return formData;
  }

  getSubType() {
    const {
      currentPhases,
    } = this.props;
    const checkpoint = _.find(currentPhases, {
      phaseType: 'Checkpoint Submission',
    });
    const submission = _.find(currentPhases, {
      phaseType: 'Submission',
    });
    const finalFix = _.find(currentPhases, {
      phaseType: 'Final Fix',
    });
    let subType;

    // Submission type logic
    if (checkpoint && checkpoint.phaseStatus === 'Open') {
      subType = 'Checkpoint Submission';
    } else if (checkpoint && checkpoint.phaseStatus === 'Close' && submission && submission.phaseStatus === 'Open') {
      subType = 'Contest Submission';
    } else if (finalFix && finalFix.phaseStatus === 'Open') {
      subType = 'Studio Final Fix Submission';
    } else {
      subType = 'Contest Submission';
    }

    return subType;
  }

  reset() {
    const { resetForm, setAgreed } = this.props;
    setAgreed(false);
    resetForm();
  }

  /* User has clicked submit, prepare formData for the V2 API and start upload */
  handleSubmit(e) {
    const { submitForm } = this.props;
    e.preventDefault();
    submitForm(this.getFormData());
  }

  /* User has clicked to go retry the submission after an error */
  retry() {
    const { submitForm } = this.props;
    submitForm(this.getFormData());
  }

  /* User has clicked to go back to a new submission after a successful submit */
  back() {
    const { resetForm } = this.props;
    resetForm();
  }

  render() {
    const {
      userId,
      challengeId,
      challengeName,
      challengesUrl,
      errorMsg,
      isSubmitting,
      submitDone,
      track,
      uploadProgress,
      agreed,
      setAgreed,
      filePickers,
      setFilePickerError,
      setFilePickerFileName,
      setFilePickerUploadProgress,
      setFilePickerDragged,
      setSubmissionFilestackData,
      submitForm,
    } = this.props;

    const id = 'file-picker-submission';

    // Find the state for FilePicker with id of 1 or assign default values
    const fpState = filePickers.find(fp => fp.id === id) || ({
      id,
      error: '',
      fileName: '',
      dragged: false,
    });

    return (
      (!isSubmitting && !submitDone && !errorMsg) ? (
        <div styleName="design-content">
          <form
            method="POST"
            name="submitForm"
            encType="multipart/form-data"
            id="submit-form"
            onSubmit={this.handleSubmit}
          >
            <div styleName="row">
              <div styleName="left">
                <h4>
FILES
                </h4>
                <p>
Please follow the instructions on the Challenge Details page regarding
                  what your submission should contain and how it should be organized.
                </p>
              </div>
              <div styleName="right">
                <div styleName="submission-hints">
                  { track === 'DEVELOP' ? (
                    <div>
                      <p>Upload your entire submission as a single zip file.</p>
                    </div>
                  ) : null }
                  { track === 'DESIGN' ? (
                    <div>
                      <ol>
                        <li>Place your submission files into a &quot;Submission.zip&quot; file.</li>
                        <li>Place all of your source files into a &quot;Source.zip&quot; file.</li>
                        <li>Create a JPG preview file.</li>
                        <li>
                          Zip the 3 files from the previous steps
                           into a single zip file and upload below.
                        </li>
                      </ol>
                      <p>For detailed information on packaging your submission, please visit the
                      &zwnj;
                        {
                          <a
                            href="https://help.topcoder.com/hc/en-us/articles/
                              219122667-Formatting-Your-Submission-for-Design-Challenges"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            help center.
                          </a>
                        }
                      </p>
                    </div>
                  ) : null }
                </div>
                <div styleName="file-picker-container">
                  <FilestackFilePicker
                    mandatory
                    title="Submission Upload"
                    fileExtensions={['.zip']}
                    id={id}
                    challengeId={challengeId}
                    error={fpState.error}
                    // Bind the set functions to the FilePicker's ID
                    setError={_.partial(setFilePickerError, id)}
                    fileName={fpState.fileName}
                    uploadProgress={fpState.uploadProgress}
                    setFileName={_.partial(setFilePickerFileName, id)}
                    setUploadProgress={_.partial(setFilePickerUploadProgress, id)}
                    dragged={fpState.dragged}
                    setDragged={_.partial(setFilePickerDragged, id)}
                    setFilestackData={setSubmissionFilestackData}
                    userId={userId}
                    submitForm={submitForm}
                  />
                </div>
                <p>
                  If you are having trouble uploading your file, please send
                  your submission to
                  &zwnj;
                  {
                    <a
                      href="mailto://support@topcoder.com"
                    >
                      support@topcoder.com
                    </a>
                  }
                </p>
              </div>
            </div>
            <div styleName="row agree">
              <p>
                Submitting your files means you hereby agree to the
                &zwnj;
                {
                  <a
                    href={config.URL.INFO.TOPCODER_TERMS}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Topcoder terms of use
                  </a>
                }
&zwnj;
                and to the extent your uploaded file wins a topcoder Competition,
                you hereby assign, grant and transfer and agree to assign, grant and
                transfer to topcoder all right and title in and to the Winning Submission
                (as further described in the terms of use).
              </p>
              <div styleName="tc-checkbox">
                <input
                  type="checkbox"
                  id="agree"
                  onChange={e => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree">
                  <div styleName="tc-checkbox-label">
I UNDERSTAND AND AGREE
                  </div>
                </label>
              </div>
              <PrimaryButton
                type="submit"
                disabled={!agreed || !!fpState.error || !fpState.fileName}
              >
                Submit
              </PrimaryButton>
            </div>
          </form>
        </div>
      )
        : (
          <Uploading
            challengeId={challengeId}
            challengeName={challengeName}
            challengesUrl={challengesUrl}
            error={errorMsg}
            isSubmitting={isSubmitting}
            submitDone={submitDone}
            reset={this.reset}
            retry={this.retry}
            track={track}
            uploadProgress={uploadProgress}
            back={this.back}
          />
        )
    );
  }
}

Submit.defaultProps = {
  errorMsg: '',
};

/* Reusable prop validation for Filestack data objects */
const filestackDataProp = PT.shape({
  filename: PT.string.isRequired,
  mimetype: PT.string.isRequired,
  size: PT.number.isRequired,
  key: PT.string.isRequired,
  container: PT.string.isRequired,
  challengeId: PT.number.isRequired,
  fileUrl: PT.string.isRequired,
});

/**
 * Prop Validation
 */
Submit.propTypes = {
  currentPhases: PT.arrayOf(PT.object).isRequired,
  userId: PT.string.isRequired,
  challengeId: PT.number.isRequired,
  challengeName: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  isSubmitting: PT.bool.isRequired,
  submitDone: PT.bool.isRequired,
  errorMsg: PT.string,
  submitForm: PT.func.isRequired,
  resetForm: PT.func.isRequired,
  track: PT.string.isRequired,
  uploadProgress: PT.number.isRequired,
  setAgreed: PT.func.isRequired,
  agreed: PT.bool.isRequired,
  filePickers: PT.arrayOf(PT.shape({
    id: PT.string.isRequired,
    error: PT.string.isRequired,
    fileName: PT.string.isRequired,
  }).isRequired).isRequired,
  setFilePickerError: PT.func.isRequired,
  setFilePickerFileName: PT.func.isRequired,
  setFilePickerUploadProgress: PT.func.isRequired,
  setFilePickerDragged: PT.func.isRequired,
  setSubmissionFilestackData: PT.func.isRequired,
  submissionFilestackData: filestackDataProp.isRequired,
};

export default Submit;
