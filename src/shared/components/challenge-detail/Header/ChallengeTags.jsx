/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { Link } from 'utils/router';
import style from './style.scss';
import { TagButton } from 'components/buttons';

export default function ChallengeTags(props) {
  const {
    subTrack,
    events,
    technPlatforms,
    subTrackStyle,
    eventStyle,
    setChallengeListingFilter,
    challengeSubtracksMap,
  } = props;

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
        <TagButton
          to="/challenges"
          onClick={() => setChallengeListingFilter({ subtracks: [subTrack] })}
          theme={{ button: style[subTrackStyle] }}
        >{stylizedSubTrack(subTrack)}</TagButton>
      }
      {
        events.map(event => (
          <TagButton
            to={`https://${event}.topcoder.com`}
            theme={{ button: style[eventStyle] }}
            key={event}
          >{event}</TagButton>
        ))
      }
      {
        technPlatforms.map(
          tag =>
            (
              <TagButton
                to="/challenges"
                onClick={() => setChallengeListingFilter({ tags: [tag] })}
                theme={{ button: style.miscTag }}
                key={tag}
              >{tag}</TagButton>
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
  challengeSubtracksMap: PT.shape().isRequired,
};
