/**
 * The DevGreeting component shows basic info about the Topcoder Community App
 * and gives links to various examples for newcomer developers. It also serves
 * as an example of simple presentational ReactJS component itself.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { isomorphy } from 'topcoder-react-utils';

import './style.scss';

export default function Content() {
  return (
    <div styleName="container">
      <div styleName="build-timestamp">
Build Timestamp:
        {isomorphy.buildTimestamp()}
      </div>
      <h1>
Topcoder Community App
      </h1>
      <p>
Isomorphic ReactJS App for new version of Topcoder community website.
        Technological stack includes:
      </p>
      <ul>
        <li>
Autoprefixer;
        </li>
        <li>
          Babel with latest JS standard support both client- and server-side;
        </li>
        <li>
ESlint (AirBnB style, run with
          <code>
$ npm run lint:js
          </code>
);
        </li>
        <li>
ExpressJS server;
        </li>
        <li>
Font loading (Roboto fonts are included into the repo);
        </li>
        <li>
General Topcoder styles (check
          <code>
/src/styles
          </code>
);
        </li>
        <li>
          Hot reload of JS code and SCSS styles in dev environment (start it
          with
          {' '}
          <code>
$ npm run dev
          </code>
);
        </li>
        <li>
          Loading of .svg assets as ReactJS components
          with
          {' '}
          <code>
babel-plugin-inline-react-svg
          </code>
;
        </li>
        <li>
ReactJS;
        </li>
        <li>
          React CSS Modules
          (with
          {' '}
          <code>
babel-plugin-react-css-modules
          </code>
);
        </li>
        <li>
          Redux with Flex Standard Actions, redux-promise middleware,
          and a custom pattern of server-side data fetching;
        </li>
        <li>
SCSS styles;
        </li>
        <li>
Topcoder API v2 and v3 service
          (see
          <code>
topcoder-react-lib/src/services/api.js
          </code>
), with support of TC
          authentication (look for auth tokens either
          in
          <code>
store.auth
          </code>
          {' '}
of Redux store, or
          in
          <code>
v3jwt
          </code>
          {' '}
and
          <code>
tcjwt
          </code>
          {' '}
cookies of the front-end
          requests to the server);
        </li>
        <li>
Stylefmt;
        </li>
        <li>
          Stylelint for SCSS (standard Stylelint style, run
          with
          {' '}
          <code>
$ npm run lint:scss
          </code>
;
        </li>
        <li>
Webpack;
        </li>
      </ul>

      <h3>
Main Topcoder website
      </h3>
      <ul>
        <li>
          <strong>
Challenge Details Page
          </strong>
          {' '}
is available at the
          endpoint
          <code>
/challenges/:challengeId
          </code>
.
          <br />
          Here are some demo
          links valid in
          {' '}
          <strong>
production
          </strong>
          {' '}
environment:
          <br />
          &zwnj;
          <Link to="/challenges/30058637">
data science challenge
          </Link>
,
          &zwnj;
          <Link to="/challenges/30058473">
code challenge
          </Link>
,
          &zwnj;
          <Link to="/challenges/30058433">
design challenge
          </Link>
,
          &zwnj;
          <Link to="/challenges/30058529">
design challenge 2
          </Link>
,
          &zwnj;
          <Link to="/challenges/30058281">
design challenge 3
          </Link>
,
          &zwnj;
          <Link to="/challenges/30057690">
design challenge 4
          </Link>
.
          <br />
          Here are some demo links valid in
          {' '}
          <strong>
development
          </strong>
&zwnj;
          environment:
          <br />
          &zwnj;
          <Link to="/challenges/30049604">
data science challenge
          </Link>
,
          &zwnj;
          <Link to="/challenges/30050680">
code challenge
          </Link>
,
          &zwnj;
          <Link to="/challenges/30050463">
code challenge 2
          </Link>
,
          &zwnj;
          <Link to="/challenges/30049552">
design challenge
          </Link>
,
          &zwnj;
          <Link to="/challenges/30050696">
design challenge 2
          </Link>
.
        </li>
        <li>
          <Link to="/crowd-for-good">
Crowd 4 Good Page
          </Link>
        </li>
        <li>
          <Link to="/my-dashboard">
Dashboard
          </Link>
        </li>
        <li>
          <Link to="/challenges">
Main Challenge Listing
          </Link>
        </li>
        <li>
          <Link to="/community/member-programs">
Member Programs Page
          </Link>
        </li>
        <li>
          Public Profile Page available at the
          {' '}
          <code>
/members/:handle
          </code>
          {' '}
endpoint.
          Valid links on dev:
          <br />
          <Link to="/members/TonyJ">
Profile 1.
          </Link>
          <br />
          <Link to="/members/mess">
Profile 2.
          </Link>
        </li>
        <li>
          Public Profile Page available at the
          {' '}
          <code>
/members/:handle
          </code>
          {' '}
endpoint.
          Valid link on dev
          {' '}
          <Link to="/members/TonyJ">
here.
          </Link>
        </li>
        <li>
          Stand-alone terms of use page:
          &zwnj;
          <Link to="/challenges/terms/detail/21193">
simple
          </Link>
,
          &zwnj;
          <Link to="/challenges/terms/detail/21153">
DocuSign
          </Link>
.
        </li>
        <li>
          <a href="/challenges/30050696/my-submissions">
Submission Management
          Page
          </a>
          {' '}
&ndash; generally available at
          the endpoint
          <code>
/challenges/:challengeId/my-submissions
          </code>
;
          the link here leads to a test challenge.
        </li>
        <li>
          <Link to="/settings/profile">
Settings Profile Page
          </Link>
        </li>
        <li>
          <Link to="/community/development">
            Track Home Page - Development
          </Link>
        </li>
      </ul>

      <h3>
TCO Assets
      </h3>
      <ul>
        <li>
          <Link to="/community/hall-of-fame/tco">TCO Hall of Fame</Link>
        </li>
        <li>
          TCO Scoreboard demo is mounted on
          {' '}
          <code>
/scoreboard/:id
          </code>
,
          where
          {' '}
          <code>
:id
          </code>
          {' '}
is the competition ID, not related to the
          regular challenge IDs. Here are two demo links for the scoreboards
          for the competitions created by the scoreboard init script:
          &zwnj;
          <Link to="/scoreboard/123">
ID = 123
          </Link>
,
          &zwnj;
          <Link to="/scoreboard/1234">
ID = 1234
          </Link>
.
        </li>
      </ul>

      <h3>
Separate Topcoder Communities
      </h3>
      <ul>
        <li>
          <Link to="/__community__/blockchain">
Blockchain Community
          </Link>
        </li>
        <li>
          <Link to="/__community__/cognitive">
Cognitive Community
          </Link>
        </li>
        <li>
          <Link to="/__community__/community-2">
Community 2
          </Link>
        </li>
        <li>
          <Link to="/__community__/cs">
CS community
          </Link>
        </li>
        <li>
          <Link to="/__community__/demo-expert">
Demo Expert Community
          </Link>
        </li>
        <li>
          <Link to="/__community__/iot">
IoT Community
          </Link>
        </li>
        <li>
          <Link to="/__community__/mobile">
Mobile Community
          </Link>
        </li>
        <li>
          <Link to="/__community__/qa">
QA Community
          </Link>
        </li>
        <li>
          <Link to="/__community__/srmx">
SRMX Community
          </Link>
        </li>
        <li>
          <Link to="/__community__/taskforce">
Taskforce community
          </Link>
        </li>
        <li>
          <Link to="/__community__/tc-prod-dev">
Topcoder Product
          Development community
          </Link>
        </li>
        <li>
          <Link to="/__community__/wipro">
TopGear (Wipro) community
          </Link>
        </li>
        <li>
          <Link to="/__community__/veterans">
Veterans Community
          </Link>
        </li>
      </ul>

      <h3>
Previews of Contentful Components
      </h3>
      <ul>
        <li>
          <Link to="/examples/contentful/slider/6VvsA1RgkwaEamS66wiEMy">
            <code>
ContentSlider
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/accordion/2aRYmMs4rmwEIISCag8MOm">
            <code>
Accordion
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/banner/5il6oFtWp2Ua6WGs60M2mK">
            <code>
Banner
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/contentblock/6CVFvEiZFKYQMwW82aYCWS">
            <code>
ContentBlock
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/blogpost/1tKTZsVzk40kSYgG0imCKS">
            <code>
BlogPost
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/blog/TCO Blog/1">
            <code>
Blog
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/quote/3o7LgdSIsougYimQ2GyUw4">
            <code>
Quote
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/video/4U4DkVDy3C0WcImaEw42mw">
            <code>
Video
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/route/4eL1gLh8gU66ewMwIIYu4y">
            <code>
Route
            </code>
          </Link>
        </li>
        <li>
          <Link to="/examples/contentful/viewport/YomgM8zPCoEaUqaKouyGG">
            <code>
Viewport
            </code>
          </Link>
        </li>
      </ul>

      <h3>
Sandbox
      </h3>
      <p>
        The right place to put any experimental and proof-of-concept
        stuff.
      </p>
      <ul>
        <li>
          <Link to="/sandbox/cms/dashboard/announcements">
            A simple list of all published dashboard announcements.
          </Link>
        </li>
        <li>
          <Link to="/sandbox/cms/testing">
            CMS-related testing.
          </Link>
        </li>
      </ul>

      <h3>
Misc Examples
      </h3>
      <ul>
        <li>
          <Link to="/examples/countdown">Countdown</Link>
        </li>
        <li>
          <Link
            to="/examples/announcement/5yaVZtOH9CYoQ0QYQk0uoY"
          >
Announcement
          </Link>
          {' '}
&mdash;
          This is a part of simple PoC for CMS integration (Countentful CMS is
          the currently tested option);
        </li>
        <li>
          <Link to="/examples/buttons/">
Buttons
          </Link>
          {' '}
&mdash; Demo/test of
          standard buttons already available in the code, and customizable with
          help of
          <code>
react-css-themr
          </code>
.
        </li>
        <li>
          <Link to="/examples/carousel">
Carousel
          </Link>
        </li>
        <li>
          <Link to="/examples/code-splitting">
Code Splitting
          </Link>
        </li>
        <li>
          <Link to="/examples/color-mixins">
Color Mixins
          </Link>
          {' '}
&mdash; Live
          demo of TC UI Kit color pallete;
        </li>
        <li>
          <Link to="/examples/css-modules">
CSS Modules
          </Link>
          {' '}
- Demo/test of CSS modules in action;
        </li>
        <li>
          <Link to="/examples/data-fetch">
Data Fetch
          </Link>
          {' '}
- Demonstrates how
          data fetching should be implemented in
          isomorphic way, using Redux with Flux Standard Actions and
          promise;
        </li>
        <li>
          <Link to="/examples/editor">
Editor
          </Link>
        </li>
        <li>
          <Link to="/examples/error-message">
Error Message
          </Link>
          {' '}
- Demonstrates
          UI component for errors messaging;
        </li>
        <li>
          <Link to="/examples/fonts-test">
Fonts Test
          </Link>
          {' '}
- A simple showcase
          of the fonts included into this repo, and the test of their proper
          inclusion into the bundle;
        </li>
        <li>
          <Link
            to="/examples/link-test"
          >
Link Test
          </Link>
        </li>
        <li>
          <Link to="/examples/loading-indicators">
Loading Indicators
          </Link>
        </li>
        <li>
          <Link to="/examples/markdown">
Markdown Rendering
          </Link>
          &zwnj;
          &ndash; A component that can be passed markdown as a prop and will
          render it as native React elements.  Also supports inlining a subset
          of the JSX Components found in Community App.
        </li>
        <li>
          <Link to="/examples/scalable-rect">
ScalableRect
          </Link>
          {' '}
component makes
          it easy to create dynamically scaled components with fixed side ratio.
        </li>
        <li>
          <Link to="/examples/svg-loading">
SVG Loading
          </Link>
          {' '}
- Shows how to
          load
          <code>
.svg
          </code>
          {' '}
assets with use
          of
          <code>
babel-plugin-inline-react-svg
          </code>
.
        </li>
        <li>
          <Link to="/examples/tags/">
Tags
          </Link>
          {' '}
- Demo/test of standard
          tags already available in the code, and customizable with help
          of
          <code>
react-css-themr
          </code>
.
        </li>
        <li>
          <Link to="/examples/themr">
Super Themr
          </Link>
          {' '}
- Test/demo of
          <code>
react-css-super-themr
          </code>
.
        </li>
        <li>
          <Link to="/examples/typography">
Typography
          </Link>
          {' '}
- Most of Topcoder
          websites use the same styleguide for the design. In particular, all
          typography is supposed to use the set of styles from this example.
          For all these styles we have global mixins, which should be used
          whenever possible (but never modified without explicit approval).
        </li>
      </ul>
    </div>
  );
}
