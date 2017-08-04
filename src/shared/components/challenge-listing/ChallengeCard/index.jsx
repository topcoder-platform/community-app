import _ from 'lodash';
import config from 'utils/config';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';

import Prize from './Prize';
import ChallengeStatus from './Status';
import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';
import './style.scss';

// Constants
const VISIBLE_TECHNOLOGIES = 3;
const ID_LENGTH = 6;

// Get the End date of a challenge
const getEndDate = date => moment(date).format('MMM DD');

/* TODO: Note that this component uses a dirty trick to cheat linter and to be
 * able to modify an argument: it aliases challenge prop, then mutates it in
 * the way it wants. Not good at all! If necessary, modification of challenge
 * object received from the API should be done in the normalization function! */

function ChallengeCard({
  challenge: passedInChallenge,
  onTechTagClicked,
  openChallengesInNewTabs,
  sampleWinnerProfile,
}) {
  const challenge = passedInChallenge;

  challenge.isDataScience = false;
  if (challenge.technologies.includes('Data Science')) {
    challenge.isDataScience = true;
  }
  challenge.prize = challenge.prizes || [];
  // challenge.totalPrize = challenge.prize.reduce((x, y) => y + x, 0)

  let challengeDetailLink;
  {
    const challengeUrl = `${config.URL.BASE}/challenge-details/`;
    if (challenge.track === 'DATA_SCIENCE') {
      const mmDetailUrl = `${config.URL.COMMUNITY}/tc?module=MatchDetails&rd=`;
      /* TODO: Don't we have a better way, whether a challenge is MM or not? */
      const isMM = _.toString(challenge.id).length < ID_LENGTH;
      challengeDetailLink = isMM
        ? `${mmDetailUrl}${challenge.id}`
        : `${challengeUrl}${challenge.id}/?type=develop`;
    } else {
      challengeDetailLink =
        `${challengeUrl}${challenge.id}/?type=${challenge.track.toLowerCase()}`;
    }
  }

  const registrationPhase = challenge.allPhases.filter(phase => phase.phaseType === 'Registration')[0];
  const isRegistrationOpen = registrationPhase ? registrationPhase.phaseStatus === 'Open' : false;

  const bonuses = [];
  if (challenge.reliabilityBonus) {
    bonuses.push({
      name: 'Reliability',
      prize: challenge.reliabilityBonus,
    });
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
          <a
            href={challengeDetailLink}
            styleName="challenge-title"
            target={openChallengesInNewTabs ? '_blank' : undefined}
          >{challenge.name}</a>
          <div styleName="details-footer">
            <span styleName="date">
              {challenge.status === 'ACTIVE' ? 'Ends ' : 'Ended '}
              {getEndDate(challenge.submissionEndDate)}
            </span>
            <Tags technologies={challenge.technologies} onTechTagClicked={onTechTagClicked} />
          </div>
        </div>
      </div>
      <div styleName="right-panel">
        <div styleName={isRegistrationOpen ? 'prizes with-register-button' : 'prizes'}>
          <Prize
            bonuses={bonuses}
            prizes={challenge.prizes}
            prizeUnitSymbol="$"
            totalPrize={challenge.totalPrize}
          />
        </div>

        <ChallengeStatus
          challenge={challenge}
          detailLink={challengeDetailLink}
          openChallengesInNewTabs={openChallengesInNewTabs}
          sampleWinnerProfile={sampleWinnerProfile}
        />
      </div>
    </div>
  );
}

ChallengeCard.defaultProps = {
  onTechTagClicked: _.noop,
  challenge: {},
  openChallengesInNewTabs: false,
  sampleWinnerProfile: undefined,
};

ChallengeCard.propTypes = {
  onTechTagClicked: PT.func,
  challenge: PT.shape(),
  openChallengesInNewTabs: PT.bool,
  sampleWinnerProfile: PT.shape(),
};

/**
 * Renders the Tags
 */

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
    const technologies = this.props.technologies ? this.props.technologies.split(',') : [];
    if (technologies.length) {
      let technologyList = technologies;
      if (technologies.length > VISIBLE_TECHNOLOGIES && !this.state.expanded) {
        const lastItem = `+${technologyList.length - VISIBLE_TECHNOLOGIES}`;
        technologyList = technologies.slice(0, VISIBLE_TECHNOLOGIES);
        technologyList.push(lastItem);
      }
      return technologyList.map(c => (
        <a
          key={c}
          styleName="technology"
          /* TODO: Find out why all tags beside the first one are prepended
           * with whitespaces? */
          onClick={() => this.onClick(c.trim())}
          role="button"
          tabIndex={0}
        >{c}</a>
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
  technologies: '',
  onTechTagClicked: _.noop,
};

Tags.propTypes = {
  technologies: PT.string,
  onTechTagClicked: PT.func,
};

export default ChallengeCard;
