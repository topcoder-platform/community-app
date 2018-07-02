/**
 * components.page.challenge-details.submission Index Component
 *
 * Description:
 *   Top-level component for the Develop or Design submission components.
 *   Primary purpose is to choose between the above components based on project type
 *   and pass properties from Redux store to the component.
 */
import React from 'react';
import PT from 'prop-types';
import Header from './Header';
import Design from './Design';
import Develop from './Develop';
import './styles.scss';

/**
 * SubmissionsPage Component
 */
function SubmissionsPage(props) {
  const {
    challengeId,
    challengeName,
    challengesUrl,
    status,
    track,
  } = props;
  return (
    <div styleName="container">
      <div styleName="content">
        <Header
          challengeId={challengeId}
          challengesUrl={challengesUrl}
          title={challengeName}
        />
        {
          track === 'DEVELOP'
          && status === 'ACTIVE'
          && <Develop {...props} />
        }
        {
          track === 'DESIGN'
          && status === 'ACTIVE'
          && <Design {...props} />
        }
      </div>
    </div>
  );
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
SubmissionsPage.propTypes = {
  userId: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  challengeId: PT.number.isRequired,
  challengeName: PT.string.isRequired,
  track: PT.string.isRequired,
  status: PT.string.isRequired,
  submitForm: PT.func.isRequired,
  resetForm: PT.func.isRequired,
  errorMsg: PT.string.isRequired,
  isSubmitting: PT.bool.isRequired,
  submitDone: PT.bool.isRequired,
  setAgreed: PT.func.isRequired,
  uploadProgress: PT.number.isRequired,
  agreed: PT.bool.isRequired,
  filePickers: PT.arrayOf(PT.shape({
    id: PT.string.isRequired,
    error: PT.string.isRequired,
    fileName: PT.string.isRequired,
  }).isRequired).isRequired,
  setFilePickerError: PT.func.isRequired,
  setFilePickerFileName: PT.func.isRequired,
  setFilePickerDragged: PT.func.isRequired,
  setSubmissionFilestackData: PT.func.isRequired,
  setSourceFilestackData: PT.func.isRequired,
  setPreviewFilestackData: PT.func.isRequired,
  submissionFilestackData: filestackDataProp.isRequired,
  sourceFilestackData: filestackDataProp.isRequired,
  previewFilestackData: filestackDataProp.isRequired,
};

export default SubmissionsPage;
