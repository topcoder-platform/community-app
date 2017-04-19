/**
 * This module implements ExpressJS middleware for server-side rendering of
 * the App.
 */

import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom/server'; // This may cause warning of PropTypes
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import serializeJs from 'serialize-javascript';

import App from '../shared';

/* This is always initial state of the store. Later we'll have to provide a way
 * to put the store into correct state depending on the demanded route. */
import storeFactory from '../shared/store-factory';

export default (req, res) => {
  storeFactory(req).then((store) => {
    const context = {};
    const appHtml = ReactDOM.renderToString((
      <Provider store={store}>
        <StaticRouter
          context={context}
          location={req.url}
        >
          <App />
        </StaticRouter>
      </Provider>
    ));
    if (context.status) res.status(context.status);
    res.send((
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Topcoder</title>
          ${
            /* In dev environment we should not load style.css, instead we rely
             * on styles embed into JS bundle. This slows down page loading in
             * dev, but helps to avoid styling inconsitencies due to HMR use,
             * and differences between pre-compiled stylesheet and the styles
             * bundled into JS. */
            /* TODO: Can we do it in a better way, to improve page rendering
             * time in dev? This discussion may have the solution:
             * https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/30
            */
            '<link rel="stylesheet" href="/style.css" />'
          }
        </head>
        <body>
          <div id="react-view">${appHtml}</div>
          <script type="application/javascript">
            window.CONFIG = ${serializeJs(config, { isJSON: true })}
            window.ISTATE = ${serializeJs(store.getState(), { isJSON: true })}
          </script>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>`
    ));
  });
};
