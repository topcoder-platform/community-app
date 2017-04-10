/**
 * The DevGreeting component shows basic info about the Topcoder Community App
 * and gives links to various examples for newcomer developers. It also serves
 * as an example of simple presentational ReactJS component itself.
 */

import React from 'react';
import { Link } from 'react-router-dom';

import './style.scss';

export default function Content() {
  return (
    <div styleName="Content">
      <h1>Topcoder Community App</h1>
      <p>Isomorphic ReactJS App for new version of Topcoder community website.
        Technological stack includes:</p>
      <ul>
        <li>Autoprefixer;</li>
        <li>
          Babel with latest JS standard support both client- and server-side;
        </li>
        <li>ESlint (AirBnB style, run with <code>$ npm run lint:js</code>);</li>
        <li>ExpressJS server;</li>
        <li>Font loading (Roboto fonts are included into the repo);</li>
        <li>General Topcoder styles (check <code>/src/styles</code>);</li>
        <li>
          Hot reload of JS code and SCSS styles in dev environment (start it
          with <code>$ npm run dev</code>);
        </li>
        <li>
          Loading of .svg assets as ReactJS components
          with <code>babel-plugin-inline-react-svg</code>;
        </li>
        <li>ReactJS;</li>
        <li>
          React CSS Modules
          (with <code>babel-plugin-react-css-modules</code>);
        </li>
        <li>
          Redux with Flex Standard Actions, redux-promise middleware,
          and a custom pattern of server-side data fetching;
        </li>
        <li>SCSS styles;</li>
        <li>Topcoder API v2 and v3 service
          (see <code>/src/shared/services/api.js</code>), with support of TC
          authentication (look for auth tokens either
          in <code>store.auth</code> of Redux store, or
          in <code>tctV3</code> and <code>tcjwt</code> cookies of the front-end
          requests to the server);
        </li>
        <li>Stylefmt;</li>
        <li>
          Stylelint for SCSS (standard Stylelint style, run
          with <code>$ npm run lint:scss</code>;
        </li>
        <li>Webpack;</li>
      </ul>
      <h3>New Topcoder Pages</h3>
      <ul>
        <li>
          <a href="/challenge/30050696/my-submissions">Submission Management
          Page</a> &ndash; New submission management page, is available at
          the endpoint <code>/challenge/:challengeId/my-submissions</code>.
          The link here leads to the test challenge.
        </li>
      </ul>
      <h3>Misc Examples</h3>
      <ul>
        <li>
          <Link to="/examples/css-modules">CSS Modules</Link> - Demo/test of CSS modules in action;
        </li>
        <li>
          <Link to="/examples/data-fetch">Data Fetch</Link> - Demonstrates how
          data fetching should be implemented in
          isomorphic way, using Redux with Flux Standard Actions and
          promise;
        </li>
        <li>
          <Link to="/examples/fonts-test">Fonts Test</Link> - A simple showcase
          of the fonts included into this repo, and the test of their proper
          inclusion into the bundle;
        </li>
        <li>
          <Link to="/examples/svg-loading">SVG Loading</Link> - Shows how to
          load <code>.svg</code> assets with use
          of <code>babel-plugin-inline-react-svg</code>.
        </li>
      </ul>
    </div>
  );
}
