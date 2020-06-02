import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { Link } from 'topcoder-react-utils';
import { isDevelopMM } from 'utils/challenge';
import {
  getEndDate,
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
  sampleWinnerProfile,
  selectChallengeDetailsTab,
  userHandle,
  domRef,
}) {
  const challenge = passedInChallenge;
  const {
    id,
    legacy,
  } = challenge;

  let { track } = legacy;
  challenge.isDataScience = false;
  if ((challenge.tags && challenge.tags.includes('Data Science')) || isDevelopMM(challenge)) {
    challenge.isDataScience = true;
  }
  challenge.prize = challenge.prizes || [];

  const challengeDetailLink = `${challengesUrl}/${id}`;

  const subTrack = getChallengeSubTrack(challenge.type, challengeTypes);
  if (subTrack === 'DEVELOP_MARATHON_MATCH') {
    track = 'DATA_SCIENCE';
  }

  const registrationPhase = (challenge.allPhases || challenge.phases || []).filter(phase => phase.name === 'Registration')[0];
  const isRegistrationOpen = registrationPhase ? registrationPhase.isOpen : false;

  return (
    <div ref={domRef} styleName="challengeCard">
      <div styleName="left-panel">
        <div styleName="challenge-track">
          <TrackAbbreviationTooltip
            track={track}
            subTrack={subTrack}
          >
            <span>
              <TrackIcon
                track={track}
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
          ><p>{challenge.name}</p>
          </Link>
          <div styleName="details-footer">
            <span styleName="date">
              {challenge.status === 'Active' ? 'Ends ' : 'Ended '}
              {getEndDate(challenge, challengeTypes)}
            </span>
            { challenge.tags.length > 0
              && (
              <Tags
                tags={challenge.tags}
                onTechTagClicked={onTechTagClicked}
                isExpanded={expandedTags.includes(challenge.id)}
                expand={() => expandTag(challenge.id)}
              />
              ) }
          </div>
        </div>
      </div>
      <div styleName="right-panel">
        <div styleName={isRegistrationOpen ? 'prizes with-register-button' : 'prizes'}>
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
  sampleWinnerProfile: PT.shape(),
  selectChallengeDetailsTab: PT.func.isRequired,
  userHandle: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  domRef: PT.func,
};

export default ChallengeCard;
