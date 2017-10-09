/**
 * Auth block: a pair of Join and Log In buttons.
 */

/* global window */

import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';
import './style.scss';

export default function Auth({ column }) {
  return (
    <div
      className={column ? 'column' : ''}
      styleName="auth"
      onClick={(event) => { event.stopPropagation(); }}
      role="button"
      tabIndex="0"
    >
      <a
        className="tc-btn-sm tc-btn-primary"
        href={`${config.URL.AUTH}/member/registration`}
      >Join</a>
      <a
        className="tc-btn-sm tc-btn-default"
        href={`${config.URL.AUTH}/member`}
        onClick={(event) => {
          const retUrl = encodeURIComponent(window.location.href);
          window.location = `${config.URL.AUTH}/member?retUrl=${retUrl}`;
          event.preventDefault();
        }}
      >Log In</a>
    </div>
  );
}

Auth.defaultProps = {
  column: false,
};

Auth.propTypes = {
  column: PT.bool,
};
