/*
  Component renders my submissions
*/

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { goToLogin } from 'utils/tc';
import LoadingIndicator from 'components/LoadingIndicator';
import tc from 'components/buttons/themed/tc.scss';
import DownloadArtifactsModal from 'components/SubmissionManagement/DownloadArtifactsModal';
import { downloadSubmissions } from 'services/submissions';
import { getExtensionFromMime } from 'utils/files';

import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';

import SubmissionsList from './SubmissionsList';
import SubmissionsDetail from './SubmissionsDetail';

import style from './styles.scss';

const buttonThemes = {
  tc,
};

class MySubmissionsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSubmission: null,
      showDownloadArtifactsModal: false,
      showDetailsModal: false,
      submissionsSortDetail: {
        field: '',
        sort: '',
      },
    };
    this.onShowDownloadArtifactsModal = this.onShowDownloadArtifactsModal.bind(this);
    this.onDownloadArtifacts = this.onDownloadArtifacts.bind(this);
    this.loadSubmissionArtifacts = this.loadSubmissionArtifacts.bind(this);
    this.onShowDetailsModal = this.onShowDetailsModal.bind(this);
  }

  componentDidMount() {
    const {
      challenge,
      isMM,
      loadMMSubmissions,
      auth,
    } = this.props;

    // Check auth token, go to login page if invalid
    if (isMM && (_.isEmpty(auth) || _.isEmpty(auth.tokenV3) || isTokenExpired(auth.tokenV3))) {
      goToLogin('community-app-main');
      return;
    }

    if (isMM) {
      loadMMSubmissions(challenge.id, auth.tokenV3);
    }
  }

  onShowDownloadArtifactsModal(submission) {
    this.setState({
      selectedSubmission: submission,
      showDownloadArtifactsModal: true,
      showDetailsModal: false,
    });
  }

  onDownloadArtifacts(submissionId, artifactId) {
    const { auth } = this.props;
    downloadSubmissions(auth.tokenV3, submissionId, artifactId)
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
  }

  onShowDetailsModal(submission) {
    this.setState({
      selectedSubmission: submission,
      showDetailsModal: true,
      showDownloadArtifactsModal: false,
    });
  }

  loadSubmissionArtifacts(submissionId, tokenV3) {
    const { getSubmissionArtifacts } = this.props;
    return getSubmissionArtifacts(submissionId, tokenV3);
  }

  render() {
    const {
      challengesUrl,
      challenge,
      isMM,
      hasRegistered,
      unregistering,
      submissionEnded,
      isLegacyMM,
      loadingMMSubmissionsForChallengeId,
      mySubmissions,
      auth,
      reviewTypes,
      submissionsSort,
      onSortChange,
    } = this.props;
    const {
      selectedSubmission,
      submissionsSortDetail,
      showDetailsModal,
      showDownloadArtifactsModal,
    } = this.state;

    if (!_.isEmpty(loadingMMSubmissionsForChallengeId)) {
      return <div className={style.loading}><LoadingIndicator /></div>;
    }

    return (
      <div className={style.wrapper}>
        <div className={style.content}>
          {showDetailsModal && selectedSubmission && (
          <Modal onCancel={() => this.setState({ selectedSubmission: null })} theme={style}>
            <SubmissionsDetail
              onCancel={() => this.setState({ selectedSubmission: null, showDetailsModal: false })}
              submission={selectedSubmission}
              reviewTypes={reviewTypes}
              submissionsSort={submissionsSortDetail}
              onSortChange={sort => this.setState({ submissionsSortDetail: sort })}
            />

            <div className={style.buttons}>
              <PrimaryButton
                onClick={() => this.setState({ selectedSubmission: null })}
                theme={{
                  button: buttonThemes.tc['primary-green-md'],
                }}
              >
                Close
              </PrimaryButton>
            </div>
          </Modal>
          )}
          {showDownloadArtifactsModal && (
            <DownloadArtifactsModal
              onCancel={() => {
                this.setState({ showDownloadArtifactsModal: false, selectedSubmission: null });
              }}
              getSubmissionArtifacts={
                submissionId => this.loadSubmissionArtifacts(submissionId, auth.tokenV3)
              }
              submissionId={selectedSubmission.submissionId}
              onDownloadArtifacts={this.onDownloadArtifacts}
            />
          )}
          <SubmissionsList
            selectSubmission={submission => this.setState({ selectedSubmission: submission })}
            challengesUrl={challengesUrl}
            challenge={challenge}
            hasRegistered={hasRegistered}
            unregistering={unregistering}
            submissionEnded={submissionEnded}
            isMM={isMM}
            isLegacyMM={isLegacyMM}
            mySubmissions={mySubmissions}
            auth={auth}
            submissionsSort={submissionsSort}
            onSortChange={onSortChange}
            onShowDownloadArtifactsModal={this.onShowDownloadArtifactsModal}
            onShowDetailsModal={this.onShowDetailsModal}
          />
        </div>
      </div>
    );
  }
}

MySubmissionsView.defaultProps = {
  onSortChange: () => {},
  getSubmissionArtifacts: () => {},
};

MySubmissionsView.propTypes = {
  challengesUrl: PT.string.isRequired,
  challenge: PT.shape().isRequired,
  hasRegistered: PT.bool.isRequired,
  unregistering: PT.bool.isRequired,
  submissionEnded: PT.bool.isRequired,
  isMM: PT.bool.isRequired,
  isLegacyMM: PT.bool.isRequired,
  loadingMMSubmissionsForChallengeId: PT.oneOfType([
    PT.string,
    PT.oneOf([null]),
  ]).isRequired,
  auth: PT.shape().isRequired,
  loadMMSubmissions: PT.func.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()).isRequired,
  reviewTypes: PT.arrayOf(PT.shape()).isRequired,
  submissionsSort: PT.shape({
    field: PT.string,
    sort: PT.string,
  }).isRequired,
  onSortChange: PT.func,
  getSubmissionArtifacts: PT.func,
};

export default MySubmissionsView;
