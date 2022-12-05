/* global tcUniNav */
import React, { useEffect, useRef } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import _ from 'lodash';
import { getInitials } from '../utils/url';

const TopcoderHeader = ({ auth }) => {
  const user = _.get(auth, 'profile') || {};
  const authToken = _.get(auth, 'tokenV3');
  const isAuthenticated = !!authToken;
  const authURLs = config.HEADER_AUTH_URLS;
  const regSource = window.location.pathname.split('/')[1];
  const retUrl = encodeURIComponent(window.location.href);
  const headerRef = useRef();

  const navigationUserInfo = {
    ...user,
    initials: getInitials(user.firstName, user.lastName),
  };

  useEffect(() => {
    if (!window.headerInitialized) {
      tcUniNav('init', 'headerNav', {
        type: 'tool',
        toolName: 'Topcoder',
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
        onReady: () => {
          window.headerInitialized = true;
          window.headerContent = headerRef.current;
        },
      });
    } else {
      document.getElementById('headerNav').innerHTML = window.headerContent.innerHTML;
    }
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
