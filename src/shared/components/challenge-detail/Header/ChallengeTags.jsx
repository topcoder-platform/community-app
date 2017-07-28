/*
  A stateless component that renders "sub track", "events" ,
  "platforms" and "technology" as tag.
  Sub Track and Events have topcoder color accent to denote track.
  Blue - Design, Green - Develop, Orange - Data Science
*/


import React from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';

import './style.scss';

export default function ChallengeTags(props) {
  const {
    subTrack,
    events,
    technPlatforms,
    subTrackStyle,
    eventStyle,
    tagFilterString,
  } = props;

  return (
    <div styleName="tag-holder">
      {
        subTrack &&
        <a styleName={`tag-common ${subTrackStyle}`}>{subTrack}</a>
      }
      {
        events.map(
          evnt =>
            <a key={evnt} styleName={`tag-common  ${eventStyle}`}>{evnt}</a>,
        )
      }
      {
        technPlatforms.map(
          tag =>
          (
            <Link
              key={tag}
              to={tagFilterString + tag}
              styleName="tag-common misc-tag"
            >{tag}
            </Link>
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
  tagFilterString: PT.string.isRequired,
};
