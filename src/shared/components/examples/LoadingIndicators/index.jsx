import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';

import './style.scss';

export default function Buttons() {
  return (
    <div styleName="page">
      <h1>Loading Indicators</h1>
      <p>
        Demo of loading indicators we have in the code base (at the moment just
        a single one, and it works fine against white background only, as
        demonstrated below).
      </p>
      <div styleName="white-bg">
        <LoadingIndicator />
      </div>

      <p>
        Here is the demo of our loading indicator against non-white backgrounds.
        Hopefully, it will be fixed soon.
      </p>
      <div styleName="black-bg">
        <LoadingIndicator />
      </div>
      <div styleName="striped-bg">
        <LoadingIndicator />
      </div>
    </div>
  );
}
