import React, { useMemo } from 'react';
import _ from 'lodash';
import PT from 'prop-types';
import { Link } from 'topcoder-react-utils';
import moment from 'moment';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import {
  getEndDate,
  PRIZE_MODE,
  getPrizePurseUI,
  getTimeLeft,
} from 'utils/challenge-detail/helper';

import TrackIcon from 'components/TrackIcon';
import Tags from '../../../challenge-listing/Tags';
import ChallengeStatus from '../../../challenge-listing/ChallengeCard/Status';
import TrackAbbreviationTooltip from '../../../challenge-listing/Tooltips/TrackAbbreviationTooltip';

import styles from './style.scss';

export default function ChallengesCard({
  challenge,
  challengeType,
  className,
  challengesUrl,
  selectChallengeDetailsTab,
  prizeMode,
  userHandle,
  expandedTags,
  expandTag,
  isLoggedIn,
}) {
  const {
    id,
    phases,
    track,
  } = challenge;

  const challengeDetailLink = `${challengesUrl}/${id}`;

  const statusPhase = phases
    .filter(p => p.name !== 'Registration')
    .sort((a, b) => moment(a.scheduledEndDate).diff(b.scheduledEndDate))[0];
  const skills = useMemo(() => _.uniq((challenge.skills || []).map(skill => skill.name)), [
    challenge.skills,
  ]);

  return (
    <div className={className} styleName="container">
      <div styleName="content">
        <Tags
          tags={challenge.tags}
          skills={skills}
          isExpanded={expandedTags.includes(challenge.id)}
          expand={() => expandTag(challenge.id)}
          challengesUrl={challengesUrl}
        />
        <div styleName="content-bottom">
          <div styleName="challenge-track">
            <TrackAbbreviationTooltip
              track={track}
              type={challengeType}
            >
              <span styleName="track-icon">
                <TrackIcon
                  track={track}
                  type={challengeType}
                  tcoEligible={challenge.events && challenge.events.length > 0 ? challenge.events[0].key : ''}
                  isDataScience={challenge.isDataScience}
                  challengesUrl={challengesUrl}
                />
              </span>
            </TrackAbbreviationTooltip>
          </div>

          <div styleName="content-bottom-right">
            <Link
              onClick={() => selectChallengeDetailsTab(DETAIL_TABS.DETAILS)}
              to={challengeDetailLink}
              styleName="challenge-title"
              openNewTab
            ><p>{challenge.name}</p>
            </Link>
            <div styleName="endtime-prize-container">
              <span styleName="end-date">
                {challenge.status === 'ACTIVE' ? 'Ends ' : 'Ended '}
                {getEndDate(challenge)}
              </span>
              <div styleName="prizes">
                {getPrizePurseUI(challenge, prizeMode, true, 'Prize Purse')}
              </div>
            </div>
            <ChallengeStatus
              challenge={challenge}
              challengesUrl={challengesUrl}
              detailLink={challengeDetailLink}
              newChallengeDetails
              openChallengesInNewTabs
              selectChallengeDetailsTab={_.noop}
              userHandle={userHandle}
              className={styles['challenge-status-container']}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>

      <div styleName="bottom">
        <span>{getTimeLeft(statusPhase, 'to register').text}</span>
      </div>
    </div>
  );
}

ChallengesCard.defaultProps = {
  className: '',
  prizeMode: PRIZE_MODE.MONEY_USD,
  userHandle: '',
  expandedTags: [],
  expandTag: null,
};

ChallengesCard.propTypes = {
  challenge: PT.shape().isRequired,
  challengeType: PT.shape().isRequired,
  className: PT.string,
  challengesUrl: PT.string.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  prizeMode: PT.oneOf(_.toArray(PRIZE_MODE)),
  userHandle: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  isLoggedIn: PT.bool.isRequired,
};
