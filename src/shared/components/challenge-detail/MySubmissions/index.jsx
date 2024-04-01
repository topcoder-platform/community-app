/*
  Component renders my submissions
*/

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { goToLogin } from 'utils/tc';
import LoadingIndicator from 'components/LoadingIndicator';
import tc from 'components/buttons/themed/tc.scss';

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
      submissionsSortDetail: {
        field: '',
        sort: '',
      },
    };
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
    const { selectedSubmission, submissionsSortDetail } = this.state;

    if (!_.isEmpty(loadingMMSubmissionsForChallengeId)) {
      return <div className={style.loading}><LoadingIndicator /></div>;
    }

    return (
      <div className={style.wrapper}>
        <div className={style.content}>
          { selectedSubmission && (
          <Modal onCancel={() => this.setState({ selectedSubmission: null })} theme={style}>
            <SubmissionsDetail
              onCancel={() => this.setState({ selectedSubmission: null })}
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
          />
        </div>
      </div>
    );
  }
}

MySubmissionsView.defaultProps = {
  onSortChange: () => {},
};

MySubmissionsView.propTypes = {
  challengesUrl: PT.string.isRequired,
  challenge: PT.shape().isRequired,
  hasRegistered: PT.bool.isRequired,
  unregistering: PT.bool.isRequired,
  submissionEnded: PT.bool.isRequired,
  isMM: PT.bool.isRequired,
  isLegacyMM: PT.bool.isRequired,
  loadingMMSubmissionsForChallengeId: PT.string.isRequired,
  auth: PT.shape().isRequired,
  loadMMSubmissions: PT.func.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()).isRequired,
  reviewTypes: PT.arrayOf(PT.shape()).isRequired,
  submissionsSort: PT.shape({
    field: PT.string,
    sort: PT.string,
  }).isRequired,
  onSortChange: PT.func,
};

export default MySubmissionsView;
