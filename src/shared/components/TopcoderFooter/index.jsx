/* global tcUniNav */
import React, { useEffect, useMemo, useRef } from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import { SSRPlaceholder } from '../../utils/SSR';
import { getSubPageConfiguration } from '../../utils/url';
import './style.scss';

let counter = 0;
const footerElIdTmpl = 'uninav-footerNav';

function TopcoderFooter() {
  const footerRef = useRef();
  const footerInitialized = useRef(false);
  const footerElId = useRef(`${footerElIdTmpl}-${counter}`);

  const navType = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    let { type } = getSubPageConfiguration();

    const sessionNavType = sessionStorage.getItem('uni-nav[navType]');
    if (sessionNavType && (sessionNavType === 'tool' || sessionNavType === 'marketing')) {
      type = sessionNavType;
    }

    // If url contains navTool url parameter. Overwrite settings with parameter.
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    if (urlParams.get('navTool')) {
      type = urlParams.get('navTool');
    }

    return type;
  }, []);

  useEffect(() => {
    if (footerInitialized.current) {
      return;
    }
    footerRef.current.id = footerElId.current;

    footerInitialized.current = true;
    counter += 1;

    tcUniNav('init', footerElId.current, {
      fullFooter: navType !== 'tool',
      type: 'footer',
    });
  }, []);

  return <div id={footerElId.current} ref={footerRef} />;
}

const TopcoderFooterPlaceholder = () => (
  <div styleName="footer-container-placeholder">
    <LoadingIndicator />
  </div>
);

export default SSRPlaceholder()(
  TopcoderFooter,
  TopcoderFooterPlaceholder,
);
