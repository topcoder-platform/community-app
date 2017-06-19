/* eslint jsx-a11y/no-static-element-interactions:0 */

import _ from 'lodash';
import config from 'utils/config';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';

import ChallengeStatus from './Status';
import PrizesTooltip from '../Tooltips/PrizesTooltip';
import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';
import './style.scss';

// Constants
const VISIBLE_TECHNOLOGIES = 3;
const ID_LENGTH = 6;

// Get the End date of a challenge
const getEndDate = date => moment(date).format('MMM DD');

// Convert a number to string with thousands separated by comma
const numberWithCommas = n => (n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0);

function ChallengeCard({
  challenge: passedInChallenge,
  sampleWinnerProfile,
  onTechTagClicked,
}) {
  const challenge = passedInChallenge;

  challenge.isDataScience = false;
  if (challenge.technologies.includes('Data Science')) {
    challenge.isDataScience = true;
  }
  challenge.prize = challenge.prizes || [];
  // challenge.totalPrize = challenge.prize.reduce((x, y) => y + x, 0)

  const challengeDetailLink = () => {
    const challengeUrl = `${config.URL.BASE}/challenge-details/`;
    const mmDetailUrl = `${config.URL.COMMUNITY}/tc?module=MatchDetails&rd=`; // Marathon Match details
    if (challenge.track === 'DATA_SCIENCE') {
      const id = `${challenge.id}`;
      if (id.length < ID_LENGTH) {
        return `${mmDetailUrl}${challenge.id}`;
      }
      return `${challengeUrl}${challenge.id}/?type=develop`;
    }
    return `${challengeUrl}${challenge.id}/?type=${challenge.track.toLowerCase()}`;
  };

  const registrationPhase = challenge.allPhases.filter(phase => phase.phaseType === 'Registration')[0];
  const isRegistrationOpen = registrationPhase ? registrationPhase.phaseStatus === 'Open' : false;

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
          <a styleName="challenge-title" href={challengeDetailLink(challenge)}>
            {challenge.name}
          </a>
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
          <PrizesTooltip challenge={challenge}>
            <div>
              <div><span styleName="dollar">$</span>{numberWithCommas(challenge.totalPrize)}</div>
              <div styleName="label">Purse</div>
            </div>
          </PrizesTooltip>
        </div>

        <ChallengeStatus
          challenge={challenge}
          detailLink={challengeDetailLink(challenge)}
          sampleWinnerProfile={sampleWinnerProfile}
        />
      </div>
    </div>
  );
}

ChallengeCard.defaultProps = {
  onTechTagClicked: _.noop,
  challenge: {},
  sampleWinnerProfile: undefined,
};

ChallengeCard.propTypes = {
  onTechTagClicked: PT.func,
  challenge: PT.shape(),
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
          onClick={() => this.onClick(c)}
        >{c}
        </a>
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
