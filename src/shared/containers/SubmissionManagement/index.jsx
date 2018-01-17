/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */

import _ from 'lodash';
import AccessDenied, {
  CAUSE as ACCESS_DENIED_REASON,
} from 'components/tc-communities/AccessDenied';
import Modal from 'components/Modal';
import Button from 'components/Button';
import LoadingIndicator from 'components/LoadingIndicator';
import SubmissionManagement from 'components/SubmissionManagement/SubmissionManagement';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import config from 'utils/config';

import './styles.scss';
import challengeActions from '../../actions/challenge';
import smpActions from '../../actions/smp';

// The container component
class SubmissionManagementPageContainer extends React.Component {
  componentDidMount() {
    const {
      authTokens,
      challenge,
      challengeId,
      mySubmissions,
      loadChallengeDetails,
      loadingSubmissionsForChallengeId,
      loadMySubmissions,
    } = this.props;

    if (!challenge
      || (_.toString(challenge.id) !== _.toString(challengeId))) {
      loadChallengeDetails(authTokens, challengeId);
    }

    if (!mySubmissions && challengeId !== loadingSubmissionsForChallengeId) {
      loadMySubmissions(authTokens, challengeId);
    }
  }

  render() {
    const {
      challenge,
      challengesUrl,
      loadingSubmissionsForChallengeId,
      submissionPhaseStartDate,
      handle,
      registrants,
    } = this.props;
    const isRegistered = registrants.find(r => r.handle === handle);
    if (!isRegistered) return <AccessDenied redirectLink={`${challengesUrl}/${challenge.id}`} cause={ACCESS_DENIED_REASON.HAVE_NOT_SUBMITTED_TO_THE_CHALLENGE} />;

    const isEmpty = _.isEmpty(this.props.challenge);
    const smConfig = {
      onShowDetails: this.props.onShowDetails,
      onDelete: this.props.onSubmissionDelete,
      onDownload: () => this.props.onDownloadSubmission(0, this.props.authTokens),
      onlineReviewUrl: `${config.URL.ONLINE_REVIEW}/review/actions/ViewProjectDetails?pid=${this.props.challengeId}`,
      challengeUrl: `${challengesUrl}/${this.props.challengeId}`,
      addSumissionUrl: `${config.URL.BASE}/challenges/${this.props.challengeId}/submit`,
      helpPageUrl: config.URL.HELP,
    };

    return (
      <div styleName="outer-container">
        <div styleName="submission-management-container">
          {!isEmpty &&
            <SubmissionManagement
              challenge={this.props.challenge}
              challengesUrl={challengesUrl}
              loadingSubmissions={Boolean(loadingSubmissionsForChallengeId)}
              submissions={this.props.mySubmissions}
              showDetails={this.props.showDetails}
              submissionPhaseStartDate={submissionPhaseStartDate}
              {...smConfig}
            />}
          {this.props.isLoadingChallenge && <LoadingIndicator />}
          {/* TODO: The modal should be split out as a separate component.
            * Not critical though, so keeping it here for the moment. */}
          {this.props.showModal &&
          <Modal
            onCancel={this.props.deleting ? _.noop : this.props.onCancelSubmissionDelete}
          >
            <div styleName="modal-content">
              <p styleName="are-you-sure">
                Are you sure you want to delete
                submission <span styleName="id">{this.props.toBeDeletedId}</span>?</p>
              <p styleName="remove-warn">
                This will permanently remove all
                files from our servers and can’t be undone.
                You’ll have to upload all the files again in order to restore it.</p>
              <div
                /* NOTE: Current implementation of the loading indicator is
                 * based on a gif image. Thus, we want to load create this
                 * element from the beginning to ensure that the image is
                 * downloaded in background, and will be shown immediately,
                 * when needed. */
                className={this.props.deleting ? '' : 'hidden'}
                styleName="deletingIndicator"
              ><LoadingIndicator /></div>
              <div
                className={this.props.deleting ? 'hidden' : ''}
                styleName="action-btns"
              >
                <Button
                  className="tc-btn-sm tc-btn-default"
                  onClick={() => this.props.onCancelSubmissionDelete()}
                >Cancel</Button>
                <Button
                  className="tc-btn-sm tc-btn-warning"
                  onClick={
                    () => this.props.onSubmissionDeleteConfirmed(
                      this.props.authTokens.tokenV3,
                      this.props.toBeDeletedId)
                  }
                >Delete Submission</Button>
              </div>
            </div>
          </Modal>}
        </div>
      </div>
    );
  }
}

