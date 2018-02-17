/**
 * The shared part of Topcoder Community App. This code is further wrapped in
 * different ways by Webpack and ExpressJS server to properly support both
 * client- and server-side rendering.
 */

import React from 'react';
import Routes from 'routes';
import ErrorMessage from 'containers/ErrorMessage';
import ErrorIcons from 'containers/ErrorIcons';

import 'topcoder-react-ui-kit/dist/style.css';

import 'styles/global.scss';
import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

const USE_DEV_TOOLS = Boolean(process.env.DEV_TOOLS);
const DevTools = USE_DEV_TOOLS ? require('containers/DevTools').default : undefined;

export default function App() {
  return (
    <div>
      <Routes />
      <ErrorMessage />
      <ErrorIcons />
      { USE_DEV_TOOLS ? <DevTools /> : undefined }
    </div>
  );
}
