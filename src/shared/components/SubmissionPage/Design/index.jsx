/**
 * components.SubmissionPage.Design
 * <Design> Component
 *
 * Description:
 *   Page that is shown when a user is trying to submit a Design Submission.
 *   Allows user to upload Submission and Source Zip files plus an Image Preview
 *   via the Filestack V2 API.
 */
/* eslint-env browser */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import { errors } from 'topcoder-react-lib';
import { CHALLENGE_PHASE_TYPES as PHASE_TYPES } from 'utils/tc';

import FilestackFilePicker from '../FilestackFilePicker';
import CustomFontInput from './CustomFontInput';
import StockArtInput from './StockArtInput';
import Uploading from '../Uploading';
import './styles.scss';

const { fireErrorMessage } = errors;

/* The maximum number of symbols allowed in the Notes textarea. */
const MAX_NOTES_LENGTH = 500;

/**
 * Submissions Page shown to design challengers.
 */
class Design extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
    this.retry = this.retry.bind(this);
    this.back = this.back.bind(this);
  }

  componentWillUnmount() {
    const { resetForm } = this.props;
    resetForm();
  }

  reset() {
    const {
      resetForm,
      setAgreed,
      updateNotesLength,
    } = this.props;
    setAgreed(false);
    updateNotesLength(0);
    resetForm();
  }

  /* User has clicked to go retry the submission after an error */
  retry() {
    const {
      submitForm,
    } = this.props;
    submitForm(this.formData);
  }

  /* User has clicked to go back to a new submission after a successful submit */
  back() {
    const {
      resetForm,
    } = this.props;
    resetForm();
  }

  /**
   * Call for Submit button.  Constructs a V3 API JSON object for the submission based
   * on form data and redux state.
   */
  handleSubmit(e) {
    e.preventDefault();

    const {
      currentPhases,
      userId,
      challengeId,
      stockArtRecords,
      customFontRecords,
      previewFilestackData,
      sourceFilestackData,
      submissionFilestackData,
      submitForm,
    } = this.props;

    const fonts = customFontRecords.map(
      ({ source, name, url }) => ({ source, name, sourceUrl: url }),
    );

    const stockArts = stockArtRecords.map(x => ({
      sourceUrl: x.url,
    }));

    const formData = new FormData(document.getElementById('submit-form'));

    const sub = submissionFilestackData;
    const source = sourceFilestackData;
    const preview = previewFilestackData;

    const phases = {};
    currentPhases.forEach((p) => { phases[p.phaseType] = p; });
    const phase = phases[PHASE_TYPES.CHECKPOINT_SUBMISSION]
      || phases[PHASE_TYPES.SUBMISSION];
    if (!phase) fireErrorMessage('ERROR: Failed to Submit!');

    const body = {
      param: {
        reference: {
          id: challengeId.toString(), // Back-end expects this as string
          phaseId: phase.id,
          phaseType: phase.phaseType.toUpperCase().replace(/ /g, '_'),
          type: 'CHALLENGE',
        },
        userId: parseInt(userId, 10),
        data: {
          method: 'DESIGN_CHALLENGE_FILE_PICKER_ZIP_FILE',
          files: [
            {
              name: sub.filename,
              type: 'SUBMISSION_ZIP',
              status: 'STAGED',
              stagedFileContainer: sub.container,
              stagedFilePath: sub.key,
              size: sub.size,
              mediaType: sub.mimetype,
            },
            {
              name: source.filename,
              type: 'SOURCE_ZIP',
              status: 'STAGED',
              stagedFileContainer: source.container,
              stagedFilePath: source.key,
              size: source.size,
              mediaType: source.mimetype,
            },
            {
              name: preview.filename,
              type: 'DESIGN_COVER',
              status: 'STAGED',
              stagedFileContainer: preview.container,
              stagedFilePath: preview.key,
              size: preview.size,
              mediaType: preview.mimetype,
            },
          ],
          submitterComments: formData.get('comment'),
          submitterRank: formData.get('rank') || 1,
          fonts,
          stockArts,
        },
      },
    };

    submitForm(JSON.stringify(body));
  }

  render() {
    const {
      challengeId,
      challengeName,
      challengesUrl,
      setStockArtRecord,
      stockArtRecords,
      setCustomFontRecord,
      customFontRecords,
      userId,

      isSubmitting,
      submitDone,
      errorMsg,
      track,
      uploadProgress,
      agreed,
      setAgreed,
      filePickers,
      setFilePickerError,
      setFilePickerFileName,
      setFilePickerUploadProgress,
      setFilePickerDragged,
      notesLength,
      updateNotesLength,
      setSubmissionFilestackData,
      setSourceFilestackData,
      setPreviewFilestackData,
    } = this.props;

    // Find the state for the FilePickers
    const fpLookup = id => (filePickers.find(fp => fp.id === id) || ({
      id,
      error: '',
      fileName: '',
      dragged: false,
    }));

    const fpSubmission = fpLookup('file-picker-submission');
    const fpSource = fpLookup('file-picker-source');
    const fpPreview = fpLookup('file-picker-preview');

    return (!isSubmitting && !submitDone && !errorMsg) ? (
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
                Please follow the instructions on the Challenge Details page
                regarding what your submission, source and preview files should
                contain.
              </p>
              <p>
                Do not name any of your files &quot;declaration.txt&quot;
                as this is added by our system.
              </p>
              <p>
                Please be sure to double-check that you have submitted the
                correct files and that your JPG files (if applicable) are in
                RGB color mode.
              </p>
              <p>
                <a
                  href={config.URL.INFO.DESIGN_CHALLENGE_SUBMISSION}
                  target="_blank"
                  rel="noopener noreferrer"
                >
Learn more about formatting your submission file.
                </a>
              </p>
            </div>
            <div styleName="right">
              <div styleName="file-picker-container">
                <FilestackFilePicker
                  mandatory
                  title="SUBMISSION"
                  fileExtensions={['.zip']}
                  id="file-picker-submission"
                  error={fpSubmission.error}
                  // Bind the set functions to the FilePicker's ID
                  setError={_.partial(setFilePickerError, 'file-picker-submission')}
                  fileName={fpSubmission.fileName}
                  uploadProgress={fpSubmission.uploadProgress}
                  setFileName={_.partial(setFilePickerFileName, 'file-picker-submission')}
                  setUploadProgress={_.partial(setFilePickerUploadProgress, 'file-picker-submission')}
                  dragged={fpSubmission.dragged}
                  setDragged={_.partial(setFilePickerDragged, 'file-picker-submission')}
                  setFilestackData={setSubmissionFilestackData}
                  userId={userId}
                />
                <FilestackFilePicker
                  mandatory
                  title="SOURCE"
                  fileExtensions={['.zip']}
                  id="file-picker-source"
                  error={fpSource.error}
                  setError={_.partial(setFilePickerError, 'file-picker-source')}
                  fileName={fpSource.fileName}
                  uploadProgress={fpSource.uploadProgress}
                  setFileName={_.partial(setFilePickerFileName, 'file-picker-source')}
                  setUploadProgress={_.partial(setFilePickerUploadProgress, 'file-picker-source')}
                  dragged={fpSource.dragged}
                  setDragged={_.partial(setFilePickerDragged, 'file-picker-source')}
                  setFilestackData={setSourceFilestackData}
                  userId={userId}
                />
                <FilestackFilePicker
                  mandatory
                  title="PREVIEW"
                  fileExtensions={['.jpg', '.png']}
                  id="file-picker-preview"
                  error={fpPreview.error}
                  setError={_.partial(setFilePickerError, 'file-picker-preview')}
                  fileName={fpPreview.fileName}
                  uploadProgress={fpPreview.uploadProgress}
                  setFileName={_.partial(setFilePickerFileName, 'file-picker-preview')}
                  setUploadProgress={_.partial(setFilePickerUploadProgress, 'file-picker-preview')}
                  dragged={fpPreview.dragged}
                  setDragged={_.partial(setFilePickerDragged, 'file-picker-preview')}
                  setFilestackData={setPreviewFilestackData}
                  userId={userId}
                />
              </div>
              <span styleName="desc">
                SUBMISSION#
              </span>
              <input styleName="submission-desc" placeholder="1" name="rank" />
            </div>
          </div>
          <div styleName="row">
            <div styleName="left">
              <h4>
NOTES
              </h4>
              <p>
Type a short note about your design here. Explain revisions or
                other design elements that may not be clear.
              </p>
            </div>
            <div styleName="right">
              <div styleName="desc-container">
                <span styleName="desc">
                  COMMENTS
                </span>
                <span>
                  { notesLength }
                  {' '}
/
                  { MAX_NOTES_LENGTH }
                </span>
              </div>
              <textarea
                onChange={(event) => {
                  const { target } = event;
                  if (target.value.length > MAX_NOTES_LENGTH) {
                    target.value = target.value.slice(0, MAX_NOTES_LENGTH);
                  }
                  updateNotesLength(target.value.length);
                }}
                styleName="big-input"
                placeholder="Example: My design tries to solve the problem with a particular idea in mind. The use of color is based on the provided brand guideline. The flows are included in the sub folder. I followed all revisions as per the directions provided."
                name="comment"
              />
            </div>
          </div>
          <CustomFontInput
            customFontRecords={customFontRecords}
            setCustomFontRecord={setCustomFontRecord}
          />
          <StockArtInput
            setStockArtRecord={setStockArtRecord}
            stockArtRecords={stockArtRecords}
          />
          <div styleName="row agree">
            <p>
              Submitting your files means you hereby agree to the
              &zwnj;
              {
                <a
                  href={config.URL.INFO.TOPCODER_TERMS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
Topcoder terms of use
                </a>
              }
&zwnj;
                and to the extent your uploaded file wins a topcoder Competition,
              you hereby assign, grant and transfer and agree to assign, grant and
              transfer to topcoder all right and challengeName in and to the Winning Submission
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
              disabled={
                !agreed
                || !!fpPreview.error || !fpPreview.fileName
                || !!fpSource.error || !fpSource.fileName
                || !!fpSubmission.error || !fpSubmission.fileName
                || customFontRecords.some(x => !_.isEmpty(x.errors))
                || stockArtRecords.some(x => !_.isEmpty(x.errors))
              }
              type="submit"
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
          isSubmitting={isSubmitting}
          submitDone={submitDone}
          reset={this.reset}
          track={track}
          error={errorMsg}
          retry={this.retry}
          back={this.back}
          uploadProgress={uploadProgress}
        />
      );
  }
}

