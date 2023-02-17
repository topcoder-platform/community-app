/* global tcUniNav */
import React, { useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import LoadingIndicator from 'components/LoadingIndicator';
import { getSubPageConfiguration } from '../../utils/url';
import { SSRPlaceholder } from '../../utils/SSR';
import './styles.scss';

let counter = 0;
const headerElIdTmpl = 'uninav-headerNav';

const TopcoderHeader = () => {
  const uniNavInitialized = useRef(false);
  const authURLs = config.HEADER_AUTH_URLS;
  const headerRef = useRef();
  const headerElId = useRef(`${headerElIdTmpl}-${counter}`);

  const navType = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    let { type } = getSubPageConfiguration();

    // if there's a stored nav type in session storage, retrieve it and overwrite type
    const sessionNavType = sessionStorage.getItem('uni-nav[navType]');
    const url = new URL(window.location.href);

    // Only use the set sessionStorage value for navType on the /thrive paths, for now.
    // Probably will change in the future...
    if (window.location.href.indexOf('/thrive') > -1 && sessionNavType && (sessionNavType === 'tool' || sessionNavType === 'marketing')) {
      type = sessionNavType;
    }

    // If url contains navTool url parameter. Overwrite settings with parameter.
    const urlParams = new URLSearchParams(url.search);
    if (urlParams.get('navTool')) {
      type = urlParams.get('navTool');
    }

    // store nav type for current session
    sessionStorage.setItem('uni-nav[navType]', type);
    return type;
  }, []);

  useEffect(() => {
    if (uniNavInitialized.current) {
      return;
    }
    headerRef.current.id = headerElId.current;

    uniNavInitialized.current = true;
    counter += 1;

    const regSource = window.location.pathname.split('/')[1];
    const retUrl = encodeURIComponent(window.location.href);

    tcUniNav('init', headerElId.current, {
      type: navType,
      toolName: getSubPageConfiguration(user.handle).toolName,
      toolRoot: getSubPageConfiguration(user.handle).toolRoot,
      user: 'auto',
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
  }, [navType]);

  useEffect(() => {
    tcUniNav('update', headerElId.current, {
      toolName: getSubPageConfiguration(user.handle).toolName,
      user: isAuthenticated ? navigationUserInfo : null,
    });
  }, [isAuthenticated, navigationUserInfo]);

  return (
    <div styleName="header-container" id={headerElId.current} ref={headerRef} />
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const TopcoderHeaderConnect = connect(mapStateToProps, null)(TopcoderHeader);

const TopcoderHeaderPlaceholder = () => (
  <div styleName="header-container header-container-placeholder">
    <LoadingIndicator />
  </div>
);

export default SSRPlaceholder()(
  TopcoderHeaderConnect,
  TopcoderHeaderPlaceholder,
);
