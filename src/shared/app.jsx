/**
 * The shared part of Topcoder Community App. This code is further wrapped in
 * different ways by Webpack and ExpressJS server to properly support both
 * client- and server-side rendering.
 */

import React from 'react';
import { Helmet } from 'react-helmet';

import Routes from 'routes';
import ErrorMessage from 'containers/ErrorMessage';
import ErrorIcons from 'containers/ErrorIcons';

import { DevTools, isomorphy, config } from 'topcoder-react-utils';

import ExtendedReduxToastr from 'containers/Toastr';
import Gamification from 'containers/Gamification';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

import 'styles/awesome.css';

import 'styles/global.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  require('topcoder-react-ui-kit/dist/prod/style.css');
} else {
  require('topcoder-react-ui-kit/dist/dev/style.css');
}
/* eslint-enable global-require */

export default function App() {
  if (!isomorphy.isClientSide()) {
    return null;
  }

  return (
    <div>
      <Helmet htmlAttributes={{ lang: 'en' }}>
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/challenges/manifest.json" />
        <script src={config.URL.ABANDONMENT_EMBED} async />
        <script type="text/javascript" src="//cdn-3.convertexperiments.com/js/10005965-10006774.js" />
      </Helmet>
      <Routes />
      <ErrorMessage />
      <ErrorIcons />
      <ExtendedReduxToastr
        preventDuplicates
        position="top-center"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar={false}
        showCloseButton
      />
      {isomorphy.isDevBuild() ? <DevTools /> : undefined}
      {
        config.GAMIFICATION.ENABLE_SKILLS_REMIND_MODAL ? <Gamification /> : undefined
      }
    </div>
  );
}
