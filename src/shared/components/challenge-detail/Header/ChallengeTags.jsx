/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import {
  Tag,
  DataScienceTrackTag,
  DataScienceTrackEventTag,
  DesignTrackTag,
  DesignTrackEventTag,
  DevelopmentTrackTag,
  DevelopmentTrackEventTag,
} from 'topcoder-react-ui-kit';

import { COMPETITION_TRACKS } from 'utils/tc';

export default function ChallengeTags(props) {
  const {
    challengesUrl,
    subTrack,
    track,
    events,
    technPlatforms,
    setChallengeListingFilter,
    challengeSubtracksMap,
  } = props;

  /* TODO: Probably, we don't need this anymore, if we use correct data from
   * APIs (they should contain human-readable names, I believe). */
  const stylizedSubTrack = (t) => {
    if (challengeSubtracksMap[t]) {
      return challengeSubtracksMap[t].name;
    }
    return (t || '').replace(/_/g, ' ')
      .replace(/\w\S*/g, txt => _.capitalize(txt));
  };

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
    default:
      throw new Error('Wrong competition track value');
  }

  return (
    <div>
      {
        subTrack &&
        <TrackTag
          onClick={() =>
            setImmediate(() =>
              setChallengeListingFilter({ subtracks: [subTrack] }),
            )
          }
          to={`${challengesUrl}?filter[subtracks][0]=${
            encodeURIComponent(subTrack)}`}
        >{stylizedSubTrack(subTrack)}</TrackTag>
      }
      {
        events.map(event => (
          <EventTag
            to={`https://${event}.topcoder.com`}
            key={event}
          >{event}</EventTag>
        ))
      }
      {
        technPlatforms.map(
          tag =>
            (
              tag &&
              <Tag
                key={tag}
                onClick={() =>
                  setImmediate(() =>
                    setChallengeListingFilter({ tags: [tag] }),
                  )
                }
                to={`${challengesUrl}?filter[tags][0]=${
                  encodeURIComponent(tag)}`}
              >{tag}</Tag>
            ),
        )
      }
    </div>
  );
}

ChallengeTags.defaultProps = {
  subTrack: undefined,
  events: [],
  technPlatforms: [],
};

ChallengeTags.propTypes = {
  challengesUrl: PT.string.isRequired,
  subTrack: PT.string,
  track: PT.string.isRequired,
  events: PT.arrayOf(PT.string),
  technPlatforms: PT.arrayOf(PT.string),
  setChallengeListingFilter: PT.func.isRequired,
  challengeSubtracksMap: PT.shape().isRequired,
};
