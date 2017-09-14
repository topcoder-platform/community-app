import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import LeaderboardAvatar from 'components/LeaderboardAvatar';
import { Link } from 'react-router-dom';
import { DETAIL_TABS } from 'actions/challenge';

import ChallengeProgressBar from '../../ChallengeProgressBar';
import ProgressBarTooltip from '../../Tooltips/ProgressBarTooltip';
import UserAvatarTooltip from '../../Tooltips/UserAvatarTooltip';
import ForumIcon from '../../Icons/forum.svg';
import './style.scss';

import NumRegistrants from '../NumRegistrants';
import NumSubmissions from '../NumSubmissions';

// Constants
const MAX_VISIBLE_WINNERS = 3;
const STALLED_MSG = 'Stalled';
const DRAFT_MSG = 'In Draft';
const STALLED_TIME_LEFT_MSG = 'Challenge is currently on hold';
const FF_TIME_LEFT_MSG = 'Winner is working on fixes';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const getTimeLeft = (date, currentPhase) => {
  if (!currentPhase || currentPhase === 'Stalled') {
    return {
      late: false,
      text: STALLED_TIME_LEFT_MSG,
    };
  } else if (currentPhase === 'Final Fix') {
    return {
      late: false,
      text: FF_TIME_LEFT_MSG,
    };
  }

  let time = moment(date).diff();
  const late = time < 0;
  if (late) time = -time;

  let format;
  if (time > DAY_MS) format = 'DDD[d] H[h]';
  else if (time > HOUR_MS) format = 'H[h] m[min]';
  else format = 'm[min] s[s]';

  time = moment(time).format(format);
  time = late ? `Late by ${time}` : `${time} to go`;
  return { late, text: time };
};

const getStatusPhase = (challenge) => {
  const { currentPhases } = challenge;
  const currentPhase = currentPhases.length > 0 ? currentPhases[0] : '';
  const currentPhaseName = currentPhase ? currentPhase.phaseType : '';
  switch (currentPhaseName) {
    case 'Registration': {
      if (challenge.checkpointSubmissionEndDate && !getTimeLeft(challenge.checkpointSubmissionEndDate, 'Checkpoint').late) {
        return {
          currentPhaseName: 'Checkpoint',
          currentPhaseEndDate: challenge.checkpointSubmissionEndDate,
        };
      }

      return {
        currentPhaseName: 'Submission',
        currentPhaseEndDate: challenge.submissionEndDate,
      };
    }
    case 'Submission': {
      if (challenge.checkpointSubmissionEndDate && !getTimeLeft(challenge.checkpointSubmissionEndDate, 'Checkpoint').late) {
        return {
          currentPhaseName: 'Checkpoint',
          currentPhaseEndDate: challenge.checkpointSubmissionEndDate,
        };
      }

      return {
        currentPhaseName: 'Submission',
        currentPhaseEndDate: challenge.submissionEndDate,
      };
    }
    default:
      return {
        currentPhaseName,
        currentPhaseEndDate: currentPhase.scheduledEndTime,
      };
  }
};

const getTimeToGo = (start, end) => {
  const percentageComplete = (
    (moment() - moment(start)) / (moment(end) - moment(start))
  ) * 100;
  return (Math.round(percentageComplete * 100) / 100);
};


/**
 * Returns an user profile object as expected by the UserAvatarTooltip
 * @param {String} handle
 */
function getProfile(user) {
  const { handle, placement } = user;
  const photoLink = user.photoURL;
  return {
    handle,
    placement,
    country: '',
    memberSince: '',
    photoLink,
    ratingSummary: [],
  };
}

