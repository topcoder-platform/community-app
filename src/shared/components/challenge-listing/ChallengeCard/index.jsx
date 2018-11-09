import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { convertNow as convertMoney } from 'services/money';
import { config, Link } from 'topcoder-react-utils';

import Tags from '../Tags';

import Prize from './Prize';
import ChallengeStatus from './Status';
import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';
import './style.scss';

export const PRIZE_MODE = {
  HIDDEN: 'hidden',
  MONEY_EUR: 'money-eur',
  MONEY_INR: 'money-inr',
  MONEY_USD: 'money-usd',
};

// Get the End date of a challenge
const getEndDate = (c) => {
  let phases = c.allPhases;
  if (c.subTrack === 'FIRST_2_FINISH' && c.status === 'COMPLETED') {
    phases = c.allPhases.filter(p => p.phaseType === 'Iterative Review' && p.phaseStatus === 'Closed');
  }
  const endPhaseDate = Math.max(...phases.map(d => new Date(d.scheduledEndTime)));
  return moment(endPhaseDate).format('MMM DD');
};

/* TODO: Note that this component uses a dirty trick to cheat linter and to be
 * able to modify an argument: it aliases challenge prop, then mutates it in
 * the way it wants. Not good at all! If necessary, modification of challenge
 * object received from the API should be done in the normalization function! */

function ChallengeCard({
  challenge: passedInChallenge,
  challengesUrl,
  expandedTags,
  expandTag,
  newChallengeDetails,
  onTechTagClicked,
  openChallengesInNewTabs,
  prizeMode,
  sampleWinnerProfile,
  selectChallengeDetailsTab,
  userHandle,
}) {
  const challenge = passedInChallenge;
  challenge.isDataScience = false;
  if (challenge.technologies.includes('Data Science')) {
    challenge.isDataScience = true;
  }
  challenge.prize = challenge.prizes || [];

  const {
    id,
    subTrack,
    track,
    status,
  } = challenge;

  let challengeDetailLink = `${challengesUrl}/${id}`;
  if (track === 'DATA_SCIENCE' && subTrack === 'MARATHON_MATCH' && status === 'ACTIVE') {
    challengeDetailLink = `${config.URL.COMMUNITY}/tc?module=MatchDetails&rd=${id}`;
  }

  const registrationPhase = challenge.allPhases.filter(phase => phase.phaseType === 'Registration')[0];
  const isRegistrationOpen = registrationPhase ? registrationPhase.phaseStatus === 'Open' : false;

  /* Preparation of data to show in the prize component,
   * depending on options. */
  const bonuses = [];
  if (challenge.reliabilityBonus) {
    bonuses.push({
      name: 'Reliability',
      prize: challenge.reliabilityBonus,
    });
  }
  let prizeUnitSymbol = '';
  let { prizes } = challenge;
  let totalPrize;
  switch (prizeMode) {
    case PRIZE_MODE.MONEY_EUR:
      prizeUnitSymbol = '€';
      bonuses.forEach((bonus) => {
        bonus.prize = Math.round(convertMoney(bonus.prize, 'EUR')); // eslint-disable-line no-param-reassign
      });
      totalPrize = Math.round(convertMoney(challenge.totalPrize, 'EUR'));
      prizes = (prizes || []).map(prize => Math.round(convertMoney(prize, 'EUR')));
      break;
    case PRIZE_MODE.MONEY_INR:
      prizeUnitSymbol = '₹';
      bonuses.forEach((bonus) => {
        bonus.prize = Math.round(convertMoney(bonus.prize, 'INR')); // eslint-disable-line no-param-reassign
      });
      totalPrize = Math.round(convertMoney(challenge.totalPrize, 'INR'));
      prizes = (prizes || []).map(prize => Math.round(convertMoney(prize, 'INR')));
      break;
    case PRIZE_MODE.MONEY_USD:
      prizeUnitSymbol = '$';
      ({ totalPrize } = challenge);
      break;
    default: throw new Error('Unknown prize mode!');
  }

  return (
    <div styleName="challengeCard">
      <div styleName="left-panel">
        <div styleName="challenge-track">
          <TrackAbbreviationTooltip
            subTrack={subTrack}
            track={challenge.track}
          >
            <span>
              <TrackIcon
                track={challenge.track}
                subTrack={subTrack}
                tcoEligible={challenge.events ? challenge.events[0].eventName : ''}
                isDataScience={challenge.isDataScience}
              />
            </span>
          </TrackAbbreviationTooltip>
        </div>

        <div styleName={isRegistrationOpen ? 'challenge-details with-register-button' : 'challenge-details'}>
          <Link
            onClick={() => selectChallengeDetailsTab(DETAIL_TABS.DETAILS)}
            to={challengeDetailLink}
            styleName="challenge-title"
            openNewTab={openChallengesInNewTabs}
          >
            {challenge.name}
          </Link>
          <div styleName="details-footer">
            <span styleName="date">
              {challenge.status === 'ACTIVE' ? 'Ends ' : 'Ended '}
              {getEndDate(challenge)}
            </span>
            <Tags
              technologies={challenge.technologies}
              platforms={challenge.platforms}
              onTechTagClicked={onTechTagClicked}
              isExpanded={expandedTags.includes(challenge.id)}
              expand={() => expandTag(challenge.id)}
            />
          </div>
        </div>
      </div>
      <div styleName="right-panel">
        <div styleName={isRegistrationOpen ? 'prizes with-register-button' : 'prizes'}>
          {
            totalPrize >= 1
              && (
              <Prize
                bonuses={bonuses}
                label="Purse"
                prizes={prizes}
                prizeUnitSymbol={prizeUnitSymbol}
                totalPrize={totalPrize}
              />
              )
          }
          {
            challenge.pointPrizes && challenge.pointPrizes.length > 0
              && (
              <Prize
                label="Points"
                prizes={challenge.pointPrizes}
                prizeUnitSymbol=""
                totalPrize={challenge.pointPrizes.reduce((acc, points) => acc + points, 0)}
              />
              )
          }
        </div>

        <ChallengeStatus
          challenge={challenge}
          challengesUrl={challengesUrl}
          detailLink={challengeDetailLink}
          newChallengeDetails={newChallengeDetails}
          openChallengesInNewTabs={openChallengesInNewTabs}
          sampleWinnerProfile={sampleWinnerProfile}
          selectChallengeDetailsTab={selectChallengeDetailsTab}
          userHandle={userHandle}
        />
      </div>
    </div>
  );
}

ChallengeCard.defaultProps = {
  challenge: {},
  newChallengeDetails: false,
  onTechTagClicked: _.noop,
  openChallengesInNewTabs: false,
  prizeMode: PRIZE_MODE.MONEY_USD,
  sampleWinnerProfile: undefined,
  userHandle: '',
  expandedTags: [],
  expandTag: null,
};

ChallengeCard.propTypes = {
  challenge: PT.shape(),
  challengesUrl: PT.string.isRequired,
  newChallengeDetails: PT.bool,
  onTechTagClicked: PT.func,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.oneOf(_.toArray(PRIZE_MODE)),
  sampleWinnerProfile: PT.shape(),
  selectChallengeDetailsTab: PT.func.isRequired,
  userHandle: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
};

export default ChallengeCard;
