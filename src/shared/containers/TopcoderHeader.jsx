/* global tcUniNav */
import React, { useEffect, useRef } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import _ from 'lodash';
import { getInitials } from '../utils/url';

const TopcoderHeader = ({ auth }) => {
  const uniNavInitialized = useRef(false);
  const user = _.get(auth, 'profile') || {};
  const authToken = _.get(auth, 'tokenV3');
  const isAuthenticated = !!authToken;
  const authURLs = config.HEADER_AUTH_URLS;
  const headerRef = useRef();

  const navigationUserInfo = {
    ...user,
    initials: getInitials(user.firstName, user.lastName),
  };

  useEffect(() => {
    if (uniNavInitialized.current) {
      return;
    }

    uniNavInitialized.current = true;

    const regSource = window.location.pathname.split('/')[1];
    const retUrl = encodeURIComponent(window.location.href);

    tcUniNav('init', 'headerNav', {
      type: 'tool',
      toolName: 'Activity Feed',
      toolRoot: '/',
      user: isAuthenticated ? navigationUserInfo : null,
      signOut: () => {
        window.location = `${config.URL.BASE}/logout?ref=nav`;
      },
      signIn: () => {
        window.location = `${authURLs.location.replace('%S', retUrl).replace('member?', '#!/member?')}&regSource=${regSource}`;
      },
      signUp: () => {
        window.location = `${authURLs.location.replace('%S', retUrl).replace('member?', '#!/member?')}&mode=signUp&regSource=${regSource}`;
      },
    });
  }, []);

  return <div id="headerNav" ref={headerRef} />;
};

TopcoderHeader.defaultProps = {
  auth: {},
};

TopcoderHeader.propTypes = {
  auth: PT.shape(),
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(TopcoderHeader);
