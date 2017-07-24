/* global window */

import _ from 'lodash';
import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';

import TopcoderLogo from '../../../../assets/images/logo_topcoder.svg';
import './style.scss';

export const CAUSE = {
  NOT_AUTHENTICATED: 'Not authenticated',
  NOT_AUTHENTICATED_WIPRO: 'Not authenticated (Wipro)',
  NOT_AUTHORIZED: 'Not authorized',
};

export default function AccessDenied({ cause }) {
  const origin = window ? window.location.origin : '';
  switch (cause) {
    case CAUSE.NOT_AUTHENTICATED: {
      const returnUrl = encodeURIComponent(`${origin}/`);
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">You must be authenticated to access this page.</div>
          <div styleName="msg">
            <a
              className="tc-btn-md tc-btn-primary"
              href={`${config.URL.AUTH}/member?retUrl=${returnUrl}`}
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
    case CAUSE.NOT_AUTHENTICATED_WIPRO: {
      const returnUrl = encodeURIComponent(`${origin}/`);
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">You must be logged in to access this page.</div>
          <div styleName="msg">
            First time Wipro user? <a href={`${config.URL.AUTH}/sso-registration/?app=member&retUrl=${returnUrl}`} styleName="joinNow">Join Now</a> using your Wipro SSO account.
          </div>
          <div styleName="msg">
            Already registered on Topcoder with your Wipro SSO account?
          </div>
          <div styleName="msg">
            <a
              className="tc-btn-md tc-btn-primary"
              href={`${config.URL.AUTH}/sso-login/?app=member&retUrl=${returnUrl}`}
            >Login with SSO</a>
          </div>
          <div styleName="copyright">
            <a styleName="policy" href={`${config.URL.BASE}/community/how-it-works/privacy-policy/`}>Privacy policy</a>
            &copy; 2017 Topcoder. All rights reserved
          </div>
        </div>
      );
    }
    default: return <div />;
  }
}

AccessDenied.propTypes = {
  cause: PT.oneOf(_.toArray(CAUSE)).isRequired,
};
