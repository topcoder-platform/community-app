import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { config, Link } from 'topcoder-react-utils';
import {
  getEndDate,
  PRIZE_MODE,
  getPrizePurseUI,
  getPrizePointsUI,
} from 'utils/challenge-detail/helper';

import Tags from '../Tags';

import ChallengeStatus from './Status';
import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';
import './style.scss';


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
  const {
    id,
    subTrack,
    track,
    status,
  } = challenge;

  challenge.isDataScience = false;
  if (challenge.technologies.includes('Data Science') || subTrack === 'DEVELOP_MARATHON_MATCH') {
    challenge.isDataScience = true;
  }
  challenge.prize = challenge.prizes || [];

  let challengeDetailLink = `${challengesUrl}/${id}`;
  if (track === 'DATA_SCIENCE' && subTrack === 'MARATHON_MATCH' && status === 'ACTIVE') {
    challengeDetailLink = `${config.URL.COMMUNITY}/tc?module=MatchDetails&rd=${id}`;
  }

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
          <Link
            onClick={() => selectChallengeDetailsTab(DETAIL_TABS.DETAILS)}
            to={challengeDetailLink}
            styleName="challenge-title"
            openNewTab={openChallengesInNewTabs}
          ><p>{challenge.name}</p>
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
          {getPrizePurseUI(challenge, prizeMode)}
          {getPrizePointsUI(challenge)}
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
