/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


import React from 'react';
import PT from 'prop-types';
import { Link } from 'utils/router';

import './style.scss';

export default function ChallengeTags(props) {
  const {
    subTrack,
    events,
    technPlatforms,
    subTrackStyle,
    eventStyle,
    setChallengeListingFilter,
  } = props;

  return (
    <div styleName="tag-holder">
      {
        subTrack &&
        <Link
          onClick={() => setChallengeListingFilter({ subtracks: [subTrack] })}
          to="/challenges"
          styleName={`tag-common ${subTrackStyle}`}
        >{subTrack}</Link>
      }
      {
        events.map(event => (
          <a
            href={`https://${event}.topcoder.com`}
            key={event}
            styleName={`tag-common  ${eventStyle}`}
          >{event}</a>
        ))
      }
      {
        technPlatforms.map(
          tag =>
            (
              <Link
                key={tag}
                onClick={() => setChallengeListingFilter({ tags: [tag] })}
                to="/challenges"
                styleName="tag-common misc-tag"
              >{tag}</Link>
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
  subTrack: PT.string,
  events: PT.arrayOf(PT.string),
  technPlatforms: PT.arrayOf(PT.string),
  subTrackStyle: PT.string.isRequired,
  eventStyle: PT.string.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
};
