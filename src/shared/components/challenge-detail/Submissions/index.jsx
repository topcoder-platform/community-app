/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Submissions tab component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import { submission as submissionUtils } from 'topcoder-react-lib';
import { isTokenExpired } from 'tc-accounts';
import challengeDetailsActions from 'actions/page/challenge-details';
import LoadingIndicator from 'components/LoadingIndicator';
import { goToLogin } from 'utils/tc';
import Lock from '../icons/lock.svg';
import SubmissionRow from './SubmissionRow';
import './style.scss';

const { getProvisionalScore, getFinalScore } = submissionUtils;

class SubmissionsComponent extends React.Component {
  componentDidMount() {
    const { challenge, loadMMSubmissions, auth } = this.props;
    const isMM = challenge.subTrack.indexOf('MARATHON_MATCH') > -1;

    // Check auth token, go to login page if invalid
    if (isMM && (_.isEmpty(auth) || _.isEmpty(auth.tokenV3) || isTokenExpired(auth.tokenV3))) {
      goToLogin('community-app-main');
      return;
    }

    if (isMM && _.has(challenge, 'submissions') && challenge.submissions.length > 0) {
      const submitterIds = _.map(challenge.submissions, item => item.submitterId);
      loadMMSubmissions(challenge.id, submitterIds, challenge.registrants, auth.tokenV3);
    }
  }

  render() {
    const {
      challenge, toggleSubmissionHistory,
      submissionHistoryOpen,
      mmSubmissions,
      loadingMMSubmissionsForChallengeId,
    } = this.props;
    const {
      checkpoints,
      submissions,
      registrants,
      allPhases,
    } = challenge;

    const renderSubmission = s => (
      <div styleName="submission" key={s.submissionId}>
        <a
          href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.submissionId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt=""
            src={`${config.URL.STUDIO}/studio.jpg?module=DownloadSubmission&sbmid=${s.submissionId}&sbt=small&sfi=1`}
          />
        </a>
        <div styleName="bottom-info">
          <div styleName="links">
            <a
              href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.submissionId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`#${s.submissionId}`}
            </a>
            <a
              href={`${config.URL.BASE}/members/${s.submitter}`}
              target="_blank"
              rel="noopener noreferrer"
              style={_.get(s, 'colorStyle')}
            >
              {s.submitter}
            </a>
          </div>
          <div>
            {moment(s.submissionTime)
              .format('MMM DD,YYYY HH:mm')}
          </div>
        </div>
      </div>
    );

    let wrappedSubmissions;
    const isMM = challenge.subTrack.indexOf('MARATHON_MATCH') > -1;

    // copy colorStyle from registrants to submissions
    if (!isMM) {
      wrappedSubmissions = submissions.map((s) => {
        const registrant = registrants.find(r => r.handle === s.submitter);
        if (registrant && registrant.colorStyle) {
          const { colorStyle } = registrant;
          /* eslint-disable no-param-reassign */
          s.colorStyle = JSON.parse(colorStyle.replace(/(\w+):\s*([^;]*)/g, '{"$1": "$2"}'));
          /* eslint-enable no-param-reassign */
        }
        return s;
      });
    } else {
      wrappedSubmissions = _.cloneDeep(mmSubmissions);
    }

    let isReviewPhaseComplete = false;
    _.forEach(allPhases, (phase) => {
      if (phase.phaseType === 'Review' && phase.phaseStatus === 'Closed') {
        isReviewPhaseComplete = true;
      }
    });

    if (!isMM) {
      wrappedSubmissions.sort((a, b) => {
        let val1 = 0;
        let val2 = 0;
        if (a.rank && b.rank) {
          if (a.rank.final && b.rank.final) {
            val1 = a.rank.final;
            val2 = b.rank.final;
          } else if (a.rank.interim) {
            if (a.rank.interim && b.rank.interim) {
              val1 = a.rank.interim;
              val2 = b.rank.interim;
            }
          }
        } else if (isReviewPhaseComplete) {
          val1 = getFinalScore(b);
          val2 = getFinalScore(a);
        } else {
          val1 = getProvisionalScore(b);
          val2 = getProvisionalScore(a);
        }
        return (val1 - val2);
      });
    }

