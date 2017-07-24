/**
 * Auth block: a pair of Join and Log In buttons.
 */

import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';
import './style.scss';

export default function Auth({ column }) {
  return (
    /* TODO: These registration and login links should be appended with
      ?next=... specifying the url encoded URL, where the user should be
      redirected after successful login / registration. Can't just append
      them, though, as it will break the server-side rendering (during
      server side rendering we don't know yet the correct url for the
      redirection). Most probably, we should use here buttons instead
      of hyperlinks, and compose the target url once the user clicks
      them. */
    <div
      className={column ? 'column' : ''}
      styleName="auth"
    >
      <a
        className="tc-btn-sm tc-btn-primary"
        href={`${config.URL.AUTH}/member/registration`}
      >Join</a>
      <a
        className="tc-btn-sm tc-btn-default"
        href={`${config.URL.AUTH}/member`}
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
