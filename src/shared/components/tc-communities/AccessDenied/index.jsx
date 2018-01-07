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

export default function AccessDenied({ cause, communityId }) {
  switch (cause) {
    case CAUSE.NOT_AUTHENTICATED: {
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">You must be authenticated to access this page.</div>
          <div styleName="msg">
            <a
              className="tc-btn-md tc-btn-primary"
              href={`${config.URL.AUTH}/member?utm_source=${communityId}`}
              onClick={(event) => {
                const retUrl = encodeURIComponent(window.location.href);
                window.location = `${config.URL.AUTH}/member?retUrl=${retUrl}&utm_source=${communityId}`;
                event.preventDefault();
              }}
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

AccessDenied.defaultProps = {
  communityId: '',
};

AccessDenied.propTypes = {
  cause: PT.oneOf(_.toArray(CAUSE)).isRequired,
  communityId: PT.string,
};
