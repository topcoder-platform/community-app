/* global window */

import _ from 'lodash';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import PT from 'prop-types';
import React from 'react';

import TopcoderLogo from '../../../../assets/images/logo_topcoder.svg';
import './style.scss';
import Viewport from '../../Contentful/Viewport';

export const CAUSE = {
  NOT_AUTHENTICATED: 'Not authenticated',
  NOT_AUTHORIZED: 'Not authorized',
  HAVE_NOT_SUBMITTED_TO_THE_CHALLENGE: 'You have not submitted to this challenge',
};

export default function AccessDenied(props) {
  const {
    cause,
    communityId,
    redirectLink,
    spaceName,
    environment,
    viewportId,
  } = props;

  if (viewportId) {
    return (
      <Viewport
        id={viewportId}
        spaceName={spaceName}
        environment={environment}
      />
    );
  }

  switch (cause) {
    case CAUSE.NOT_AUTHENTICATED: {
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">
            You must be authenticated to access this page.
          </div>
          <div styleName="msg">
            <a
              className="tc-btn-md tc-btn-primary"
              href={`${config.URL.AUTH}/member?utm_source=${communityId}`}
              onClick={(event) => {
                const retUrl = encodeURIComponent(window.location.href);
                window.location = `${config.URL.AUTH}/member?retUrl=${retUrl}&utm_source=${communityId}`;
                event.preventDefault();
              }}
            >
              Log In Here
            </a>
          </div>
        </div>
      );
    }
    case CAUSE.NOT_AUTHORIZED:
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">
            You are not authorized to access this page.
          </div>
          {props.children}
        </div>
      );
    case CAUSE.HAVE_NOT_SUBMITTED_TO_THE_CHALLENGE:
      return (
        <div styleName="access-denied">
          <TopcoderLogo />
          <div styleName="msg">
            You have not submitted to this challenge
          </div>
          <PrimaryButton
            to={redirectLink}
          >
            Back to the challenge
          </PrimaryButton>
        </div>
      );
    default: return <div />;
  }
}

AccessDenied.defaultProps = {
  cause: CAUSE.NOT_AUTHENTICATED,
  communityId: '',
  redirectLink: '',
  spaceName: null,
  environment: null,
  viewportId: null,
  children: null,
};

AccessDenied.propTypes = {
  cause: PT.oneOf(_.toArray(CAUSE)),
  communityId: PT.string,
  redirectLink: PT.string,
  spaceName: PT.string,
  environment: PT.string,
  viewportId: PT.string,
  children: PT.node,
};
