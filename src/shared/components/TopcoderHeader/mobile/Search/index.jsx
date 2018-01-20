import React from 'react';
import config from 'utils/config';
import IconMagnifyingGlass from '../../../../../assets/images/magnifying_glass.svg';
import './style.scss';

/* NOTE: We use window object only inside the keypress handler, which only can
 * be invoked at the client side, thus the code is still isomorphic. */
/* global window */

export default function Search() {
  return (
    <div styleName="search">
      <IconMagnifyingGlass styleName="icon" />
      <input
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            window.location = `${config.URL.BASE}/search/members?q=${
              encodeURIComponent(event.target.value)
            }`;
          }
        }}
        placeholder="Find members by username or skill"
        aria-label="Find members by username or skill"
      />
    </div>
  );
}
