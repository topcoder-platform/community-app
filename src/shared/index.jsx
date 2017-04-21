/**
 * The shared part of Topcoder Community App. This code is further wrapped in
 * different ways by Webpack and ExpressJS server to properly support both
 * client- and server-side rendering.
 */


import React from 'react';
import Routes from 'routes';

let DevTools;
const IS_DEV = process.env.NODE_ENV === 'development';
if (IS_DEV) {
  DevTools = require('containers/DevTools').default; // eslint-disable-line
}

export default function App() {
  return (
    <div>
      <Routes />
      <DevTools />
    </div>
  );
}
