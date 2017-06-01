/* global window */

import _ from 'lodash';
import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';

import TopcoderLogo from '../../../../assets/images/logo_topcoder.svg';
import './style.scss';

export const CAUSE = {
  NOT_AUTHENTICATED: 'Not authenticated',
  NOT_AUTHORIZED: 'Not authorized',
};

export default function AccessDenied({ cause }) {
  const origin = window ? window.location.origin : '';
  switch (cause) {
    case CAUSE.NOT_AUTHENTICATED: {
      const returnUrl = encodeURIComponent(`${origin}/community/wipro2/home`);
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">You must be authenticated to access this page.</div>
          <div styleName="msg">
            <a
              className="btnButton"
              href={`${config.URL.AUTH}?retUrl=${returnUrl}`}
            >Log In Here</a>
          </div>
        </div>
      );
    }
    case CAUSE.NOT_AUTHORIZED:
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">You are not authorized to access this page.</div>
        </div>
      );
    default: return <div />;
  }
}

AccessDenied.propTypes = {
  cause: PT.oneOf(_.toArray(CAUSE)).isRequired,
};
