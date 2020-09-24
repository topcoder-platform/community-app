import React from 'react';

/**
 * Get window size
 */
export default function useWindowSize() {
  const isSSR = typeof window !== 'undefined';
  const [windowSize, setWindowSize] = React.useState({
    width: isSSR ? window.innerWidth : 1200,
    height: isSSR ? window.innerHeight : 800,
  });

  function changeWindowSize() {
    setWindowSize({
      width: isSSR ? window.innerWidth : 1200,
      height: isSSR ? window.innerHeight : 800,
    });
  }

  React.useEffect(() => {
    window.addEventListener('resize', changeWindowSize);

    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  }, []);

  return windowSize;
}