    if (challenge.track.toLowerCase() === 'design') {
      return challenge.submissionViewable === 'true' ? (
        <div styleName="container view">
          <div styleName="title">
              ROUND 2 (FINAL) SUBMISSIONS
          </div>
          <div styleName="content">
            {
              wrappedSubmissions.map(renderSubmission)
            }
          </div>
          {
            checkpoints.length > 0
            && (
              <div styleName="title">
                ROUND 1 (CHECKPOINT) SUBMISSIONS
              </div>
            )
          }
          {
            checkpoints.length > 0
            && (
              <div styleName="content">
                {
                  checkpoints.map(renderSubmission)
                }
              </div>
            )
          }
        </div>
      )
        : (
          <div styleName="container no-view">
            <Lock styleName="lock" />
            <div styleName="title">
              Private Challenge
            </div>
            <div styleName="subtitle">
              Submissions are not viewable for this challenge
            </div>
            <div styleName="desc">
              There are many reason why the submissions may not be viewable, such
              as the allowance of stock art, or a client&apos;s desire to keep the work private.
            </div>
          </div>
        );
    }

    if (!_.isEmpty(loadingMMSubmissionsForChallengeId)) {
      return <LoadingIndicator />;
    }

    return (
      <div styleName={`container dev ${isMM ? '' : 'non-mm'}`}>
        {
          isMM ? (
            <div styleName="head">
              <div styleName="col-1 col">
                Rank
              </div>
              <div styleName="col-2 col">
                Handle
              </div>
              <div styleName="col-3 col">
                Score
              </div>
              <div styleName="col-4 col" />
            </div>
          ) : (
            <div styleName="head">
              <div styleName="col-1">
                Username
              </div>
              <div styleName="col-2">
                Submission Date
              </div>
              <div styleName="col-3">
                Initial / Final Score
              </div>
            </div>
          )
        }
        {
          isMM && (
            <div styleName="sub-head">
              <div styleName="col-1 col">
                <div styleName="col">
                  Final
                </div>
                <div styleName="col">
                  Provisional
                </div>
              </div>
              <div styleName="col-2 col" />
              <div styleName="col-3 col">
                <div styleName="col">
                  Final
                </div>
                <div styleName="col">
                  Provisional
                </div>
                <div styleName="col">
                  Time
                </div>
              </div>
              <div styleName="col-4 col" />
            </div>
          )
        }
        {
          isMM && (
            wrappedSubmissions.map((submission, index) => (
              <SubmissionRow
                isReviewPhaseComplete={isReviewPhaseComplete}
                isMM={isMM}
                key={submission.member}
                {...submission}
                toggleHistory={() => { toggleSubmissionHistory(index); }}
                openHistory={(submissionHistoryOpen[index.toString()] || false)}
              />
            ))
          )
        }
        {
          !isMM && (
            wrappedSubmissions.map(s => (
              <div key={s.submitter + s.submissions[0].submissionTime} styleName="row">
                <div styleName="col-1">
                  <a href={`${config.URL.BASE}/member-profile/${s.submitter}/develop`} target="_blank" rel="noopener noreferrer" styleName="handle">
                    {s.submitter}
                  </a>
                </div>
                <div styleName="col-2">
                  {moment(s.submissions[0].submissionTime).format('MMM DD, YYYY HH:mm')}
                </div>
                <div styleName="col-3">
                  {s.submissions[0].initialScore ? s.submissions[0].initialScore.toFixed(2) : 'N/A'}
                  &zwnj;
                  &zwnj;/
                  &zwnj;
                  {s.submissions[0].finalScore ? s.submissions[0].finalScore.toFixed(2) : 'N/A'}
                </div>
              </div>
            ))
          )
        }
      </div>
    );
  }
}

SubmissionsComponent.propTypes = {
  auth: PT.shape().isRequired,
  challenge: PT.shape({
    checkpoints: PT.arrayOf(PT.object),
    submissions: PT.arrayOf(PT.object),
    submissionViewable: PT.string,
    track: PT.string.isRequired,
  }).isRequired,
  toggleSubmissionHistory: PT.func.isRequired,
  submissionHistoryOpen: PT.shape({}).isRequired,
  loadMMSubmissions: PT.func.isRequired,
  mmSubmissions: PT.arrayOf(PT.shape()).isRequired,
  loadingMMSubmissionsForChallengeId: PT.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    toggleSubmissionHistory: index => dispatch(
      challengeDetailsActions.page.challengeDetails.submissions.toggleSubmissionHistory(index),
    ),
  };
}

function mapStateToProps(state) {
  return {
    submissionHistoryOpen: state.page.challengeDetails.submissionHistoryOpen,
  };
}

const Submissions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionsComponent);

export default Submissions;
