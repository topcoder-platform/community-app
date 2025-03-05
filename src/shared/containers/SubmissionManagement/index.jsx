/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */

import _ from 'lodash';
import AccessDenied, { CAUSE as ACCESS_DENIED_REASON } from 'components/tc-communities/AccessDenied';
import LoadingIndicator from 'components/LoadingIndicator';
import SubmissionManagement from 'components/SubmissionManagement/SubmissionManagement';
import React from 'react';
import PT from 'prop-types';
import { safeForDownload } from 'utils/tc';
import { connect } from 'react-redux';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import { actions, services } from 'topcoder-react-lib';
import getReviewTypes from 'services/reviewTypes';
import downloadSubmissions, { getSubmissionArtifacts } from 'services/submissions';

import style from './styles.scss';
import smpActions from '../../actions/page/submission_management';


const { getService } = services.submissions;
const { getService: getMemberService } = services.members;

const theme = {
  container: style.modalContainer,
};

// The container component
class SubmissionManagementPageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      needReload: false,
      initialState: true,
      submissions: [],
    };
  }

  componentDidMount() {
    const {
      authTokens,
      challenge,
      challengeId,
      loadChallengeDetails,
      loadingSubmissionsForChallengeId,
      loadMySubmissions,
    } = this.props;

    if (!challenge
      || (_.toString(challenge.id) !== _.toString(challengeId))) {
      loadChallengeDetails(authTokens, challengeId);
    }

    if (challengeId !== loadingSubmissionsForChallengeId) {
      loadMySubmissions(authTokens, challengeId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      loadMySubmissions, authTokens, challengeId, mySubmissions,
    } = nextProps;
    const { needReload } = this.state;

    if (needReload === false && mySubmissions) {
      if (mySubmissions.find(item => safeForDownload(item.url) !== true)) {
        this.setState({ needReload: true });
        setTimeout(() => {
          loadMySubmissions(authTokens, challengeId);
          this.setState({ needReload: false });
        }, 2000);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      deletionSucceed,
      toBeDeletedId,
      mySubmissions,
    } = this.props;
    const { initialState } = this.state;

    if (initialState && mySubmissions) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        submissions: [...mySubmissions],
        initialState: false,
      });
      return;
    }
    const { submissions } = this.state;

    if (deletionSucceed !== prevProps.deletionSucceed) {
      _.remove(submissions, submission => (
        submission.id === toBeDeletedId
      ));
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        submissions,
      });
    }
  }

  render() {
    const {
      authTokens,
      challenge,
      challengeId,
      challengesUrl,
      deleting,
      loadingSubmissionsForChallengeId,
      submissionPhaseStartDate,
      isLoadingChallenge,
      onCancelSubmissionDelete,
      onShowDetails,
      onSubmissionDelete,
      onSubmissionDeleteConfirmed,
      showDetails,
      showModal,
      toBeDeletedId,
    } = this.props;

    const { submissions } = this.state;

    if (!challenge.isRegistered) return <AccessDenied redirectLink={`${challengesUrl}/${challenge.id}`} cause={ACCESS_DENIED_REASON.HAVE_NOT_SUBMITTED_TO_THE_CHALLENGE} />;

    const getExtensionFromMime = (mimeType) => {
      const mimeMap = {
        'application/zip': 'zip',
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'text/plain': 'txt',
      };
      return mimeMap[mimeType] || 'zip';
    };

    const isEmpty = _.isEmpty(challenge);
    const smConfig = {
      onShowDetails,
      onDelete: onSubmissionDelete,
      onDownload: (challengeType, submissionId) => {
        const submissionsService = getService(authTokens.tokenV3);
        submissionsService.downloadSubmission(submissionId)
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `submission-${challengeType}-${submissionId}.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          });
      },
      onDownloadArtifacts: (artifactId, submissionId) => {
        downloadSubmissions(authTokens.tokenV3, submissionId, artifactId)
          .then((blob) => {
            const fileBlob = new Blob([blob]);
            const url = window.URL.createObjectURL(fileBlob);
            const link = document.createElement('a');
            link.href = url;
            const extension = getExtensionFromMime(fileBlob);
            link.setAttribute('download', `submission-artifact-${submissionId}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          });
      },
      getSubmissionArtifacts:
        submissionId => getSubmissionArtifacts(authTokens.tokenV3, submissionId),
      getReviewTypesList: () => {
        const reviewTypes = getReviewTypes(authTokens.tokenV3);
        return reviewTypes;
      },
      getChallengeResources: (cId) => {
        const membersService = getMemberService(authTokens.tokenV3);
        return membersService.getChallengeResources(cId);
      },
      getSubmissionInformation: (submissionId) => {
        const submissionsService = getService(authTokens.tokenV3);
        return submissionsService.getSubmissionInformation(submissionId);
      },
      onlineReviewUrl: `${config.URL.ONLINE_REVIEW}/review/actions/ViewProjectDetails?pid=${challengeId}`,
      challengeUrl: `${challengesUrl}/${challengeId}`,
      addSumissionUrl: `${config.URL.BASE}/challenges/${challengeId}/submit`,
      helpPageUrl: config.URL.HELP,
    };

    return (
      <div styleName="outer-container">
        <div styleName="submission-management-container" role="main">
          {!isEmpty
            && (
            <SubmissionManagement
              challenge={challenge}
              challengesUrl={challengesUrl}
              loadingSubmissions={Boolean(loadingSubmissionsForChallengeId)}
              submissions={submissions}
              showDetails={showDetails}
              submissionPhaseStartDate={submissionPhaseStartDate}
              {...smConfig}
            />
            )}
          {isLoadingChallenge && <LoadingIndicator />}
          {/* TODO: The modal should be split out as a separate component.
            * Not critical though, so keeping it here for the moment. */}
          {showModal && (
          <Modal
            onCancel={deleting ? _.noop : onCancelSubmissionDelete}
            theme={theme}
          >
            <div styleName="modal-content">
              <p styleName="are-you-sure">
                Are you sure you want to delete
                submission
                {' '}
                <span styleName="id">
                  {toBeDeletedId}
                </span>
                ?
              </p>
              <p styleName="remove-warn">
                This will permanently remove all
                files from our servers and can’t be undone.
                You’ll have to upload all the files again in order to restore it.
                Note that deleting the file may take a few minutes to propagate
                through the Topcoder platform.
              </p>
              <div
                /* NOTE: Current implementation of the loading indicator is
                 * based on a gif image. Thus, we want to load create this
                 * element from the beginning to ensure that the image is
                 * downloaded in background, and will be shown immediately,
                 * when needed. */
                className={deleting ? '' : 'hidden'}
                styleName="deletingIndicator"
              >
                <LoadingIndicator />
              </div>
              <div
                className={deleting ? 'hidden' : ''}
                styleName="action-btns"
              >
                <PrimaryButton
                  theme={{
                    button: style['add-sub-btn'],
                  }}
                  onClick={() => onCancelSubmissionDelete()}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  theme={{
                    button: style['add-sub-btn-warning'],
                  }}
                  onClick={
                    () => onSubmissionDeleteConfirmed(
                      authTokens.tokenV3,
                      toBeDeletedId,
                    )
                  }
                >
                  Delete Submission
                </PrimaryButton>
              </div>
            </div>
          </Modal>
          )}
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
  // isLoadingSubmissions: false,
  showModal: false,
  toBeDeletedId: '',
  challenge: null,
  deletionSucceed: false,
};

