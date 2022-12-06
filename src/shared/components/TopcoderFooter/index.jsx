/* global tcUniNav */
import React, { useEffect, useRef } from 'react';

export default function TopcoderFooter() {
  const footerRef = useRef();
  const footerInitialized = useRef(false);

  useEffect(() => {
    if (footerInitialized.current) {
      return;
    }

    footerInitialized.current = true;

    tcUniNav('init', 'footerNav', {
      type: 'footer',
    });
  }, []);

  return <div id="footerNav" ref={footerRef} />;
}
