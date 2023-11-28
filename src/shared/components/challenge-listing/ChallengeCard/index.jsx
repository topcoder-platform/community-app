import _ from 'lodash';
import React, { useMemo } from 'react';
import PT from 'prop-types';
import TrackIcon from 'components/TrackIcon';
import { DevelopmentTrackTag } from 'topcoder-react-ui-kit';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { Link } from 'topcoder-react-utils';
import {
  getEndDate,
  getPrizePointsUI,
} from 'utils/challenge-detail/helper';

import Tags from '../Tags';

import ChallengeStatus from './Status';
import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';
import MatchScore from './MatchScore';
import { calculateScore } from '../../../utils/challenge-listing/helper';
import './style.scss';

/* TODO: Note that this component uses a dirty trick to cheat linter and to be
 * able to modify an argument: it aliases challenge prop, then mutates it in
 * the way it wants. Not good at all! If necessary, modification of challenge
 * object received from the API should be done in the normalization function! */

function ChallengeCard({
  challenge: passedInChallenge,
  challengeType,
  challengesUrl,
  expandedTags,
  expandTag,
  newChallengeDetails,
  onTechTagClicked,
  openChallengesInNewTabs,
  sampleWinnerProfile,
  selectChallengeDetailsTab,
  userId,
  domRef,
  isLoggedIn,
}) {
  const challenge = passedInChallenge;
  const {
    id,
    track,
  } = challenge;

  challenge.prize = challenge.prizes || [];

  const challengeDetailLink = `${challengesUrl}/${id}`;

  const registrationPhase = (challenge.phases || []).filter(phase => phase.name === 'Registration')[0];
  const isRegistrationOpen = registrationPhase ? registrationPhase.isOpen : false;
  const isRecommendedChallenge = !!challenge.jaccard_index;
  const skills = useMemo(() => _.uniq((challenge.skills || []).map(skill => skill.name)), [
    challenge.skills,
  ]);

  return (
    <div ref={domRef} styleName="challengeCard">
      <div styleName="left-panel">
        <div styleName="challenge-track">
          <TrackAbbreviationTooltip
            track={track}
            type={challengeType}
          >
            <span>
              <TrackIcon
                track={track}
                type={challengeType}
                tcoEligible={challenge.events && challenge.events.length > 0 ? challenge.events[0].key : ''}
              />
            </span>
          </TrackAbbreviationTooltip>
        </div>

        <div styleName={isRegistrationOpen ? 'challenge-details with-register-button' : 'challenge-details'}>
          <div styleName="challenge-detail-header">
            <Link
              onClick={() => selectChallengeDetailsTab(DETAIL_TABS.DETAILS)}
              to={challengeDetailLink}
              styleName="challenge-title"
              openNewTab={openChallengesInNewTabs}
            ><p>{challenge.name}</p>
            </Link>
          </div>
          <div styleName="details-footer">
            <span styleName="date">
              {challenge.status === 'Active' ? 'Ends ' : 'Ended '}
              {getEndDate(challenge)}
            </span>
            {
              isRecommendedChallenge
              && <MatchScore score={calculateScore(challenge.jaccard_index)} />
            }
            {
              isRecommendedChallenge
              && challenge.match_skills.length > 0
                && (
                <Tags
                  tags={challenge.tags || []}
                  skills={skills}
                  onTechTagClicked={onTechTagClicked}
                  isExpanded={expandedTags.includes(challenge.id)}
                  expand={() => expandTag(challenge.id)}
                  verifiedTags={challenge.match_skills}
                  recommended
                />
                )
            }
            {
              _.get(challenge, 'legacy.selfService') && (
                <DevelopmentTrackTag>
                  <span>On Demand</span>
                </DevelopmentTrackTag>
              )
            }
            { !isRecommendedChallenge
              && (challenge.tags.length + skills.length) > 0
              && (
              <Tags
                tags={challenge.tags || []}
                skills={skills}
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
          userId={userId}
          isLoggedIn={isLoggedIn}
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
  sampleWinnerProfile: undefined,
  userId: '',
  expandedTags: [],
  expandTag: null,
  domRef: null,
};

ChallengeCard.propTypes = {
  challenge: PT.shape(),
  challengeType: PT.shape().isRequired,
  challengesUrl: PT.string.isRequired,
  newChallengeDetails: PT.bool,
  onTechTagClicked: PT.func,
  openChallengesInNewTabs: PT.bool,
  sampleWinnerProfile: PT.shape(),
  selectChallengeDetailsTab: PT.func.isRequired,
  userId: PT.number,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  domRef: PT.func,
  isLoggedIn: PT.bool.isRequired,
};

export default ChallengeCard;
