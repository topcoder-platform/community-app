/**
 * components.page.challenge-details.submission Index Component
 *
 * Description:
 *   Top-level component for the Submit component.
 */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
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
    currentPhases,
    winners,
    handle,
  } = props;

  const submissionEnded = status === 'COMPLETED'
    || (!_.some(currentPhases, { phaseType: 'Submission', phaseStatus: 'Open' })
    && !_.some(currentPhases, { phaseType: 'Checkpoint Submission', phaseStatus: 'Open' }));

  const hasFirstPlacement = !_.isEmpty(winners) && _.some(winners, { placement: 1, handle });

  let canSubmitFinalFixes = false;
  if (hasFirstPlacement && !_.isEmpty(currentPhases)) {
    canSubmitFinalFixes = _.some(currentPhases, { phaseType: 'Final Fix', phaseStatus: 'Open' });
  }

  const submissionPermitted = !submissionEnded || canSubmitFinalFixes;

  return (
    <div styleName="container">
      <div styleName="content">
        <Header
          challengeId={challengeId}
          challengesUrl={challengesUrl}
          title={challengeName}
        />
        {
          submissionPermitted
            ? <Submit {...props} />
            : (
              <div styleName="not-permitted">
                <h2>Submissions are not permitted at this time.</h2>
              </div>
            )
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
  communitiesList: PT.shape({
    data: PT.arrayOf(PT.shape({
      challengeFilter: PT.shape(),
      communityId: PT.string.isRequired,
    })).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
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
  winners: PT.arrayOf(PT.object).isRequired,
  handle: PT.string.isRequired,
  currentPhases: PT.arrayOf(PT.object).isRequired,
};

export default SubmissionsPage;
