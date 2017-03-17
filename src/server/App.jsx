import React from 'react';
import ReactDOM from 'react-dom/server';
import App from '../shared/App';

const appHtml = ReactDOM.renderToString(<App />);

export default
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
</html>`;
