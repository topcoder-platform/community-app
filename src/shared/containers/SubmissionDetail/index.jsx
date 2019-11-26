/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'topcoder-react-lib';
import DownloadIcon from '../../components/SubmissionManagement/Icons/IconSquareDownload.svg';
import './styles.scss';
import smpActions from '../../actions/page/submission_management';

// The container component
class SubmissionDetailPageContainer extends React.Component {
  componentDidMount() {
    const {
      authTokens,
      challengeId,
      loadMySubmissions,
    } = this.props;
    loadMySubmissions(authTokens.tokenV2, challengeId);
  }

  renderSummary = (submission) => {
    const { submissionId } = submission;
    return (
      <div styleName="row">
        <div styleName="col summary">
          {JSON.stringify(submission)}
        </div>
        <div styleName="col">
          API Not supported now
        </div>
        <div styleName="col">
          <a href={`https://software.topcoder.com/review/actions/DownloadContestSubmission.do?method=downloadContestSubmission&uid=${submissionId}`}>
            Submission Details: {submissionId} <DownloadIcon />
          </a>
        </div>
      </div>
    );
  }

  render() {
    const {
      challengeId,
      submissionId,
      mySubmissions,
    } = this.props;
    return (
      <div styleName="outer-container">
        <div styleName="submission-management-container" role="main">
          <div styleName="title">
            Submission Detail
          </div>
          <div styleName="row header">
            <div styleName="history">
              <a href={`/challenges/${challengeId}?tab=submissions`}>
                Submission History
              </a>
            </div>
            <div styleName="details">
              <a href={`https://software.topcoder.com/review/actions/DownloadContestSubmission.do?method=downloadContestSubmission&uid=${submissionId}`}>
                Submission Details: {submissionId} <DownloadIcon />
              </a>
            </div>
          </div>
          <div styleName="row header">
            <div styleName="col">
              Review Summary
            </div>
            <div styleName="col">System Output</div>
          </div>
          {mySubmissions && mySubmissions.map(this.renderSummary)}
        </div>
      </div>
    );
  }
}


SubmissionDetailPageContainer.defaultProps = {
  mySubmissions: [],
};

SubmissionDetailPageContainer.propTypes = {
  submissionId: PT.string.isRequired,
  authTokens: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  loadMySubmissions: PT.func.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()),
};

function mapStateToProps(state, props) {
  const { challengeId, submissionId } = props.match.params;

  let { mySubmissions } = state.challenge;
  mySubmissions = challengeId === mySubmissions.challengeId
    ? mySubmissions.v2 : null;

  const submissionPhase = state.challenge.details.allPhases.find(phase => ['Submission', 'Checkpoint Submission'].includes(phase.phaseType) && phase.phaseStatus === 'Open') || {};
  return {
    challengeId: Number(challengeId),
    challenge: state.challenge.details,
    challengesUrl: props.challengesUrl,

    deleting: state.page.submissionManagement.deletingSubmission,

    isLoadingChallenge: Boolean(state.challenge.loadingDetailsForChallengeId),

    loadingSubmissionsForChallengeId:
      state.challenge.loadingSubmissionsForChallengeId || '',
    mySubmissions,

    submissionPhaseStartDate: submissionPhase.actualStartTime || submissionPhase.scheduledStartTime || '',

    toBeDeletedId: state.page.submissionManagement.toBeDeletedId,

    authTokens: state.auth,
    registrants: state.challenge.details.registrants,
    handle: state.auth.user ? state.auth.user.handle : '',
    submissionId,
  };
}

const mapDispatchToProps = dispatch => ({
  onShowDetails: (submissionId) => {
    dispatch(smpActions.page.submissionManagement.showDetails(submissionId));
  },
  loadMySubmissions: (tokenV2, challengeId) => {
    const a = actions.challenge;
    dispatch(a.getSubmissionsInit(challengeId));
    dispatch(a.getSubmissionsDone(challengeId, tokenV2));
  },
  onDownloadSubmission: (...payload) => {
    dispatch(actions.smp.downloadSubmission(...payload));
  },
});

const SubmissionManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionDetailPageContainer);

export default SubmissionManagementContainer;
