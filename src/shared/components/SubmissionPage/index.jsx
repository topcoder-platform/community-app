/**
 * components.page.challenge-details.submission Index Component
 *
 * Description:
 *   Top-level component for the Submit component.
 */
import React from 'react';
import PT from 'prop-types';
import Header from './Header';
import Submit from './Submit';
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
          status === 'ACTIVE'
          && <Submit {...props} />
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
  communitiesList: PT.func.isRequired,
  groups: PT.shape({}).isRequired,
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
  submissionFilestackData: filestackDataProp.isRequired,
};

export default SubmissionsPage;
