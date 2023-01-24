/* global tcUniNav */
import React, { useEffect, useRef } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import _ from 'lodash';
import { getInitials, getSubPageConfiguration } from '../utils/url';

const headerElId = 'uninav-headerNav';

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

    let { type } = getSubPageConfiguration();

    // If url contains navTool url parameter. Overwrite settings with parameter.
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    if (urlParams.get('navTool')) {
      type = urlParams.get('navTool');
    }

    tcUniNav('init', headerElId, {
      type,
      toolName: getSubPageConfiguration().toolName,
      toolRoot: getSubPageConfiguration().toolRoot,
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

  useEffect(() => {
    tcUniNav('update', headerElId, {
      user: isAuthenticated ? navigationUserInfo : null,
    });
  }, [isAuthenticated, navigationUserInfo]);

  return <div id={headerElId} ref={headerRef} />;
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
