/**
 * This module implements ExpressJS middleware for server-side rendering of
 * the App.
 */

import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from '../shared';

export default (req, res) => {
  const appHtml = ReactDOM.renderToString((
    <StaticRouter
      context={{}}
      location={req.url}
    >
      <App />
    </StaticRouter>
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
        <script type="application/javascript" src="/bundle.js"></script>
      </body>
    </html>`
  ));
};
