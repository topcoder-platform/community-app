import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import LeaderboardAvatar from 'components/challenge-listing/LeaderboardAvatar';
import { config, Link } from 'topcoder-react-utils';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import 'moment-duration-format';

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

/**
 * Generates human-readable string containing time till the phase end.
 * @param {Object} phase
 * @return {String}
 */
const getTimeLeft = (phase) => {
  if (!phase) return { late: false, text: STALLED_TIME_LEFT_MSG };
  if (phase.phaseType === 'Final Fix') {
    return { late: false, text: FF_TIME_LEFT_MSG };
  }

  let time = moment(phase.scheduledEndTime).diff();
  const late = time < 0;
  if (late) time = -time;

  let format;
  if (time > DAY_MS) format = 'D[d] H[h]';
  else if (time > HOUR_MS) format = 'H[h] m[min]';
  else format = 'm[min] s[s]';

  time = moment.duration(time).format(format);
  time = late ? `Late by ${time}` : `${time} to go`;
  return { late, text: time };
};

/**
 * Calculates progress of the specified phase (as a percentage).
 * @param {Object} phase
 * @return {Number}
 */
function getPhaseProgress(phase) {
  const end = moment(phase.scheduledEndTime);
  const start = moment(phase.actualStartTime);
  return 100 * (moment().diff(start) / end.diff(start));
}

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
    userHandle,
  } = props;

  /* TODO: Split into a separate ReactJS component! */
  function renderLeaderboard() {
    const {
      challenge,
      detailLink,
      openChallengesInNewTabs,
    } = props;

    let winners = _.map(
      challenge.winners,
      winner => ({
        handle: winner.handle,
        position: winner.placement,
        photoURL: winner.photoURL,
      }),
    );

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
              setImmediate(() => selectChallengeDetailsTab(DETAIL_TABS.WINNERS))
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
        </div>
      );
    });

    return leaderboard || (
      <Link
        onClick={() => (
          setImmediate(() => selectChallengeDetailsTab(DETAIL_TABS.SUBMISSIONS))
        )}
        to={detailLink}
      >
Results
      </Link>
    );
  }

  function renderRegisterButton() {
    const {
      challenge,
      detailLink,
      openChallengesInNewTabs,
    } = props;
    const timeDiff = getTimeLeft(challenge.allPhases.find(p => p.phaseType === 'Registration'));
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
        <span styleName="to-register">
to register
        </span>
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
          <div styleName="spacing">
            <NumRegistrants
              challenge={challenge}
              challengesUrl={challengesUrl}
              newChallengeDetails={newChallengeDetails}
              selectChallengeDetailsTab={selectChallengeDetailsTab}
            />
          </div>
          <div styleName="spacing">
            <NumSubmissions
              challenge={challenge}
              challengesUrl={challengesUrl}
              newChallengeDetails={newChallengeDetails}
              selectChallengeDetailsTab={selectChallengeDetailsTab}
            />
          </div>
          {
            challenge.myChallenge
            && (
            <div styleName="spacing">
              <a styleName="link-forum past" href={`${FORUM_URL}${challenge.forumId}`}>
                <ForumIcon />
              </a>
            </div>
            )
          }
        </span>
      </div>
    );
  }

  function activeChallenge() {
    const { challenge } = props;
    const {
      allPhases,
      currentPhases,
      forumId,
      myChallenge,
      status,
      subTrack,
    } = challenge;

    const checkPhases = (currentPhases && currentPhases.length > 0 ? currentPhases : allPhases);
    let statusPhase = checkPhases
      .filter(p => p.phaseType !== 'Registration')
      .sort((a, b) => moment(a.scheduledEndTime).diff(b.scheduledEndTime))[0];

    if (!statusPhase && subTrack === 'FIRST_2_FINISH' && checkPhases.length) {
      statusPhase = _.clone(checkPhases[0]);
      statusPhase.phaseType = 'Submission';
    }

    const registrationPhase = allPhases
      .find(p => p.phaseType === 'Registration');
    const isRegistrationOpen = registrationPhase
      && (registrationPhase.phaseStatus === 'Open' || moment(registrationPhase.scheduledEndTime).diff(new Date()) > 0);

    let phaseMessage = STALLED_MSG;
    if (statusPhase) phaseMessage = statusPhase.phaseType;
    else if (status === 'DRAFT') phaseMessage = DRAFT_MSG;

    const showRegisterInfo = isRegistrationOpen && !challenge.users[userHandle];

    return (
      <div styleName={showRegisterInfo ? 'challenge-progress with-register-button' : 'challenge-progress'}>
        <span styleName="current-phase">
          { phaseMessage }
        </span>
        <span styleName="challenge-stats">
          <div styleName="spacing">
            <NumRegistrants
              challenge={challenge}
              challengesUrl={challengesUrl}
              newChallengeDetails={newChallengeDetails}
              selectChallengeDetailsTab={selectChallengeDetailsTab}
            />
          </div>
          <div styleName="spacing">
            <NumSubmissions
              challenge={challenge}
              challengesUrl={challengesUrl}
              newChallengeDetails={newChallengeDetails}
              selectChallengeDetailsTab={selectChallengeDetailsTab}
            />
          </div>
          {
            myChallenge
            && (
            <div styleName="spacing">
              <a styleName="link-forum" href={`${FORUM_URL}${forumId}`}>
                <ForumIcon />
              </a>
            </div>
            )
          }
        </span>
        <ProgressBarTooltip challenge={challenge}>
          {
            status === 'ACTIVE' && statusPhase ? (
              <div>
                <ChallengeProgressBar
                  color="green"
                  value={getPhaseProgress(statusPhase)}
                  isLate={moment().isAfter(statusPhase.scheduledEndTime)}
                />
                <div styleName="time-left">
                  {getTimeLeft(statusPhase).text}
                </div>
              </div>
            ) : <ChallengeProgressBar color="gray" value="100" />
          }
        </ProgressBarTooltip>
        {showRegisterInfo && renderRegisterButton()}
      </div>
    );
  }

  const { challenge } = props;
  const completed = challenge.status === 'COMPLETED';
  const status = completed ? 'completed' : '';
  return (
    <div styleName={`challenge-status ${status}`}>
      {completed ? completedChallenge() : activeChallenge()}
    </div>
  );
}

ChallengeStatus.defaultProps = {
  challenge: {},
  detailLink: '',
  openChallengesInNewTabs: false,
  userHandle: '',
};

ChallengeStatus.propTypes = {
  challenge: PT.shape(),
  challengesUrl: PT.string.isRequired,
  detailLink: PT.string, // eslint-disable-line react/no-unused-prop-types
  newChallengeDetails: PT.bool.isRequired,
  openChallengesInNewTabs: PT.bool, // eslint-disable-line react/no-unused-prop-types
  selectChallengeDetailsTab: PT.func.isRequired,
  userHandle: PT.string,
};
