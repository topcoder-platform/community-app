/* global tcUniNav */
import React, { useEffect, useRef, useState } from 'react';

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

    tcUniNav('init', `footerNav-${footerId}`, {
      type: 'footer',
    });
  }, [footerId]);

  return <div id={`footerNav-${footerId}`} ref={footerRef} />;
}
