/* global tcUniNav */
import React, { useEffect, useRef, useState } from 'react';
import { getSubPageConfiguration } from '../../utils/url';

let uniqueId = 0;

export default function TopcoderFooter() {
  const footerRef = useRef();
  const footerInitialized = useRef(false);
  const [footerId, setFooterId] = useState(0);
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);

  useEffect(() => {
    uniqueId += 1;
    setFooterId(uniqueId);
  }, []);

  useEffect(() => {
    if (footerInitialized.current || !footerId) {
      return;
    }

    footerInitialized.current = true;
    let { fullFooter } = getSubPageConfiguration();

    // If url contains navTool url parameter. Overwrite settings with parameter.
    if (urlParams.get('navTool')) {
      if (urlParams.get('navTool') === 'tool') {
        fullFooter = false;
      } else {
        fullFooter = true;
      }
    }

    tcUniNav('init', `footerNav-${footerId}`, {
      type: 'footer',
      fullFooter,
    });
  }, [footerId]);

  return <div id={`footerNav-${footerId}`} ref={footerRef} />;
}
