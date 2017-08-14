import React from 'react';
import './style.scss';

export default function CodeSplitting() {
  return (
    <div styleName="code-splitting">
      <h1>Code Splitting Test</h1>
      <p>
        If code splitting works properly, this page should render nicely and
        look pretty.
      </p>
      <p>
        For a better perspective, how cool and complex it is: Webpack 2+
        documentation on code splitting refer
        &zwnj;<a href="https://reacttraining.com/react-router/web/guides/code-splitting">
          this page
        </a> of <strong>react-router</strong> documentation for further details
        one code splitting implementation for ReactJS. Here is the qoute:
      </p>
      <div styleName="quote">
        <h3>Code-splitting + server rendering</h3>
        <p>We’ve tried and failed a couple of times. What we learned:</p>
        <ol>
          <li>
            You need synchronous module resolution on the server so you can
            get those bundles in the initial render.
          </li>
          <li>
            You need to load all the bundles in the client that were involved
            in the server render before rendering so that the client render
            is the same as the server render. (The trickiest part, I think
            its possible but this is where I gave up.)
          </li>
          <li>
            You need asynchronous resolution for the rest of the client app’s
            life.
          </li>
        </ol>
        <p>
          We determined that google was indexing our sites well
          enough for our needs without server rendering, so we dropped it
          in favor of code-splitting + service worker caching. Godspeed
          those who attempt the server-rendered, code-split apps.
        </p>
        <em styleName="author">From Code Splitting documentation of <strong>react-router</strong></em>
      </div>
      <p>
        So, welcome to Topcoder, where difficult things can be done fast,
        while miracles will take just a bit longer :)
      </p>
      <p>
        Instructions on using our implementation of code splitting are
        &zwnj;<a href="https://github.com/topcoder-platform/community-app/blob/develop/docs/code-splitting.md">available here</a>.
      </p>
    </div>
  );
}
