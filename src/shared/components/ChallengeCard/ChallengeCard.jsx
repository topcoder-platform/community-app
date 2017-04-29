/* global
  window
*/
/* eslint jsx-a11y/no-static-element-interactions:0 */

import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';

import ChallengeStatus from '../ChallengeStatus/ChallengeStatus';
import PrizesTooltip from './Tooltips/PrizesTooltip';
import TrackAbbreviationTooltip from './Tooltips/TrackAbbreviationTooltip';
import TrackIcon from '../TrackIcon/TrackIcon';
import './ChallengeCard.scss';

// Constants
const VISIBLE_TECHNOLOGIES = 3;
const ID_LENGTH = 6;

// Get the End date of a challenge
const getEndDate = date => moment(date).format('MMM DD');

// Convert a number to string with thousands separated by comma
const numberWithCommas = n => (n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0);

function ChallengeCard({
  challenge: passedInChallenge,
  config,
  sampleWinnerProfile,
  onTechTagClicked,
}) {
  const challenge = passedInChallenge;

  challenge.isDataScience = false;
  if (_.indexOf(challenge.technologies, 'Data Science') > -1) {
    challenge.isDataScience = true;
  }
  challenge.prize = challenge.prize || [];
  // challenge.totalPrize = challenge.prize.reduce((x, y) => y + x, 0)

  const challengeDetailLink = () => {
    const challengeUrl = `${config.MAIN_URL}/challenge-details/`;
    const mmDetailUrl = `${window.location.protocol}${config.COMMUNITY_URL}/tc?module=MatchDetails&rd=`; // Marathon Match details
    if (challenge.track === 'DATA_SCIENCE') {
      const id = `${challenge.challengeId}`;
      if (id.length < ID_LENGTH) {
        return `${mmDetailUrl}${challenge.challengeId}`;
      }
      return `${challengeUrl}${challenge.challengeId}/?type=develop`;
    }
    return `${challengeUrl}${challenge.challengeId}/?type=${challenge.track.toLowerCase()}`;
  };

  return (
    <div styleName="challengeCard">
      <div styleName="left-panel">
        <div styleName="challenge-track">
          <TrackAbbreviationTooltip track={challenge.track} subTrack={challenge.subTrack}>
            <span>
              <TrackIcon
                track={challenge.track}
                subTrack={challenge.subTrack}
                tcoEligible={challenge.eventName}
                isDataScience={challenge.isDataScience}
              />
            </span>
          </TrackAbbreviationTooltip>
        </div>

        <div styleName={challenge.registrationOpen === 'Yes' ? 'challenge-details with-register-button' : 'challenge-details'}>
          <a className="challenge-title" href={challengeDetailLink(challenge)}>
            {challenge.challengeName}
          </a>
          <div styleName="details-footer">
            <span styleName="date">
              {challenge.status === 'Active' ? 'Ends ' : 'Ended '}
              {getEndDate(challenge.submissionEndDate)}
            </span>
            <Tags technologies={challenge.technologies} onTechTagClicked={onTechTagClicked} />
          </div>
        </div>
      </div>
      <div styleName="right-panel">
        <div styleName={challenge.registrationOpen === 'Yes' ? 'prizes with-register-button' : 'prizes'}>
          <PrizesTooltip challenge={challenge} config={config}>
            <div>
              <div><span styleName="dollar">$</span>{numberWithCommas(challenge.totalPrize)}</div>
              <div styleName="label">Purse</div>
            </div>
          </PrizesTooltip>
        </div>

        <ChallengeStatus
          challenge={challenge}
          config={config}
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
  config: process.env,
  sampleWinnerProfile: undefined,
};

ChallengeCard.propTypes = {
  onTechTagClicked: PT.func,
  challenge: PT.shape(),
  config: PT.shape(),
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
    if (this.props.technologies.length) {
      let technologyList = this.props.technologies;
      if (this.props.technologies.length > VISIBLE_TECHNOLOGIES && !this.state.expanded) {
        const lastItem = `+${technologyList.length - VISIBLE_TECHNOLOGIES}`;
        technologyList = this.props.technologies.slice(0, VISIBLE_TECHNOLOGIES);
        technologyList.push(lastItem);
      }
      return technologyList.map(c => (
        <a
          key={c} styleName="technology"
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
  technologies: [],
  onTechTagClicked: _.noop,
};

Tags.propTypes = {
  technologies: PT.arrayOf(PT.string),
  onTechTagClicked: PT.func,
};

export default ChallengeCard;
