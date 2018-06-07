/**
 * The shared part of Topcoder Community App. This code is further wrapped in
 * different ways by Webpack and ExpressJS server to properly support both
 * client- and server-side rendering.
 */

import React from 'react';

import Routes from 'routes';
import ErrorMessage from 'containers/ErrorMessage';
import ErrorIcons from 'containers/ErrorIcons';

import { DevTools, isomorphy } from 'topcoder-react-utils';

import ExtendedReduxToastr from 'containers/toastr';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'topcoder-react-ui-kit/dist/style.css';

import 'styles/awesome.css';

import 'styles/global.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function App() {
  return (
    <div>
      <Routes />
      <ErrorMessage />
      <ErrorIcons />
      <ExtendedReduxToastr
        preventDuplicates
        position="top-center"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar={false}
      />
      { isomorphy.isDevBuild() ? <DevTools /> : undefined }
    </div>
  );
}
