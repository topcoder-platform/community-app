/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Challenge header component.
 * This component renders all other child components part of the header.
 * Any data massaging needed for a child view should be done here.
 */

import config from 'utils/config';
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { DangerButton, PrimaryButton } from 'components/buttons';
import { ThemeProvider } from 'react-css-themr';

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
    checkpoints,
    hasRegistered,
    registering,
    registerForChallenge,
    setChallengeListingFilter,
    unregisterFromChallenge,
    unregistering,
    challengeSubtracksMap,
  } = props;

  const {
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

  const subTrackStyle = `${trackLower}-accent-background`;
  const eventStyle = `${trackLower}-accent-color`;
  const eventNames = (events || []).map((event => (event.eventName || '').toUpperCase()));
  const miscTags = _.union((technologies || '').split(', '), platforms.split(', '));

  let bonusType = '';
  if (numberOfCheckpointsPrizes && topCheckPointPrize) {
    bonusType = 'Bonus';
  } else if (reliabilityBonus) {
    bonusType = 'Reliability Bonus';
  }
  const registrationEnded = new Date(registrationEndDate).getTime() < Date.now();
  const submissionEnded = new Date(submissionEndDate).getTime() < Date.now();
  const hasSubmissions = userDetails && userDetails.hasUserSubmittedForReview;
  const nextDeadline = currentPhases && currentPhases.length > 0 && currentPhases[0].phaseType;
  const deadlineEnd = currentPhases && currentPhases.length > 0 ?
    new Date(currentPhases[0].scheduledEndTime).getTime() : Date.now();
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

    if (relevantPhases.length > 1 && appealsEndDate) {
      const lastPhase = relevantPhases[relevantPhases.length - 1];
      const lastPhaseTime = (
        new Date(lastPhase.actualEndTime || lastPhase.scheduledEndTime)
      ).getTime();
      const appealsEnd = (new Date(appealsEndDate).getTime());
      if (lastPhaseTime < appealsEnd) {
        relevantPhases.push({
          phaseType: 'Winners',
          scheduledEndTime: appealsEndDate,
        });
      }
    }
  }

  const checkpointCount = checkpoints && checkpoints.numberOfUniqueSubmitters;

  return (
    <ThemeProvider theme={theme} >
      <div styleName="challenge-outer-container">
        <div styleName="important-detail">
          <h1 styleName="challenge-header">{name}</h1>
          <ChallengeTags
            subTrack={subTrack}
            challengeSubtracksMap={challengeSubtracksMap}
            events={eventNames}
            technPlatforms={miscTags}
            subTrackStyle={subTrackStyle}
            eventStyle={eventStyle}
            setChallengeListingFilter={setChallengeListingFilter}
          />
          <div styleName="prizes-ops-container">
            <div styleName="prizes-outer-container">
              <h3 styleName="prizes-title">PRIZES</h3>
              <Prizes prizes={prizes && prizes.length ? prizes : [0]} />
              {
                bonusType &&
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
                  to={trackLower === 'design' ?
                    `${config.URL.BASE}/challenges/${challengeId}/submit/file` :
                    `${config.URL.BASE}/challenge-details/${challengeId}/submit/?type=develop`
                  }
                >Submit</PrimaryButton>
                <PrimaryButton
                  disabled={!hasRegistered || unregistering || !hasSubmissions}
                  theme={{ button: style.challengeAction }}
                  to={`/challenges/${challengeId}/my-submissions`}
                >View Submissions</PrimaryButton>
              </div>
            </div>
          </div>
          <div styleName="deadlines-view">
            <div styleName="deadlines-overview">
              <div styleName="deadlines-overview-text">
                <div styleName="next-deadline">
                  Next Deadline: <span styleName="deadline-highlighted">{nextDeadline || '-'}</span>
                </div>
                <div styleName="current-phase">
                  <span styleName="deadline-highlighted">
                    {timeLeft}
                  </span> until current deadline ends
                </div>
              </div>
              <a onClick={props.onToggleDeadlines} styleName="deadlines-collapser">
                {props.showDeadlineDetail ?
                  <span styleName="collapse-text">Hide Deadlines <ArrowDown /></span>
                  : <span styleName="collapse-text">View All Deadlines <ArrowUp /></span>
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
            status={status}
            hasCheckpoints={checkpoints && checkpoints.length > 0}
            numSubmissions={numSubmissions}
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
  hasRegistered: PT.bool.isRequired,
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
