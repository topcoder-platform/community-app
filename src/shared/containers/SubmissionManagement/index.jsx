/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */

import _ from 'lodash';
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
    if (!(this.props.challenge || this.props.isLoadingChallenge)) {
      this.props.loadChallengeDetails(this.props.authTokens, this.props.challengeId);
    }

    if (!(this.props.mySubmissions.length || this.props.isLoadingSubmissions)) {
      this.props.loadMySubmissions(this.props.authTokens, this.props.challengeId);
    }
  }

  render() {
    const isEmpty = _.isEmpty(this.props.challenge);
    const challengeType = ((this.props.challenge || {}).track || '').toLowerCase();

    const smConfig = {
      onShowDetails: this.props.onShowDetails,
      onDelete: this.props.onSubmissionDelete,
      onDownload: () => this.props.onDownloadSubmission(0, this.props.authTokens),
      onlineReviewUrl: `${config.URL.ONLINE_REVIEW}/review/actions/ViewProjectDetails?pid=${this.props.challengeId}`,
      challengeUrl: `${config.URL.BASE}/challenge-details/${this.props.challengeId}/?type=${challengeType}`,
      addSumissionUrl: `${config.URL.BASE}/challenges/${this.props.challengeId}/submit/file/`,
      helpPageUrl: config.URL.HELP,
    };

    return (
      <div styleName="outer-container">
        <div styleName="submission-management-container">
          {!isEmpty &&
            <SubmissionManagement
              challenge={this.props.challenge}
              loadingSubmissions={this.props.isLoadingSubmissions}
              submissions={this.props.mySubmissions}
              showDetails={this.props.showDetails}
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
  deleting: PT.bool,
  isLoadingChallenge: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  authTokens: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()),
  isLoadingSubmissions: PT.bool,
  loadMySubmissions: PT.func.isRequired,
  onShowDetails: PT.func.isRequired,
  onSubmissionDelete: PT.func.isRequired,
  onDownloadSubmission: PT.func.isRequired,
  showDetails: PT.shape().isRequired,
  showModal: PT.bool,
  onCancelSubmissionDelete: PT.func.isRequired,
  toBeDeletedId: PT.number,
  onSubmissionDeleteConfirmed: PT.func.isRequired,
};


const mapStateToProps = (state, props) => ({
  challengeId: Number(props.match.params.challengeId),
  challenge: state.challenge.details,

  deleting: state.challenge.mySubmissionsManagement.deletingSubmission,

  isLoadingChallenge: state.challenge.loadingDetails,

  mySubmissions: (state.challenge.mySubmissions || {}).v2,
  isLoadingSubmissions: state.challenge.loadingMySubmissions,
  showDetails: new Set(state.challenge.mySubmissionsManagement.showDetails),

  showModal: state.challenge.mySubmissionsManagement.showModal,
  toBeDeletedId: state.challenge.mySubmissionsManagement.toBeDeletedId,

  authTokens: state.auth,
});

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
    dispatch(challengeActions.fetchChallengeInit());
    dispatch(challengeActions.fetchChallengeDone(tokens, challengeId));
  },

  loadMySubmissions: (tokens, challengeId) => {
    dispatch(challengeActions.fetchSubmissionsInit());
    dispatch(challengeActions.fetchSubmissionsDone(tokens, challengeId));
  },
});

const SubmissionManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionManagementPageContainer);

export default SubmissionManagementContainer;
