/* eslint-disable react/prop-types */
import React from 'react';
import { config } from 'topcoder-react-utils';
import PT from 'prop-types';
import _ from 'lodash';

import { formatDate } from 'utils/tc';
import WinIcon from 'assets/images/profile/win-icon.svg';
import NotWinIcon from 'assets/images/profile/not-win-icon.svg';

import './styles.scss';

const ChallengeTable = ({ challenges, handle, hideChallengeResult }) => {
  const percentage = x => `${Math.round(x * 100)}%`;

  const getPlacementPostfix = (x) => {
    switch (x) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const isDataScience = track => track === 'Data Science' || track === 'DATA_SCIENCE';

  const Participant = ({ track }) => {
    const text = isDataScience(track) ? 'Participant' : 'Submitter';
    return (
      <div styleName="bar participant">
        <span>{'   '}</span>
        <NotWinIcon />
        <span styleName="text">{ text }</span>
        <span>{'   '}</span>
      </div>
    );
  };

  const Placement = ({ track, placement, pointTotal }) => {
    const text = isDataScience(track) ? 'Placement' : 'Winner';
    const place = isDataScience(track) ? `${pointTotal || 0} Point`
      : `${placement}${getPlacementPostfix(placement)} Place`;
    return (
      <div styleName="bar placement">
        <span>{'   '}</span>
        <WinIcon />
        <span styleName="text">{ text }</span>
        <span styleName="place">{ place }</span>
        <span>{'   '}</span>
      </div>
    );
  };

  const getSafeName = (name) => {
    if (window.innerWidth < 900) return name;
    return name.length < 70 ? name : _.concat(name.substring(0, 67), '...');
  };

  const getSubmissionEndDate = phases => phases.find(phase => phase.name === 'Submission')
    .actualEndDate;

  const getSafeEndDate = endDate => endDate || '2000-01-01T00:00:00.000Z';

  const formatDateSafe = endDate => formatDate(getSafeEndDate(endDate));

  return (
    <table styleName="challenges">
      <tbody>
        { challenges.map((challenge, index) => {
          const {
            isPrivate,
            id,
            name,
            submissionEndDate,
            userDetails,
            track,
            subTrack,
            winners,
            rounds,
            phases,
            pointTotal,
          } = challenge;

          // NOTE: cannot fetch winners of SRM challenge
          const winner = winners && winners.find(winer => winer.handle === handle);

          return (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={index} styleName={`${index % 2 === 1 ? 'odd' : 'even'}`}>
              <td styleName="challenge-info">
                {/* eslint-disable-next-line no-nested-ternary */}
                { !isPrivate
                  ? (subTrack === 'SRM' ? (
                    <a href={`${config.URL.COMMUNITY}/stat?c=round_overview&rd=${id}`} styleName="challenge-name">
                      <span>
                        { getSafeName(name) }
                      </span>
                    </a>
                  )
                    : (
                      <a href={`/challenges/${id}`} styleName="challenge-name">
                        <span>
                          { getSafeName(name) }
                        </span>
                      </a>
                    )
                  )
                  : (
                    <span styleName="challenge-name">
                      { getSafeName(name) }
                    </span>
                  )}
                <span styleName="challenge-date">
                  { submissionEndDate && formatDate(submissionEndDate) }
                  { !submissionEndDate && rounds && formatDateSafe(rounds[0].codingEndAt) }
                  { !submissionEndDate && !rounds && phases
                    && formatDateSafe(getSubmissionEndDate(phases)) }
                </span>
              </td>
              <td styleName={`challenge-result ${hideChallengeResult ? 'hidden' : ''}`}>
                { track !== 'DESIGN' && userDetails
                  && (userDetails.submissionReviewScore || userDetails.submissionReviewScore === 0)
                  && (
                    <span styleName="score">
                      { 'Review Score: ' }
                      <bold>
                        { percentage(userDetails.submissionReviewScore / 100) }
                      </bold>
                    </span>
                  )}
                {!winner && <Participant track={track} />}
                {!!winner && (
                  <Placement track={track} placement={winner.placement} pointTotal={pointTotal} />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

ChallengeTable.defaultProps = {
  challenges: [],
};

ChallengeTable.propTypes = {
  challenges: PT.arrayOf(PT.shape()),
};

export default ChallengeTable;
