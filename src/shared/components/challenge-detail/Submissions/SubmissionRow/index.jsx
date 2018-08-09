/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * SubmissionRow component.
 */

import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import ArrowNext from '../../../../../assets/images/arrow-next.svg';
import SubmissionHistoryRow from './SubmissionHistoryRow';

import './style.scss';

export default function SubmissionRow({
  openHistory,
  submitter,
  rank,
  submissions,
  toggleHistory,
}) {
  const { finalScore, initialScore } = submissions[0];
  return (
    <div styleName="container">
      <div styleName="row">
        <div styleName="col-1 col">
          <div styleName="col col-left">
            -
          </div>
          <div styleName="col">
            { (rank || {}).interim ? rank.interim : '-' }
          </div>
        </div>
        <div styleName="col-2 col">
          <a href={`${config.URL.BASE}/member-profile/${submitter}/develop`} target="_blank" rel="noopener noreferrer" styleName="handle">
            {submitter}
          </a>
        </div>
        <div styleName="col-3 col">
          <div styleName="col col-left">
            {(!finalScore && finalScore !== 0) ? '-' : finalScore.toFixed(2)}
          </div>
          <div styleName="col">
            {(!initialScore && finalScore !== 0) ? '-' : finalScore.toFixed(2)}
          </div>
        </div>
        <div styleName="col-4 col">
          <a
            onClick={toggleHistory}
            onKeyPress={toggleHistory}
          >
            <span>
              History
              { openHistory ? (<ArrowNext styleName="icon down" />) : (<ArrowNext styleName="icon" />)}
            </span>
          </a>
        </div>
      </div>
      {openHistory && (
        <div styleName="history">
          <div>
            <div styleName="row no-border history-head">
              <div styleName="col-1 col" />
              <div styleName="col-2 col">
                Submission
              </div>
              <div styleName="col-3 col">
                <div styleName="col">
                  Final
                </div>
                <div styleName="col">
                  Provisional
                </div>
              </div>
              <div styleName="col-4 col">
                Time
              </div>
            </div>
          </div>
          {
            submissions.map((submissionHistory, index) => (
              <SubmissionHistoryRow
                submission={submissions.length - index}
                {...submissionHistory}
                key={submissionHistory.submissionId}
              />
            ))
            }
        </div>)}
    </div>
  );
}

SubmissionRow.defaultProps = {
  toggleHistory: () => {},
  rank: {},
};

SubmissionRow.propTypes = {
  openHistory: PT.bool.isRequired,
  submitter: PT.string.isRequired,
  rank: PT.shape({
    interim: PT.number,
  }),
  submissions: PT.arrayOf(PT.shape({
    finalScore: PT.number,
    initialScore: PT.number,
    submissionId: PT.number.isRequired,
    submissionTime: PT.string.isRequired,
  })).isRequired,
  toggleHistory: PT.func,
};
