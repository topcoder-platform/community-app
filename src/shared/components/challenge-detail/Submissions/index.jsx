/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Submissions tab component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import challengeDetailsActions from 'actions/page/challenge-details';
import Lock from '../icons/lock.svg';
import SubmissionRow from './SubmissionRow';

import './style.scss';

function renderSubmission(s) {
  return (
    <div styleName="submission" key={s.submissionId}>
      <a href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.submissionId}`} target="_blank" rel="noopener noreferrer">
        <img alt="" src={`${config.URL.STUDIO}/studio.jpg?module=DownloadSubmission&sbmid=${s.submissionId}&sbt=small&sfi=1`} />
      </a>
      <div styleName="bottom-info">
        <div styleName="links">
          <a href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.submissionId}`} target="_blank" rel="noopener noreferrer">
            {`#${s.submissionId}`}
          </a>
          <a href={`${config.URL.BASE}/members/${s.submitter}`} target="_blank" rel="noopener noreferrer" style={s.colorStyle}>
            {s.submitter}
          </a>
        </div>
        <div>
          {moment(s.submissionTime).format('MMM DD,YYYY HH:mm')}
        </div>
      </div>
    </div>
  );
}

// The SubmissionRow component
function SubmissionsComponent({
  challenge,
  toggleSubmissionHistory,
  submissionHistoryOpen,
}) {
  const { checkpoints, submissions, registrants } = challenge;

  // copy colorStyle from registrants to submissions
  const wrappedSubmissions = submissions.map((s) => {
    const registrant = registrants.find(r => r.handle === s.submitter);
    const { colorStyle } = registrant;
    /* eslint-disable no-param-reassign */
    s.colorStyle = JSON.parse(colorStyle.replace(/(\w+):\s*([^;]*)/g, '{"$1": "$2"}'));
    /* eslint-enable no-param-reassign */
    return s;
  });

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
    }
    return (val1 - val2);
  });

  const isMM = challenge.subTrack === 'MARATHON_MATCH';

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
  /* TODO: Ohh... why the actual <table> was not used here?
  * Should be re-factored to use <table> later. */
  return (
    <div styleName="container dev">
      <div styleName="head">
        {
          isMM ? (
            <div styleName="col-1 col">
              Rank
            </div>
          ) : null
        }
        <div styleName="col-2 col">
          Handle
        </div>
        <div styleName="col-3 col">
          Score
        </div>
        <div styleName="col-4 col" />
      </div>
      <div styleName="sub-head">
        {
          isMM ? (
            <div styleName="col-1 col">
              <div styleName="col">
                Final
              </div>
              <div styleName="col">
              Provisional
              </div>
            </div>
          ) : null
        }
        <div styleName="col-2 col" />
        <div styleName="col-3 col">
          <div styleName="col">
            Final
          </div>
          <div styleName="col">
            Provisional
          </div>
        </div>
        <div styleName="col-4 col" />
      </div>
      {
        wrappedSubmissions.map((submission, index) => (
          <SubmissionRow
            isMM={isMM}
            key={submission.submitterId + submission.submitter}
            {...submission}
            toggleHistory={() => { toggleSubmissionHistory(index); }}
            openHistory={(submissionHistoryOpen[index.toString()] || false)}
          />
        ))
      }
    </div>
  );
}

SubmissionsComponent.propTypes = {
  challenge: PT.shape({
    checkpoints: PT.arrayOf(PT.object),
    submissions: PT.arrayOf(PT.object),
    submissionViewable: PT.string,
    track: PT.string.isRequired,
  }).isRequired,
  toggleSubmissionHistory: PT.func.isRequired,
  submissionHistoryOpen: PT.shape({}).isRequired,
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
