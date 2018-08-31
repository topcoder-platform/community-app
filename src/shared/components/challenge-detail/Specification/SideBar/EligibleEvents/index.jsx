import PT from 'prop-types';
import React from 'react';

import Tco19LogoBlack from 'assets/images/tco19_logo_black.svg';

import { Link } from 'topcoder-react-utils';

import './style.scss';

export default function EligibleEvents({ eventDetails }) {
  if (!eventDetails) return null;

  let content;
  switch (eventDetails.eventName) {
    case 'tco19': content = <Tco19LogoBlack />; break;
    default: content = eventDetails.description;
  }

  return (
    <div>
      <h3>ELIGIBLE EVENTS:</h3>
      <p styleName="link-like-paragraph">
        {/* TODO: It is not good to compose the event URL like this, as
          * in general there is not guaranteed to be correct. */}
        <Link
          openNewTab
          to={`//${eventDetails.eventName}.topcoder.com`}
        >
          {content}
        </Link>
      </p>
    </div>
  );
}

EligibleEvents.defaultProps = {
  eventDetails: null,
};

EligibleEvents.propTypes = {
  eventDetails: PT.shape({
    eventName: PT.string.isRequired,
    eventDetails: PT.string.isRequired,
  }),
};
