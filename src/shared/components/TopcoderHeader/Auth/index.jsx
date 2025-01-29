/**
 * Auth block: a pair of Join and Log In buttons.
 */

/* global window */

import PT from 'prop-types';
import React from 'react';
import { config } from 'topcoder-react-utils';

import './style.scss';

export default function Auth({ column }) {
  return (
    <div
      className={column ? 'column' : ''}
      styleName="auth"
    >
      <a
        role="button"
        className="tc-btn-sm tc-btn-primary"
        href={`${config.URL.AUTH}/member/registration?utm_source=community-app-main`}
      >
        Join
      </a>
      <a
        role="button"
        className="tc-btn-sm tc-btn-default"
        href={`${config.URL.AUTH}/member?utm_source=community-app-main`}
        onClick={(event) => {
          const retUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}`);
          window.location = `${config.URL.AUTH}/member?retUrl=${retUrl}&utm_source=community-app-main`;
          event.preventDefault();
        }}
      >
        Log In
      </a>
    </div>
  );
}

Auth.defaultProps = {
  column: false,
};

Auth.propTypes = {
  column: PT.bool,
};
