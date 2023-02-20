import React, { useMemo } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { config } from 'topcoder-react-utils';
import LoadingIndicator from 'components/LoadingIndicator';
import _ from 'lodash';
import { MarketingNavigation, ToolNavigation } from 'uninav-react';
import { getSubPageConfiguration } from '../../utils/url';
import './styles.scss';

const TopcoderHeader = ({ auth, location }) => {
  const user = _.get(auth, 'profile') || {};
  const authToken = _.get(auth, 'tokenV3');
  const isAuthenticated = !!authToken;
  const authURLs = config.HEADER_AUTH_URLS;
  const pageCfg = useMemo(() => getSubPageConfiguration(location, user.handle), [location, user]);
  const isSSR = typeof window === 'undefined';

  const NavComponent = useMemo(() => {
    let { type } = pageCfg;

    if (!isSSR) {
      // if there's a stored nav type in session storage, retrieve it and overwrite type
      const sessionNavType = sessionStorage.getItem('uni-nav[navType]');
      if (location.pathname.includes() && sessionNavType && (sessionNavType === 'tool' || sessionNavType === 'marketing')) {
        type = sessionNavType;
      }
    }

    // If url contains navTool url parameter. Overwrite settings with parameter.
    const navTool = (location.search.match(/navTool=(tool|marketing)/) || [])[1];
    if (navTool) {
      type = navTool;
    }

    if (!isSSR) {
      // store nav type for current session
      sessionStorage.setItem('uni-nav[navType]', type);
    }
    return type === 'marketing' ? MarketingNavigation : ToolNavigation;
  }, [pageCfg, location]);

  const { signOut, signIn, signUp } = useMemo(() => {
    const regSource = (location.pathname || '').split('/')[1];
    const retUrl = encodeURIComponent(isSSR ? location.href : window.location.href);

    return {
      signOut: () => {
        window.location = `${config.URL.BASE}/logout?ref=nav`;
      },
      signIn: () => {
        window.location = `${authURLs.location.replace('%S', retUrl).replace('member?', '#!/member?')}&regSource=${regSource}`;
      },
      signUp: () => {
        window.location = `${authURLs.location.replace('%S', retUrl).replace('member?', '#!/member?')}&mode=signUp&regSource=${regSource}`;
      },
    };
  }, [location]);

  return (
    <div styleName="header-container">
      <NavComponent
        toolName={pageCfg.toolName}
        toolRoot={pageCfg.toolRoot}
        user={isAuthenticated ? user : undefined}
        signIn={signIn}
        signOut={signOut}
        signUp={signUp}
        currentLocation={location.pathname}
      >
        <div styleName="loader">
          <LoadingIndicator />
        </div>
      </NavComponent>
    </div>
  );
};
TopcoderHeader.defaultProps = {
  auth: {},
  location: typeof window === 'undefined' ? {} : window.location,
};

TopcoderHeader.propTypes = {
  auth: PT.shape(),
  location: PT.shape(), // sent from withRouter
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(withRouter(TopcoderHeader));
