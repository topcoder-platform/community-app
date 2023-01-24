/* global tcUniNav */
import React, { useEffect, useRef } from 'react';
import { getSubPageConfiguration } from '../../utils/url';

const footerElId = 'uninav-footerNav';

export default function TopcoderFooter() {
  const footerRef = useRef();
  const footerInitialized = useRef(false);

  useEffect(() => {
    if (footerInitialized.current) {
      return;
    }

    footerInitialized.current = true;

    let { fullFooter } = getSubPageConfiguration();

    // If url contains navTool url parameter. Overwrite settings with parameter.
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const navToolParam = urlParams.get('navTool');
    if (navToolParam) {
      fullFooter = navToolParam !== 'tool';
    }

    tcUniNav('init', footerElId, {
      fullFooter,
      type: 'footer',
    });
  }, []);

  return <div id={footerElId} ref={footerRef} />;
}
