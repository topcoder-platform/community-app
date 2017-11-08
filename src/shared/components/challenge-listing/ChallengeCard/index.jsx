import _ from 'lodash';
import config from 'utils/config';
import { Link } from 'utils/router';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';
import { DETAIL_TABS } from 'actions/challenge';
import { Tag } from 'components/tags';
import { convertNow as convertMoney } from 'services/money';

import Prize from './Prize';
import ChallengeStatus from './Status';
import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';
import './style.scss';

export const PRIZE_MODE = {
  HIDDEN: 'hidden',
  MONEY_EUR: 'money-eur',
  MONEY_INR: 'money-inr',
  MONEY_USD: 'money-usd',
  POINTS: 'points',
};

// Constants
const VISIBLE_TECHNOLOGIES = 3;
const ID_LENGTH = 6;

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
  // challenge.totalPrize = challenge.prize.reduce((x, y) => y + x, 0)
  const isMM = _.toString(challenge.id).length < ID_LENGTH;
  let challengeDetailLink;
  {
    const challengeUrl = newChallengeDetails
      ? `${challengesUrl}/` : `${config.URL.BASE}/challenge-details/`;
    if (challenge.track === 'DATA_SCIENCE') {
      const mmDetailUrl = `${config.URL.COMMUNITY}/tc?module=MatchDetails&rd=`;
      /* TODO: Don't we have a better way, whether a challenge is MM or not? */
      challengeDetailLink = isMM
        ? `${mmDetailUrl}${challenge.rounds[0].id}`
        : `${challengeUrl}${challenge.id}/?type=develop`;
    } else {
      challengeDetailLink =
        `${challengeUrl}${challenge.id}/?type=${challenge.track.toLowerCase()}`;
    }
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
  let prizes = challenge.prizes;
  let totalPrize;
  switch (prizeMode) {
    case PRIZE_MODE.POINTS:
      totalPrize = Math.round(challenge.drPoints || 0);
      break;
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
      totalPrize = challenge.totalPrize;
      break;
    default: throw new Error('Unknown prize mode!');
  }

  return (
    <div styleName="challengeCard">
      <div styleName="left-panel">
        <div styleName="challenge-track">
          <TrackAbbreviationTooltip track={challenge.track} subTrack={challenge.subTrack}>
            <span>
              <TrackIcon
                track={challenge.track}
                subTrack={challenge.subTrack}
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
          >{challenge.name}</Link>
          <div styleName="details-footer">
            <span styleName="date">
              {challenge.status === 'ACTIVE' ? 'Ends ' : 'Ended '}
              {getEndDate(challenge)}
            </span>
            <Tags
              technologies={challenge.technologies}
              platforms={challenge.platforms}
              onTechTagClicked={onTechTagClicked}
            />
          </div>
        </div>
      </div>
      <div styleName="right-panel">
        <div styleName={isRegistrationOpen ? 'prizes with-register-button' : 'prizes'}>
          {(prizeMode !== PRIZE_MODE.HIDDEN) && (
            <Prize
              bonuses={bonuses}
              label={prizeMode === PRIZE_MODE.POINTS ? 'Points' : 'Purse'}
              points={challenge.drPoints}
              prizes={prizes}
              prizeUnitSymbol={prizeUnitSymbol}
              totalPrize={totalPrize}
              withoutTooltip={prizeMode === PRIZE_MODE.POINTS}
              isMM={isMM}
            />
          )}
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
};

/**
 * Renders the Tags
 */

/* TODO: Must be moved to a separate component. And should be functional,
 * using Redux store to expand/collapse. */
class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(c) {
    // resolved conflict with c++ tag
    if (c.indexOf('+') === 0) {
      this.setState({ expanded: true });
    } else {
      this.props.onTechTagClicked(c);
    }
  }

  renderTechnologies() {
    let technologies = this.props.technologies ? this.props.technologies.split(',').map(item => item.trim()) : [];
    const platforms = this.props.platforms ? this.props.platforms.split(',').map(item => item.trim()) : [];
    technologies = _.union(technologies, platforms);
    if (technologies.length) {
      let technologyList = technologies;
      if (technologies.length > VISIBLE_TECHNOLOGIES && !this.state.expanded) {
        const lastItem = `+${technologyList.length - VISIBLE_TECHNOLOGIES}`;
        technologyList = technologies.slice(0, VISIBLE_TECHNOLOGIES);
        technologyList.push(lastItem);
      }
      return technologyList.map(c => (
        <Tag
          onClick={() => this.onClick(c.trim())}
          key={c}
          role="button"
        >{c}</Tag>
      ));
    }
    return '';
  }

  render() {
    const technologies = this.renderTechnologies();
    return (
      <span>
        { technologies }
      </span>
    );
  }
}

Tags.defaultProps = {
  onTechTagClicked: _.noop,
  technologies: '',
  platforms: '',
};

Tags.propTypes = {
  onTechTagClicked: PT.func,
  technologies: PT.string,
  platforms: PT.string,
};

export default ChallengeCard;
