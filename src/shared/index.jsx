/**
 * The shared part of Topcoder Community App. This code is further wrapped in
 * different ways by Webpack and ExpressJS server to properly support both
 * client- and server-side rendering.
 */

import React from 'react';
import Routes from 'routes';

const IS_DEV = process.env.NODE_ENV === 'development' && !!process.env.DEV_TOOLS;
const DevTools = IS_DEV ? require('containers/DevTools').default : undefined;

export default function App() {
  return (
    <div>
      <Routes />
      {!!process.env.DEV_TOOLS && <DevTools /> }
    </div>
  );
}
