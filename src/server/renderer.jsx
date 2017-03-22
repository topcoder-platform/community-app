/**
 * This module implements ExpressJS middleware for server-side rendering of
 * the App.
 */

import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import serializeJs from 'serialize-javascript';

import App from '../shared';

/* This is always initial state of the store. Later we'll have to provide a way
 * to put the store into correct state depending on the demanded route. */
import storeFactory from '../shared/store-factory';

export default (req, res) => {
  storeFactory(req).then((store) => {
    const appHtml = ReactDOM.renderToString((
      <Provider store={store}>
        <StaticRouter
          context={{}}
          location={req.url}
        >
          <App />
        </StaticRouter>
      </Provider>
    ));
    res.send((
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Topcoder</title>
          <link rel="stylesheet" href="/style.css" />
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