SubmissionManagementPageContainer.propTypes = {
  challenge: PT.shape(),
  challengesUrl: PT.string,
  deleting: PT.bool,
  isLoadingChallenge: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  authTokens: PT.shape().isRequired,
  challengeId: PT.string.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()),
  loadingSubmissionsForChallengeId: PT.string.isRequired,
  loadMySubmissions: PT.func.isRequired,
  onShowDetails: PT.func.isRequired,
  onSubmissionDelete: PT.func.isRequired,
  onDownloadSubmission: PT.func.isRequired,
  showDetails: PT.shape().isRequired,
  showModal: PT.bool,
  onCancelSubmissionDelete: PT.func.isRequired,
  toBeDeletedId: PT.string,
  deletionSucceed: PT.bool,
  onSubmissionDeleteConfirmed: PT.func.isRequired,
  submissionPhaseStartDate: PT.string.isRequired,
};

function mapStateToProps(state, props) {
  const { challengeId } = props.match.params;

  let { mySubmissions } = state.challenge;
  mySubmissions = challengeId === mySubmissions.challengeId
    ? mySubmissions.v2 : null;

  const allPhases = state.challenge.details.phases || [];
  const submissionPhase = allPhases.find(phase => ['Submission', 'Checkpoint Submission'].includes(phase.name) && phase.isOpen) || {};

  return {
    challengeId: String(challengeId),
    challenge: state.challenge.details,
    challengesUrl: props.challengesUrl,

    deleting: state.page.submissionManagement.deletingSubmission,

    isLoadingChallenge: Boolean(state.challenge.loadingDetailsForChallengeId),

    loadingSubmissionsForChallengeId:
      state.challenge.loadingSubmissionsForChallengeId || '',
    mySubmissions,

    submissionPhaseStartDate: submissionPhase.actualStartDate || submissionPhase.scheduledStartDate || '',

    showDetails: state.page.submissionManagement.showDetails,

    showModal: state.page.submissionManagement.showModal,
    toBeDeletedId: state.page.submissionManagement.toBeDeletedId,
    deletionSucceed: state.page.submissionManagement.deletionSucceed,

    authTokens: state.auth,
    registrants: state.challenge.details.registrants,
    handle: state.auth.user ? state.auth.user.handle : '',
  };
}

const mapDispatchToProps = dispatch => ({
  onShowDetails: (submissionId) => {
    dispatch(smpActions.page.submissionManagement.showDetails(submissionId));
  },

  onSubmissionDelete: (submissionId) => {
    dispatch(smpActions.page.submissionManagement.confirmDelete(submissionId));
  },

  onCancelSubmissionDelete: () => {
    dispatch(smpActions.page.submissionManagement.cancelDelete());
  },

  onSubmissionDeleteConfirmed: (challengeId, submissionId) => {
    dispatch(actions.smp.deleteSubmissionInit());
    dispatch(actions.smp.deleteSubmissionDone(challengeId, submissionId));
  },

  onDownloadSubmission: (...payload) => {
    dispatch(actions.smp.downloadSubmission(...payload));
  },

  loadChallengeDetails: (tokens, challengeId) => {
    const a = actions.challenge;
    dispatch(a.getDetailsInit(challengeId));
    dispatch(a.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2));
  },

  loadMySubmissions: (tokens, challengeId) => {
    const a = actions.challenge;
    dispatch(a.getSubmissionsInit(challengeId));
    dispatch(a.getSubmissionsDone(challengeId, tokens.tokenV3));
  },
});

const SubmissionManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionManagementPageContainer);

export default SubmissionManagementContainer;