SubmissionManagementPageContainer.defaultProps = {
  challengesUrl: '/challenges',
  deleting: false,
  isLoadingChallenge: false,
  mySubmissions: [],
  isLoadingSubmissions: false,
  showModal: false,
  toBeDeletedId: 0,
  challenge: null,
};

SubmissionManagementPageContainer.propTypes = {
  challenge: PT.shape(),
  challengesUrl: PT.string,
  deleting: PT.bool,
  isLoadingChallenge: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  authTokens: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()),
  loadingSubmissionsForChallengeId: PT.string.isRequired,
  loadMySubmissions: PT.func.isRequired,
  onShowDetails: PT.func.isRequired,
  onSubmissionDelete: PT.func.isRequired,
  onDownloadSubmission: PT.func.isRequired,
  showDetails: PT.shape().isRequired,
  showModal: PT.bool,
  onCancelSubmissionDelete: PT.func.isRequired,
  toBeDeletedId: PT.number,
  onSubmissionDeleteConfirmed: PT.func.isRequired,
  submissionPhaseStartDate: PT.string.isRequired,
  registrants: PT.arrayOf(PT.object).isRequired,
  handle: PT.string.isRequired,
};

function mapStateToProps(state, props) {
  const challengeId = props.match.params.challengeId;

  let mySubmissions = state.challenge.mySubmissions;
  mySubmissions = challengeId === mySubmissions.challengeId
    ? mySubmissions.v2 : null;

  const submissionPhase = state.challenge.details.allPhases.find(phase =>
    ['Submission', 'Checkpoint Submission'].includes(phase.phaseType) && phase.phaseStatus === 'Open') || {};

  return {
    challengeId: Number(challengeId),
    challenge: state.challenge.details,
    challengesUrl: props.challengesUrl,

    deleting: state.challenge.mySubmissionsManagement.deletingSubmission,

    isLoadingChallenge: Boolean(state.challenge.loadingDetailsForChallengeId),

    loadingSubmissionsForChallengeId:
      state.challenge.loadingSubmissionsForChallengeId || '',
    mySubmissions,

    submissionPhaseStartDate: submissionPhase.actualStartTime || submissionPhase.scheduledStartTime || '',

    showDetails: new Set(state.challenge.mySubmissionsManagement.showDetails),

    showModal: state.challenge.mySubmissionsManagement.showModal,
    toBeDeletedId: state.challenge.mySubmissionsManagement.toBeDeletedId,

    authTokens: state.auth,
    registrants: state.challenge.details.registrants,
    handle: state.auth.user ? state.auth.user.handle : '',
  };
}

const mapDispatchToProps = dispatch => ({
  onShowDetails: (submissionId) => {
    dispatch(smpActions.smp.showDetails(submissionId));
  },

  onSubmissionDelete: (submissionId) => {
    dispatch(smpActions.smp.confirmDelete(submissionId));
  },

  onCancelSubmissionDelete: () => {
    dispatch(smpActions.smp.cancelDelete());
  },

  onSubmissionDeleteConfirmed: (challengeId, submissionId) => {
    dispatch(smpActions.smp.deleteSubmissionInit());
    dispatch(smpActions.smp.deleteSubmissionDone(challengeId, submissionId));
  },

  onDownloadSubmission: (...payload) => {
    dispatch(smpActions.smp.downloadSubmission(...payload));
  },

  loadChallengeDetails: (tokens, challengeId) => {
    const a = challengeActions.challenge;
    dispatch(a.getDetailsInit(challengeId));
    dispatch(a.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2));
  },

  loadMySubmissions: (tokens, challengeId) => {
    const a = challengeActions.challenge;
    dispatch(a.getSubmissionsInit(challengeId));
    dispatch(a.getSubmissionsDone(challengeId, tokens.tokenV2));
  },
});

const SubmissionManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionManagementPageContainer);

export default SubmissionManagementContainer;
