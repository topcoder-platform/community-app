import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { config, Link } from 'topcoder-react-utils';
import { isMM, isDevelopMM } from 'utils/challenge';
import {
  getEndDate,
  PRIZE_MODE,
  getPrizePurseUI,
  getPrizePointsUI,
  getChallengeSubTrack,
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
  challengeTypes,
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
  domRef,
}) {
  const challenge = passedInChallenge;
  const {
    id,
    status,
    legacy,
  } = challenge;

  const { track } = legacy;
  challenge.isDataScience = false;
  if ((challenge.tags && challenge.tags.includes('Data Science')) || isDevelopMM(challenge)) {
    challenge.isDataScience = true;
  }
  challenge.prize = challenge.prizes || [];

  let challengeDetailLink = `${challengesUrl}/${id}`;
  if (track === 'DATA_SCIENCE' && isMM(challenge) && status === 'Active') {
    challengeDetailLink = `${config.URL.COMMUNITY}/tc?module=MatchDetails&rd=${id}`;
  }

  const registrationPhase = (challenge.allPhases || challenge.phases || []).filter(phase => phase.name === 'Registration')[0];
  const isRegistrationOpen = registrationPhase ? registrationPhase.isActive : false;

  const subTrack = getChallengeSubTrack(challenge.type, challengeTypes);

  return (
    <div ref={domRef} styleName="challengeCard">
      <div styleName="left-panel">
        <div styleName="challenge-track">
          <TrackAbbreviationTooltip
            legacy={challenge.legacy}
            challengeType={challenge.challengeType}
          >
            <span>
              <TrackIcon
                track={track}
                subTrack={subTrack}
                challengeType={challenge.challengeType}
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
              {challenge.status === 'Active' ? 'Ends ' : 'Ended '}
              {getEndDate(challenge, challengeTypes)}
            </span>
            <Tags
              tags={challenge.tags}
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
  challengeTypes: [],
  newChallengeDetails: false,
  onTechTagClicked: _.noop,
  openChallengesInNewTabs: false,
  prizeMode: PRIZE_MODE.MONEY_USD,
  sampleWinnerProfile: undefined,
  userHandle: '',
  expandedTags: [],
  expandTag: null,
  domRef: null,
};

ChallengeCard.propTypes = {
  challenge: PT.shape(),
  challengeTypes: PT.arrayOf(PT.shape()),
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
  domRef: PT.func,
};

export default ChallengeCard;
