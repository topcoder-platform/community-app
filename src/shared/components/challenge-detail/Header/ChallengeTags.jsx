/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import {
  Tag,
  DataScienceTrackTag,
  DataScienceTrackEventTag,
  DesignTrackTag,
  DesignTrackEventTag,
  DevelopmentTrackTag,
  DevelopmentTrackEventTag,
  QATrackTag,
  QATrackEventTag,
} from 'topcoder-react-ui-kit';

import { COMPETITION_TRACKS } from 'utils/tc';
import VerifiedIcon from 'assets/images/icon-verified.svg';
import MatchScore from 'components/challenge-listing/ChallengeCard/MatchScore';
import Tooltip from 'components/Tooltip';
import { calculateScore } from '../../../utils/challenge-listing/helper';
import './style.scss';

export default function ChallengeTags(props) {
  const {
    challengeId,
    challengesUrl,
    track,
    challengeType,
    events,
    technPlatforms,
    setChallengeListingFilter,
    openForRegistrationChallenges,
  } = props;

  let EventTag;
  let TrackTag;
  switch (track) {
    case COMPETITION_TRACKS.DS:
      EventTag = DataScienceTrackEventTag;
      TrackTag = DataScienceTrackTag;
      break;
    case COMPETITION_TRACKS.DES:
      EventTag = DesignTrackEventTag;
      TrackTag = DesignTrackTag;
      break;
    case COMPETITION_TRACKS.DEV:
      EventTag = DevelopmentTrackEventTag;
      TrackTag = DevelopmentTrackTag;
      break;
    case COMPETITION_TRACKS.QA:
      EventTag = QATrackEventTag;
      TrackTag = QATrackTag;
      break;
    default:
      throw new Error('Wrong competition track value');
  }


  const filteredChallenge = _.find(openForRegistrationChallenges, { id: challengeId });
  const matchSkills = filteredChallenge ? filteredChallenge.match_skills : [];
  const matchScore = filteredChallenge ? filteredChallenge.jaccard_index : 0;

  const tags = technPlatforms.filter(tag => !matchSkills.includes(tag));

  const verifiedTagTooltip = item => (
    <div styleName="tctooltiptext">
      <p>{item} is verified based <br /> on past challenges you won</p>
    </div>
  );

  return (
    <div>
      {
        challengeType
        && (
          <TrackTag
            onClick={() => (
              setImmediate(() => setChallengeListingFilter({ types: [challengeType.abbreviation] }))
            )
            }
            to={`${challengesUrl}?types[]=${encodeURIComponent(challengeType.abbreviation)}`}
          >
            {challengeType.name}
          </TrackTag>
        )
      }
      {
        events.map(event => (
          <EventTag
            to={`https://${event}.topcoder.com`}
            key={event}
          >
            {event}
          </EventTag>
        ))
      }
      {
        matchScore && (
          <MatchScore score={calculateScore(matchScore)} />
        )
      }
      {
        matchSkills.map(item => (
          <div styleName="recommended-challenge-tooltip">
            <Tooltip
              id="recommended-tip"
              content={verifiedTagTooltip(item)}
              trigger={['hover', 'focus']}
            >
              <DevelopmentTrackEventTag
                key={item}
                role="button"
                to={(challengesUrl && item.indexOf('+') !== 0) ? `${challengesUrl}?filter[tags][0]=${
                  encodeURIComponent(item)}` : null}
              >
                <VerifiedIcon styleName="verified-tag" />
                <span styleName="verified-tag-text">{item}</span>
              </DevelopmentTrackEventTag>
            </Tooltip>
          </div>
        ))
      }
      {
        tags.map(tag => (
          tag
              && (
              <Tag
                key={tag}
                onClick={() => setImmediate(() => setChallengeListingFilter({ search: tag }))
                }
                to={`${challengesUrl}?search=${
                  encodeURIComponent(tag)}`}
              >
                {tag}
              </Tag>
              )
        ))
      }
    </div>
  );
}

ChallengeTags.defaultProps = {
  events: [],
  technPlatforms: [],
};

ChallengeTags.propTypes = {
  challengeId: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  track: PT.string.isRequired,
  events: PT.arrayOf(PT.string),
  technPlatforms: PT.arrayOf(PT.string),
  setChallengeListingFilter: PT.func.isRequired,
  challengeType: PT.shape().isRequired,
  openForRegistrationChallenges: PT.shape().isRequired,
};
