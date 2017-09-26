/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Challenge header component.
 * This component renders all other child components part of the header.
 * Any data massaging needed for a child view should be done here.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { DangerButton, PrimaryButton } from 'components/buttons';
import { ThemeProvider } from 'react-css-super-themr';

import ArrowUp from '../../../../assets/images/icon-arrow-up.svg';
import ArrowDown from '../../../../assets/images/icon-arrow-down.svg';
import themeFactory from '../themeFactory';

import Prizes from './Prizes';
import ChallengeTags from './ChallengeTags';
import DeadlineCards from './DeadlineCards';
import TabSelector from './TabSelector';

import style from './style.scss';

export default function ChallengeHeader(props) {
  const {
    challenge,
    challengesUrl,
    checkpoints,
    hasRegistered,
    numWinners,
    registering,
    registerForChallenge,
    setChallengeListingFilter,
    unregisterFromChallenge,
    unregistering,
    challengeSubtracksMap,
  } = props;

  const {
    drPoints,
    id: challengeId,
    name,
    track,
    subTrack,
    events,
    technologies,
    platforms,
    prizes,
    numberOfCheckpointsPrizes,
    topCheckPointPrize,
    reliabilityBonus,
    userDetails,
    currentPhases,
    registrationEndDate,
    submissionEndDate,
    numRegistrants,
    numSubmissions,
    allPhases,
    status,
    appealsEndDate,
  } = challenge;

  let trackLower = track ? track.toLowerCase() : 'design';
  if (technologies.includes('Data Science')) {
    trackLower = 'datasci';
  }

  const theme = themeFactory(trackLower);
  const eventNames = (events || []).map((event => (event.eventName || '').toUpperCase()));
  const miscTags = _.union((technologies || '').split(', '), platforms.split(', '));

  let bonusType = '';
  if (numberOfCheckpointsPrizes && topCheckPointPrize) {
    bonusType = 'Bonus';
  } else if (reliabilityBonus) {
    bonusType = 'Reliability Bonus';
  }
  const registrationEnded = new Date(registrationEndDate).getTime() < Date.now() || status.toLowerCase() !== 'active';
  const submissionEnded = new Date(submissionEndDate).getTime() < Date.now();
  const hasSubmissions = userDetails && userDetails.hasUserSubmittedForReview;
  const nextPhaseIndex = hasRegistered ? 1 : 0;
  const nextDeadline = currentPhases.length > 0 && currentPhases[nextPhaseIndex].phaseType;
  const deadlineEnd = currentPhases && currentPhases.length > 0 ?
    new Date(currentPhases[nextPhaseIndex].scheduledEndTime).getTime() : Date.now();
  const currentTime = Date.now();
  const timeDiff = deadlineEnd > currentTime ? deadlineEnd - currentTime : 0;
  const duration = moment.duration(timeDiff);
  const timeLeft = `${duration.days()}d ${duration.hours()}:${duration.minutes()}h`;
  let relevantPhases = [];

  if (props.showDeadlineDetail) {
    relevantPhases = (allPhases || []).filter((phase) => {
      const phaseLowerCase = phase.phaseType.toLowerCase();
      if (phaseLowerCase.includes('screening') || phaseLowerCase.includes('specification')) {
        return false;
      }
      if (phaseLowerCase.includes('registration') || phaseLowerCase.includes('checkpoint') ||
        phaseLowerCase.includes('submission') || phaseLowerCase.includes('review')) {
        return true;
      }
      return false;
    });

    relevantPhases.push({
      phaseType: 'Registration',
      scheduledEndTime: registrationEndDate,
    });

    relevantPhases.sort((a, b) => {
      if (a.phaseType.toLowerCase().includes('registration')) {
        return -1;
      }
      if (b.phaseType.toLowerCase().includes('registration')) {
        return 1;
      }
      return (new Date(a.actualEndTime || a.scheduledEndTime)).getTime() -
        (new Date(b.actualEndTime || b.scheduledEndTime)).getTime();
    });
    if (subTrack === 'FIRST_2_FINISH' && status === 'COMPLETED') {
      const phases = allPhases.filter(p => p.phaseType === 'Iterative Review' && p.phaseStatus === 'Closed');
      const endPhaseDate = Math.max(...phases.map(d => new Date(d.scheduledEndTime)));
      relevantPhases = _.filter(relevantPhases, p => (p.phaseType.toLowerCase().includes('registration') ||
        new Date(p.scheduledEndTime).getTime() < endPhaseDate));
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
          Next Deadline: <span styleName="deadline-highlighted">
            {nextDeadline || '-'}</span>
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
          Status: <span styleName="deadline-highlighted">{
            _.capitalize(status)}</span>
        </div>
      );
      break;
  }

  return (
    <ThemeProvider theme={theme} >
      <div styleName="challenge-outer-container">
        <div styleName="important-detail">
          <h1 styleName="challenge-header">{name}</h1>
          <ChallengeTags
            subTrack={subTrack}
            challengesUrl={challengesUrl}
            challengeSubtracksMap={challengeSubtracksMap}
            events={eventNames}
            technPlatforms={miscTags}
            setChallengeListingFilter={setChallengeListingFilter}
          />
          <div styleName="prizes-ops-container">
            <div styleName="prizes-outer-container">
              <h3 styleName="prizes-title">PRIZES</h3>
              <Prizes prizes={prizes && prizes.length ? prizes : [0]} />
              {
                bonusType ? (
                  <div id={`bonus-${trackLower}`} styleName="bonus-div">
                    {
                      bonusType === 'Bonus' ?
                        <p styleName="bonus-text">
                          <span styleName={`bonus-highlight ${trackLower}-accent-color`}>
                            BONUS: {numberOfCheckpointsPrizes} </span>CHECKPOINTS AWARDED
                            WORTH <span styleName={`bonus-highlight ${trackLower}-accent-color`}>${topCheckPointPrize} </span>EACH
                        </p> :
                        <p styleName="bonus-text">
                          <span styleName={`bonus-highlight ${trackLower}-accent-color`}>
                            RELIABILITY BONUS: $ {reliabilityBonus}
                          </span>
                        </p>
                    }
                  </div>
                ) : null
              }
              {
                drPoints ? (
                  <div styleName="bonus-div">
                    <p styleName="bonus-text">
                      <span styleName={`bonus-highlight ${trackLower}-accent-color`}>POINTS: {drPoints}</span>
                    </p>
                  </div>
                ) : null
              }
            </div>
            <div styleName="challenge-ops-wrapper">
              <div styleName="challenge-ops-container">
                {hasRegistered ? (
                  <DangerButton
                    disabled={unregistering || registrationEnded}
                    onClick={unregisterFromChallenge}
                    theme={{ button: style.challengeAction }}
                  >Unregister</DangerButton>
                ) : (
                  <PrimaryButton
                    disabled={registering || registrationEnded}
                    onClick={registerForChallenge}
                    theme={{ button: style.challengeAction }}
                  >Register</PrimaryButton>
                )}
                <PrimaryButton
                  disabled={!hasRegistered || unregistering || submissionEnded}
                  theme={{ button: style.challengeAction }}
                  to={`/challenges/${challengeId}/submit/file`}
                >Submit</PrimaryButton>
                <PrimaryButton
                  disabled={!hasRegistered || unregistering || !hasSubmissions}
                  theme={{ button: style.challengeAction }}
                  to={`${challengesUrl}/${challengeId}/my-submissions`}
                >View Submissions</PrimaryButton>
              </div>
            </div>
          </div>
          <div styleName="deadlines-view">
            <div styleName="deadlines-overview">
              <div styleName="deadlines-overview-text">
                {nextDeadlineMsg}
                {
                  (status || '').toLowerCase() === 'active' &&
                  <div styleName="current-phase">
                    <span styleName="deadline-highlighted">
                      {timeLeft}
                    </span> until current deadline ends
                  </div>
                }
              </div>
              <a onClick={props.onToggleDeadlines} styleName="deadlines-collapser">
                {props.showDeadlineDetail ?
                  <span styleName="collapse-text">Hide Deadlines <ArrowDown /></span>
                  : <span styleName="collapse-text">Show Deadlines <ArrowUp /></span>
                }
              </a>
            </div>
            {
              props.showDeadlineDetail &&
              <DeadlineCards relevantPhases={relevantPhases} />
            }
          </div>
          <TabSelector
            challenge={challenge}
            onSelectorClicked={props.onSelectorClicked}
            trackLower={trackLower}
            selectedView={props.selectedView}
            numRegistrants={numRegistrants}
            numWinners={numWinners}
            status={status}
            hasCheckpoints={checkpoints && checkpoints.length > 0}
            numSubmissions={numSubmissions}
            hasRegistered={hasRegistered}
            checkpointCount={checkpointCount}
          />
        </div>
      </div>
    </ThemeProvider>
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
