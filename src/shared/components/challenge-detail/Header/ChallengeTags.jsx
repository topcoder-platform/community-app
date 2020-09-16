/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


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

export default function ChallengeTags(props) {
  const {
    challengesUrl,
    track,
    challengeType,
    events,
    technPlatforms,
    setChallengeListingFilter,
  } = props;

  let EventTag;
  let TrackTag;
  switch (track) {
    case COMPETITION_TRACKS.DATA_SCIENCE:
      EventTag = DataScienceTrackEventTag;
      TrackTag = DataScienceTrackTag;
      break;
    case COMPETITION_TRACKS.DESIGN:
      EventTag = DesignTrackEventTag;
      TrackTag = DesignTrackTag;
      break;
    case COMPETITION_TRACKS.DEVELOP:
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

  return (
    <div>
      {
        challengeType
        && (
          <TrackTag
            onClick={() => (
              setImmediate(() => setChallengeListingFilter({ types: [challengeType.id] }))
            )
            }
            to={`${challengesUrl}?filter[types][0]=${encodeURIComponent(challengeType.id)}`}
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
        technPlatforms.map(tag => (
          tag
              && (
              <Tag
                key={tag}
                onClick={() => setImmediate(() => setChallengeListingFilter({ tags: [tag] }))
                }
                to={`${challengesUrl}?filter[tags][0]=${
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
  challengesUrl: PT.string.isRequired,
  track: PT.string.isRequired,
  events: PT.arrayOf(PT.string),
  technPlatforms: PT.arrayOf(PT.string),
  setChallengeListingFilter: PT.func.isRequired,
  challengeType: PT.shape().isRequired,
};
