/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * SubmissionRow component.
 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import moment from 'moment';

import Tooltip from 'components/Tooltip';
import ArrowNext from '../../../../../assets/images/arrow-next.svg';
import SubmissionHistoryRow from './SubmissionHistoryRow';

import './style.scss';

export default function SubmissionRow({
  isMM, openHistory, member, submissions, toggleHistory, colorStyle,
  isReviewPhaseComplete, finalRank, provisionalRank, onShowPopup, registrant,
  getFlagFirstTry, onGetFlagImageFail, finalScore, provisionalScore,
}) {
  const {
    submissionTime,
  } = submissions[0];
  const flagFistTry = registrant ? getFlagFirstTry(registrant) : null;
  return (
    <div styleName="container">
      <div styleName="row">
        {
          isMM ? (
            <div styleName="col-1 col">
              <div styleName="col col-left">
                {
                  isReviewPhaseComplete ? finalRank || '-' : '-'
                }
              </div>
              <div styleName="col">
                { provisionalRank || '-' }
              </div>
            </div>
          ) : null
        }
        <div styleName="col-2 col">
          <div styleName="col">
            {registrant && registrant.countryInfo && flagFistTry && (
              <Tooltip
                content={(
                  <div styleName="tooltip">{registrant.countryInfo.name}</div>
              )}
              >
                <img
                  width="25"
                  src={flagFistTry}
                  alt="country"
                  onError={() => onGetFlagImageFail(registrant.countryInfo)}
                />
              </Tooltip>
            )}
            {registrant && registrant.countryInfo && !flagFistTry && (
              registrant.countryInfo.name
            )}
            {(!registrant || !registrant.countryInfo) && ('-')}
          </div>
          <span styleName="col" style={colorStyle}>
            { (registrant && !_.isNil(registrant.rating)) ? registrant.rating : '-'}
          </span>
          <a styleName="col" href={`${config.URL.BASE}/member-profile/${member}/develop`} target="_blank" rel="noopener noreferrer" style={colorStyle}>
            {member || '-'}
          </a>
        </div>
        <div styleName="col-3 col">
          <div styleName="col col-left">
            { (!_.isNil(finalScore)) ? finalScore : '-' }
          </div>
          <div styleName="col">
            { (!_.isNil(provisionalScore)) ? provisionalScore : '-' }
          </div>
          <div styleName="col time">
            {moment(submissionTime).format('DD MMM YYYY')} {moment(submissionTime).format('HH:mm:ss')}
          </div>
        </div>
        <div styleName="col-4 col">
          <a
            onClick={toggleHistory}
            onKeyPress={toggleHistory}
          >
            <span>
              <span styleName="text">
                History (
                {submissions.length}
                )
              </span>
              { openHistory ? (<ArrowNext styleName="icon down" />) : (<ArrowNext styleName="icon" />)}
            </span>
          </a>
        </div>
      </div>
      {openHistory
      && (
        <div styleName="history">
          <div>
            <div styleName="row no-border history-head">
              { isMM ? <div styleName="col-1 col" /> : null }
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
              <div styleName={`col-4 col ${isMM ? 'mm' : ''}`}>
                Time
              </div>
              {
                isMM && (
                  <div styleName="col-5 col">&nbsp;</div>
                )
              }
            </div>
          </div>
          {
            submissions.map((submissionHistory, index) => (
              <SubmissionHistoryRow
                isReviewPhaseComplete={isReviewPhaseComplete}
                isMM={isMM}
                submission={submissions.length - index}
                {...submissionHistory}
                key={submissionHistory.submissionId}
                onShowPopup={onShowPopup}
                member={member}
              />
            ))
          }
        </div>
      )
      }
    </div>
  );
}

SubmissionRow.defaultProps = {
  toggleHistory: () => {},
  colorStyle: {},
  score: {},
  isReviewPhaseComplete: false,
  finalRank: null,
  provisionalRank: null,
  registrant: null,
  getFlagFirstTry: () => (null),
  onGetFlagImageFail: () => {},
  finalScore: null,
  provisionalScore: null,
};

SubmissionRow.propTypes = {
  isMM: PT.bool.isRequired,
  openHistory: PT.bool.isRequired,
  member: PT.string.isRequired,
  submissions: PT.arrayOf(PT.shape({
    provisionalScore: PT.oneOfType([
      PT.string,
      PT.number,
    ]),
    initialScore: PT.number,
    submissionId: PT.string.isRequired,
    submissionTime: PT.string.isRequired,
  })).isRequired,
  score: PT.shape({
    final: PT.number,
    provisional: PT.number,
  }),
  registrant: PT.shape({
    rating: PT.number,
    countryInfo: PT.shape({
      name: PT.string,
    }),
  }),
  toggleHistory: PT.func,
  colorStyle: PT.shape(),
  isReviewPhaseComplete: PT.bool,
  finalRank: PT.number,
  provisionalRank: PT.number,
  finalScore: PT.number,
  provisionalScore: PT.number,
  onShowPopup: PT.func.isRequired,
  getFlagFirstTry: PT.func,
  onGetFlagImageFail: PT.func,
};
