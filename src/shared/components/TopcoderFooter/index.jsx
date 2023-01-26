/* global tcUniNav */
import React, { useEffect, useMemo, useRef } from 'react';
import { getSubPageConfiguration } from '../../utils/url';

let counter = 0;
const footerElIdTmpl = 'uninav-footerNav';

export default function TopcoderFooter() {
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

    footerInitialized.current = true;
    counter += 1;

    tcUniNav('init', footerElId.current, {
      fullFooter: navType !== 'tool',
      type: 'footer',
    });
  }, []);

  return <div id={footerElId.current} ref={footerRef} />;
}
