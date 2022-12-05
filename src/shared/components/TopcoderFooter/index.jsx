/* global tcUniNav */
import React, { useEffect, useRef } from 'react';

export default function TopcoderFooter() {
  const footerRef = useRef();

  useEffect(() => {
    if (!window.footerInitialized) {
      tcUniNav('init', 'footerNav', {
        type: 'footer',
        onReady: () => {
          window.footerInitialized = true;
          window.footerContent = footerRef.current;
        },
      });
    } else {
      document.getElementById('footerNav').innerHTML = window.footerContent.innerHTML;
    }
  }, []);

  return <div id="footerNav" ref={footerRef} />;
}
