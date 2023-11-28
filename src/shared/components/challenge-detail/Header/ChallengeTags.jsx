/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';

import {
  Tag,
  DevelopmentTrackTag,
} from 'topcoder-react-ui-kit';

import { COMPETITION_TRACKS } from 'utils/tc';
import VerifiedTag from 'components/challenge-listing/VerifiedTag';
import MatchScore from 'components/challenge-listing/ChallengeCard/MatchScore';
import { calculateScore } from '../../../utils/challenge-listing/helper';
import './style.scss';

export default function ChallengeTags(props) {
  const {
    isSelfService,
    challengeId,
    challengesUrl,
    track,
    challengeType,
    events,
    technPlatforms,
    skills,
    setChallengeListingFilter,
    openForRegistrationChallenges,
  } = props;

  const filteredChallenge = _.find(openForRegistrationChallenges, { id: challengeId });
  const matchSkills = filteredChallenge ? filteredChallenge.match_skills || [] : [];
  const matchScore = filteredChallenge ? filteredChallenge.jaccard_index || [] : 0;

  const tags = technPlatforms.filter(tag => !matchSkills.includes(tag));
  const abbreviationName = challengeType ? challengeType.name : null;
  let abbreviation;
  switch (abbreviationName) {
    case 'First2Finish':
      abbreviation = 'F2F';
      break;
    case 'Challenge':
      abbreviation = 'CH';
      break;
    case 'Task':
      abbreviation = 'TSK';
      break;
    default:
      abbreviation = null;
  }

  return (
    <div>
      {
        abbreviation && (
          <div styleName={`type-tag ${abbreviation} ${track === COMPETITION_TRACKS.QA ? 'qa' : ''}`}>
            <Tag
              onClick={() => (
                setImmediate(() => setChallengeListingFilter(
                  { types: [abbreviation] },
                ))
              )
              }
              to={`${challengesUrl}?types[]=${encodeURIComponent(abbreviation)}`}
            >
              {abbreviationName}
            </Tag>
          </div>
        )
      }
      {
        abbreviation ? events.map(event => (
          <div
            key={event}
            styleName={`event-tag ${abbreviation}`}
          >
            <Tag
              to={`https://${event}.topcoder.com`}
            >
              {event}
            </Tag>
          </div>
        )) : null
      }
      {
        matchScore > 0 && config.ENABLE_RECOMMENDER && (
          <span styleName="matchScoreWrap">
            <MatchScore score={calculateScore(matchScore)} />
          </span>
        )
      }
      {
        matchSkills.map(item => (
          <VerifiedTag
            item={item}
            challengesUrl={challengesUrl}
          />
        ))
      }
      {
        isSelfService && (
          <DevelopmentTrackTag>
            <span>On Demand</span>
          </DevelopmentTrackTag>
        )
      }
      {
        skills.map(skill => (
          skill
              && (
              <span styleName="skill">
                <Tag
                  key={skill}
                  onClick={() => setImmediate(() => setChallengeListingFilter({ search: skill }))
                  }
                  to={`${challengesUrl}?search=${
                    encodeURIComponent(skill)}`}
                >
                  {skill}
                </Tag>
              </span>
              )
        ))
      }
      {
        tags.map(tag => (
          tag
              && (
              <span styleName="tag">
                <Tag
                  key={tag}
                  onClick={() => setImmediate(() => setChallengeListingFilter({ search: tag }))
                  }
                  to={`${challengesUrl}?search=${
                    encodeURIComponent(tag)}`}
                >
                  {tag}
                </Tag>
              </span>
              )
        ))
      }
    </div>
  );
}

ChallengeTags.defaultProps = {
  events: [],
  technPlatforms: [],
  skills: [],
  isSelfService: false,
};

ChallengeTags.propTypes = {
  isSelfService: PT.bool,
  challengeId: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  track: PT.string.isRequired,
  events: PT.arrayOf(PT.string),
  technPlatforms: PT.arrayOf(PT.string),
  skills: PT.arrayOf(PT.string),
  setChallengeListingFilter: PT.func.isRequired,
  challengeType: PT.shape().isRequired,
  openForRegistrationChallenges: PT.shape().isRequired,
};
