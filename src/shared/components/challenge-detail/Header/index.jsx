/**
 * Challenge header component.
 * This component renders all other child components part of the header.
 * Any data massaging needed for a child view should be done here.
 */

import _ from 'lodash';
import moment from 'moment';
import 'moment-duration-format';

import PT from 'prop-types';
import React from 'react';
import { DangerButton, PrimaryButton } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';

import LeftArrow from 'assets/images/arrow-prev.svg';

import ArrowUp from '../../../../assets/images/icon-arrow-up.svg';
import ArrowDown from '../../../../assets/images/icon-arrow-down.svg';

import Prizes from './Prizes';
import ChallengeTags from './ChallengeTags';
import DeadlinesPanel from './DeadlinesPanel';
import TabSelector from './TabSelector';

import style from './style.scss';

/* Holds day and hour range in ms. */
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export default function ChallengeHeader(props) {
  const {
    challenge,
    challengesUrl,
    checkpoints,
    hasRegistered,
    numWinners,
    onSelectorClicked,
    onToggleDeadlines,
    registering,
    registerForChallenge,
    setChallengeListingFilter,
    unregisterFromChallenge,
    unregistering,
    challengeSubtracksMap,
    selectedView,
    showDeadlineDetail,
  } = props;

  const {
    drPoints,
    id: challengeId,
    name,
    subTrack,
    track,
    pointPrizes,
    events,
    technologies,
    platforms,
    prizes,
    numberOfCheckpointsPrizes,
    topCheckPointPrize,
    reliabilityBonus,
    userDetails,
    currentPhases,
    numRegistrants,
    numSubmissions,
    allPhases,
    status,
    appealsEndDate,
  } = challenge;

  const phases = {};
  if (allPhases) {
    allPhases.forEach((phase) => {
      phases[_.camelCase(phase.phaseType)] = phase;
    });
  }

  let registrationEnded = true;
  const regPhase = phases.registration;
  if (status !== 'COMPLETED' && regPhase) {
    registrationEnded = regPhase.phaseStatus !== 'Open';
  }

  const submissionEnded = status === 'COMPLETED'
    || (_.get(phases, 'submission.phaseStatus') !== 'Open'
      && _.get(phases, 'checkpointSubmission.phaseStatus') !== 'Open');

  let trackLower = track ? track.toLowerCase() : 'design';
  if (technologies.includes('Data Science')) {
    trackLower = 'data_science';
  }

  const eventNames = (events || []).map((event => (event.eventName || '').toUpperCase()));

  const miscTags = _.union(
    _.isArray(technologies) ? technologies : (technologies || '').split(', '),
    _.isArray(platforms) ? platforms : (platforms || '').split(', '),
  );

  let bonusType = '';
  if (numberOfCheckpointsPrizes && topCheckPointPrize) {
    bonusType = 'Bonus';
  } else if (reliabilityBonus && reliabilityBonus.toFixed() !== '0') {
    bonusType = 'Reliability Bonus';
  }

  /* userDetails.hasUserSubmittedForReview does not reset to false
   * if the user has deleted all of their submissions, so we have to
   * iterate through all their submissions and ensure that all of them
   * are Deleted
  */
  const hasSubmissions = userDetails && (userDetails.submissions || []).reduce((acc, submission) => acc || submission.status !== 'Deleted', false);

  let nextPhase = (currentPhases && currentPhases[0]) || {};
  if (hasRegistered && nextPhase.phaseType === 'Registration') {
    nextPhase = currentPhases[1] || {};
  }
  const nextDeadline = nextPhase.phaseType;

  const deadlineEnd = moment(nextPhase && nextPhase.scheduledEndTime);
  const currentTime = moment();

  let timeLeft = deadlineEnd.isAfter(currentTime)
    ? deadlineEnd.diff(currentTime) : 0;

  let format;
  if (timeLeft > DAY_MS) format = 'D[d] H[h]';
  else if (timeLeft > HOUR_MS) format = 'H[h] m[min]';
  else format = 'm[min] s[s]';

  timeLeft = moment.duration(timeLeft).format(format);

  let relevantPhases = [];

  if (showDeadlineDetail) {
    relevantPhases = (allPhases || []).filter((phase) => {
      if (phase.phaseType === 'Iterative Review') {
        const end = phase.actualEndTime || phase.scheduledEndTime;
        return moment(end).isAfter(moment());
      }
      const phaseLowerCase = phase.phaseType.toLowerCase();
      if (phaseLowerCase.includes('screening') || phaseLowerCase.includes('specification')) {
        return false;
      }
      if (phaseLowerCase.includes('registration') || phaseLowerCase.includes('checkpoint')
        || phaseLowerCase.includes('submission') || phaseLowerCase.includes('review')) {
        return true;
      }
      return false;
    });

    relevantPhases.sort((a, b) => {
      if (a.phaseType.toLowerCase().includes('registration')) {
        return -1;
      }
      if (b.phaseType.toLowerCase().includes('registration')) {
        return 1;
      }
      return (new Date(a.actualEndTime || a.scheduledEndTime)).getTime()
        - (new Date(b.actualEndTime || b.scheduledEndTime)).getTime();
    });
    if (subTrack === 'FIRST_2_FINISH' && status === 'COMPLETED') {
      const phases2 = allPhases.filter(p => p.phaseType === 'Iterative Review' && p.phaseStatus === 'Closed');
      const endPhaseDate = Math.max(...phases2.map(d => new Date(d.scheduledEndTime)));
      relevantPhases = _.filter(relevantPhases, p => (p.phaseType.toLowerCase().includes('registration')
        || new Date(p.scheduledEndTime).getTime() < endPhaseDate));
      relevantPhases.push({
        id: -1,
        phaseType: 'Winners',
        scheduledEndTime: endPhaseDate,
      });
    } else if (relevantPhases.length > 1 && appealsEndDate) {
      const lastPhase = relevantPhases[relevantPhases.length - 1];
      const lastPhaseTime = (
        new Date(lastPhase.actualEndTime || lastPhase.scheduledEndTime)
      ).getTime();
      const appealsEnd = (new Date(appealsEndDate).getTime());
      if (lastPhaseTime < appealsEnd) {
        relevantPhases.push({
          id: -1,
          phaseType: 'Winners',
          scheduledEndTime: appealsEndDate,
        });
      }
    }
  }

  const checkpointCount = checkpoints && checkpoints.numberOfUniqueSubmitters;

  let nextDeadlineMsg;
  switch ((status || '').toLowerCase()) {
    case 'active':
      nextDeadlineMsg = (
        <div styleName="next-deadline">
          Next Deadline:
          {' '}
          {
            <span styleName="deadline-highlighted">
              {nextDeadline || '-'}
            </span>
          }
        </div>
      );
      break;
    case 'completed':
      nextDeadlineMsg = (
        <div styleName="completed">
          The challenge is finished.
        </div>
      );
      break;
    default:
      nextDeadlineMsg = (
        <div>
          Status:
          &zwnj;
          {
            <span styleName="deadline-highlighted">
              {_.upperFirst(_.lowerCase(status))}
            </span>
          }
        </div>
      );
      break;
  }

  // Legacy MMs have a roundId field, but new MMs do not.
  // This is used to disable registration/submission for legacy MMs.
  const isLegacyMM = subTrack === 'MARATHON_MATCH' && Boolean(challenge.roundId);

  return (
    <div styleName="challenge-outer-container">
      <div styleName="important-detail">
        <div styleName="title-wrapper">
          <Link to={challengesUrl}>
            <LeftArrow styleName="left-arrow" />
          </Link>
          <div>
            <h1 styleName="challenge-header">
              {name}
            </h1>
            <ChallengeTags
              subTrack={subTrack}
              track={trackLower}
              challengesUrl={challengesUrl}
              challengeSubtracksMap={challengeSubtracksMap}
              events={eventNames}
              technPlatforms={miscTags}
              setChallengeListingFilter={setChallengeListingFilter}
            />
          </div>
        </div>
        <div styleName="prizes-ops-container">
          <div styleName="prizes-outer-container">
            <h3 styleName="prizes-title">
PRIZES
            </h3>
            <Prizes prizes={prizes && prizes.length ? prizes : [0]} pointPrizes={pointPrizes} />
            {
              bonusType ? (
                <div id={`bonus-${trackLower}`} styleName="bonus-div">
                  {
                    bonusType === 'Bonus'
                      ? (
                        <p styleName="bonus-text">
                          <span styleName={`bonus-highlight ${trackLower}-accent-color`}>
                          BONUS:
                            {' '}
                            {numberOfCheckpointsPrizes}
                          </span>
                        &zwnj;
                        CHECKPOINTS AWARDED WORTH
                        &zwnj;
                          <span
                            styleName={`bonus-highlight ${trackLower}-accent-color`}
                          >
                          $
                            {topCheckPointPrize}
                          </span>
                        &zwnj;
                        EACH
                        </p>
                      )
                      : (
                        <p styleName="bonus-text">
                          <span styleName={`bonus-highlight ${trackLower}-accent-color`}>
                          RELIABILITY BONUS: $
                            {reliabilityBonus.toFixed()}
                          </span>
                        </p>
                      )
                  }
                </div>
              ) : null
            }
            {
              drPoints ? (
                <div styleName="bonus-div">
                  <p styleName="bonus-text">
                    <span styleName={`bonus-highlight ${trackLower}-accent-color`}>
POINTS:
                      {drPoints}
                    </span>
                  </p>
                </div>
              ) : null
            }
          </div>
          <div styleName="challenge-ops-wrapper">
            <div styleName="challenge-ops-container">
              {hasRegistered ? (
                <DangerButton
                  disabled={unregistering || registrationEnded
                  || hasSubmissions || isLegacyMM}
                  forceA
                  onClick={unregisterFromChallenge}
                  theme={{ button: style.challengeAction }}
                >
Unregister
                </DangerButton>
              ) : (
                <PrimaryButton
                  disabled={registering || registrationEnded || isLegacyMM}
                  forceA
                  onClick={registerForChallenge}
                  theme={{ button: style.challengeAction }}
                >
Register
                </PrimaryButton>
              )}
              <PrimaryButton
                disabled={!hasRegistered || unregistering || submissionEnded || isLegacyMM}
                theme={{ button: style.challengeAction }}
                to={`${challengesUrl}/${challengeId}/submit`}
              >
Submit
              </PrimaryButton>
              {
                track === 'DESIGN' && hasRegistered && !unregistering
                && hasSubmissions && (
                  <PrimaryButton
                    theme={{ button: style.challengeAction }}
                    to={`${challengesUrl}/${challengeId}/my-submissions`}
                  >
View Submissions
                  </PrimaryButton>
                )
              }
            </div>
          </div>
        </div>
        <div styleName="deadlines-view">
          <div styleName="deadlines-overview">
            <div styleName="deadlines-overview-text">
              {nextDeadlineMsg}
              {
                (status || '').toLowerCase() === 'active'
                && (
                <div styleName="current-phase">
                  <span styleName="deadline-highlighted">
                    {timeLeft}
                  </span>
                  {' '}
until current deadline ends
                </div>
                )
              }
            </div>
            <a
              onClick={onToggleDeadlines}
              onKeyPress={onToggleDeadlines}
              role="button"
              styleName="deadlines-collapser"
              tabIndex={0}
            >
              {showDeadlineDetail
                ? (
                  <span styleName="collapse-text">
Hide Deadlines
                    <ArrowDown />
                  </span>
                )
                : (
                  <span styleName="collapse-text">
Show Deadlines
                    <ArrowUp />
                  </span>
                )
              }
            </a>
          </div>
          {
            showDeadlineDetail
            && <DeadlinesPanel deadlines={relevantPhases} />
          }
        </div>
        <TabSelector
          challenge={challenge}
          onSelectorClicked={onSelectorClicked}
          trackLower={trackLower}
          selectedView={selectedView}
          numRegistrants={numRegistrants}
          numWinners={numWinners}
          hasCheckpoints={checkpoints && checkpoints.length > 0}
          numSubmissions={numSubmissions}
          hasRegistered={hasRegistered}
          checkpointCount={checkpointCount}
        />
      </div>
    </div>
  );
}

ChallengeHeader.defaultProps = {
  checkpoints: {},
};

ChallengeHeader.propTypes = {
  checkpoints: PT.shape(),
  challenge: PT.shape({
    id: PT.number.isRequired,
  }).isRequired,
  challengesUrl: PT.string.isRequired,
  hasRegistered: PT.bool.isRequired,
  numWinners: PT.number.isRequired,
  onSelectorClicked: PT.func.isRequired,
  onToggleDeadlines: PT.func.isRequired,
  registerForChallenge: PT.func.isRequired,
  registering: PT.bool.isRequired,
  selectedView: PT.string.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showDeadlineDetail: PT.bool.isRequired,
  unregisterFromChallenge: PT.func.isRequired,
  unregistering: PT.bool.isRequired,
  challengeSubtracksMap: PT.shape().isRequired,
};
