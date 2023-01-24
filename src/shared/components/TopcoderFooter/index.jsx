/* global tcUniNav */
import React, { useEffect, useRef, useState } from 'react';
import { getSubPageConfiguration } from '../../utils/url';

let uniqueId = 0;

export default function TopcoderFooter() {
  const footerRef = useRef();
  const footerInitialized = useRef(false);
  const [footerId, setFooterId] = useState(0);

  useEffect(() => {
    uniqueId += 1;
    setFooterId(uniqueId);
  }, []);

  useEffect(() => {
    if (footerInitialized.current || !footerId) {
      return;
    }

    footerInitialized.current = true;

    // If url contains navTool url parameter. Overwrite settings with parameter.
    let isFullFooter = false;
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    if (urlParams.get('navTool') === 'tool') {
      isFullFooter = false;
    } else if (urlParams.get('navTool') === 'marketing') {
      isFullFooter = true;
    } else {
      isFullFooter = getSubPageConfiguration().fullFooter;
    }

    tcUniNav('init', `footerNav-${footerId}`, {
      type: 'footer',
      fullFooter: isFullFooter,
    });
  }, [footerId]);

  return <div id={`footerNav-${footerId}`} ref={footerRef} />;
}
