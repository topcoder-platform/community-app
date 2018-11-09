/**
 * components.page.challenge-details.Develop
 * <Develop> Component
 *
 * Description:
 *   Page that is shown when a user is trying to submit a Development Submission.
 *   Allows user to upload Submission.zip file using a conventional
 *   file input form.
 */
/* eslint-env browser */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';

import FilePicker from '../FilePicker';
import Uploading from '../Uploading';
import './styles.scss';

/**
 * Submissions Page shown to develop challengers.
 */
class Develop extends React.Component {
  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retry = this.retry.bind(this);
    this.back = this.back.bind(this);
  }

  componentWillUnmount() {
    const { resetForm } = this.props;
    resetForm();
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
    this.formData = new FormData(document.getElementById('submit-form'));
    submitForm(this.formData);
  }

  /* User has clicked to go retry the submission after an error */
  retry() {
    const { submitForm } = this.props;
    submitForm(this.formData);
  }

  /* User has clicked to go back to a new submission after a successful submit */
  back() {
    const { resetForm } = this.props;
    resetForm();
  }

  render() {
    const {
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
      setFilePickerDragged,
    } = this.props;

    const id = '1';

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
                <div styleName="file-picker-container">
                  <FilePicker
                    mandatory
                    id={id}
                    title="SUBMISSION"
                    fileExtensions={['.zip']}
                    error={fpState.error}
                    // Bind the set functions to the FilePicker's ID
                    setError={_.partial(setFilePickerError, id)}
                    fileName={fpState.fileName}
                    setFileName={_.partial(setFilePickerFileName, id)}
                    dragged={fpState.dragged}
                    setDragged={_.partial(setFilePickerDragged, id)}
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

/**
 * Prop Validation
 */
Develop.propTypes = {
  challengeId: PT.number.isRequired,
  challengeName: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  isSubmitting: PT.bool.isRequired,
  submitDone: PT.bool.isRequired,
  errorMsg: PT.string.isRequired,
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
  setFilePickerDragged: PT.func.isRequired,
};

export default Develop;