/* Reusable prop validation for Filestack data objects */
const filestackDataProp = PT.shape({
  filename: PT.string.isRequired,
  mimetype: PT.string.isRequired,
  size: PT.number.isRequired,
  key: PT.string.isRequired,
  container: PT.string.isRequired,
});

/**
 * Prop Validation
 */
Design.propTypes = {
  currentPhases: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    phaseType: PT.string.isRequired,
  })).isRequired,
  stockArtRecords: PT.arrayOf(PT.object).isRequired,
  setStockArtRecord: PT.func.isRequired,
  customFontRecords: PT.arrayOf(PT.object).isRequired,
  setCustomFontRecord: PT.func.isRequired,

  /* Older stuff */
  userId: PT.string.isRequired,
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
    uploadProgress: PT.number,
  }).isRequired).isRequired,
  setFilePickerError: PT.func.isRequired,
  setFilePickerFileName: PT.func.isRequired,
  setFilePickerUploadProgress: PT.func.isRequired,
  setFilePickerDragged: PT.func.isRequired,
  notesLength: PT.number.isRequired,
  updateNotesLength: PT.func.isRequired,
  setSubmissionFilestackData: PT.func.isRequired,
  setSourceFilestackData: PT.func.isRequired,
  setPreviewFilestackData: PT.func.isRequired,
  submissionFilestackData: filestackDataProp.isRequired,
  sourceFilestackData: filestackDataProp.isRequired,
  previewFilestackData: filestackDataProp.isRequired,
};

export default Design;
