/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import { Tag, EventTag, PrimaryTag } from 'components/tags';

export default function ChallengeTags(props) {
  const {
    challengesUrl,
    subTrack,
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

  return (
    <div>
      {
        subTrack &&
        <PrimaryTag
          onClick={() =>
            setImmediate(() =>
              setChallengeListingFilter({ subtracks: [subTrack] }),
            )
          }
          to={`${challengesUrl}?filter[subtracks][0]=${
            encodeURIComponent(subTrack)}`}
        >{stylizedSubTrack(subTrack)}</PrimaryTag>
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
  events: PT.arrayOf(PT.string),
  technPlatforms: PT.arrayOf(PT.string),
  setChallengeListingFilter: PT.func.isRequired,
  challengeSubtracksMap: PT.shape().isRequired,
};