export default function ChallengeStatus(props) {
  const FORUM_URL = `${config.URL.FORUMS}/?module=Category&categoryID=`;

  const {
    challengesUrl,
    newChallengeDetails,
    selectChallengeDetailsTab,
  } = props;

  /* TODO: Split into a separate ReactJS component! */
  function renderLeaderboard() {
    const {
      challenge,
      detailLink,
      openChallengesInNewTabs,
    } = props;

    let winners = challenge.winners && challenge.winners.filter(winner => winner.type === 'final')
      .map(winner => ({
        handle: winner.handle,
        position: winner.placement,
        photoURL: winner.photoURL,
      }));

    if (winners && winners.length > MAX_VISIBLE_WINNERS) {
      const lastItem = {
        handle: `+${winners.length - MAX_VISIBLE_WINNERS}`,
        isLastItem: true,
      };
      winners = winners.slice(0, MAX_VISIBLE_WINNERS);
      winners.push(lastItem);
    }
    const leaderboard = winners && winners.map((winner) => {
      if (winner.isLastItem) {
        return (
          /* TODO: No, should not reuse avatar for displaying "+1" in
           * a circle. Should be a separate component for that. */
          <LeaderboardAvatar
            key={winner.handle}
            member={winner}
            onClick={() => (
              setImmediate(() => selectChallengeDetailsTab(
                DETAIL_TABS.WINNERS,
              ))
            )}
            openNewTab={openChallengesInNewTabs}
            url={detailLink}
            plusOne
          />
        );
      }
      const userProfile = getProfile(winner);
      return (
        <div styleName="avatar-container" key={winner.handle}>
          <UserAvatarTooltip user={userProfile}>
            <LeaderboardAvatar member={winner} />
          </UserAvatarTooltip>
        </div>);
    });
    return leaderboard || (
      <Link
        onClick={() => (
          setImmediate(() => selectChallengeDetailsTab(DETAIL_TABS.SUBMISSIONS))
        )}
        to={detailLink}
      >Results</Link>
    );
  }

  function renderRegisterButton() {
    const {
      challenge,
      detailLink,
      openChallengesInNewTabs,
    } = props;
    const timeDiff = getTimeLeft(
      challenge.registrationEndDate || challenge.submissionEndDate,
      challenge.currentPhases[0] ? challenge.currentPhases[0].phaseType : '',
    );
    let timeNote = timeDiff.text;
    /* TODO: This is goofy, makes the trick, but should be improved. The idea
     * here is that the standard "getTimeLeft" method, for positive times,
     * generates a string like "H MM to go"; here we want to render just
     * H MM part, so we cut the last 6 symbols. Not a good code. */
    if (!timeDiff.late) {
      timeNote = timeNote.substring(0, timeNote.length - 6);
    }
    return (
      <a
        href={detailLink}
        onClick={() => false}
        styleName="register-button"
        target={openChallengesInNewTabs ? '_blank' : undefined}
      >
        <span>
          { timeNote }
        </span>
        <span styleName="to-register">to register</span>
      </a>
    );
  }

  /* TODO: Here is many code common with activeChallenge (the difference is that
   * one component renders leaderboard gallery in the place where another one
   * renders the timeline). The code should be refactored to avoid dublicating
   * the common code being used in both places. */
  function completedChallenge() {
    const { challenge } = props;
    return (
      <div>
        {renderLeaderboard()}
        <span styleName="challenge-stats">
          <NumRegistrants
            challenge={challenge}
            challengesUrl={challengesUrl}
            newChallengeDetails={newChallengeDetails}
            selectChallengeDetailsTab={selectChallengeDetailsTab}
          />
          <NumSubmissions
            challenge={challenge}
            challengesUrl={challengesUrl}
            newChallengeDetails={newChallengeDetails}
            selectChallengeDetailsTab={selectChallengeDetailsTab}
          />
          {
            challenge.myChallenge &&
            <span>
              <a styleName="link-forum past" href={`${FORUM_URL}${challenge.forumId}`}><ForumIcon /></a>
            </span>
          }
        </span>
      </div>
    );
  }

  function activeChallenge() {
    const { challenge } = props;

    const registrationPhase = challenge.allPhases.filter(phase => phase.phaseType === 'Registration')[0];
    const isRegistrationOpen = registrationPhase ? registrationPhase.phaseStatus === 'Open' : false;
    const currentPhaseName = challenge.currentPhases && challenge.currentPhases.length > 0;

    let phaseMessage = STALLED_MSG;
    if (currentPhaseName) {
      phaseMessage = getStatusPhase(challenge).currentPhaseName;
    } else if (challenge.status === 'DRAFT') {
      phaseMessage = DRAFT_MSG;
    }
    return (
      <div styleName={isRegistrationOpen ? 'challenge-progress with-register-button' : 'challenge-progress'}>
        <span styleName="current-phase">
          { phaseMessage }
        </span>
        <span styleName="challenge-stats">
          <NumRegistrants
            challenge={challenge}
            challengesUrl={challengesUrl}
            newChallengeDetails={newChallengeDetails}
            selectChallengeDetailsTab={selectChallengeDetailsTab}
          />
          <NumSubmissions
            challenge={challenge}
            challengesUrl={challengesUrl}
            newChallengeDetails={newChallengeDetails}
            selectChallengeDetailsTab={selectChallengeDetailsTab}
          />
          {
            challenge.myChallenge &&
            <span>
              <a styleName="link-forum" href={`${FORUM_URL}${challenge.forumId}`}>
                <ForumIcon />
              </a>
            </span>
          }
        </span>
        <ProgressBarTooltip challenge={challenge}>
          {
            challenge.status === 'ACTIVE' && challenge.currentPhases.length > 0 ?
              <div>
                <ChallengeProgressBar
                  color="green"
                  value={
                    getTimeToGo(
                      challenge.registrationStartDate,
                      getStatusPhase(challenge).currentPhaseEndDate,
                    )
                  }
                  isLate={
                    getTimeLeft(
                      getStatusPhase(challenge).currentPhaseEndDate,
                      getStatusPhase(challenge).currentPhaseName,
                    ).late
                  }
                />
                <div styleName="time-left">
                  {
                    getTimeLeft(
                      getStatusPhase(challenge).currentPhaseEndDate,
                      getStatusPhase(challenge).currentPhaseName,
                    ).text
                  }
                </div>
              </div>
              :
              <ChallengeProgressBar color="gray" value="100" />
          }
        </ProgressBarTooltip>
        {isRegistrationOpen && renderRegisterButton()}
      </div>
    );
  }

  const { challenge } = props;
  const status = challenge.status === 'COMPLETED' ? 'completed' : '';
  return (
    <div styleName={`challenge-status ${status}`}>
      {challenge.status === 'COMPLETED' ? completedChallenge() : activeChallenge()}
    </div>
  );
}

ChallengeStatus.defaultProps = {
  challenge: {},
  detailLink: '',
  openChallengesInNewTabs: false,
};

ChallengeStatus.propTypes = {
  challenge: PT.shape(),
  challengesUrl: PT.string.isRequired,
  detailLink: PT.string,
  newChallengeDetails: PT.bool.isRequired,
  openChallengesInNewTabs: PT.bool,
  selectChallengeDetailsTab: PT.func.isRequired,
};
