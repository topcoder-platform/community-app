import React from 'react';
import './styles.scss';

const FailedToLoad = () => (
  <div styleName="container">
    <div styleName="failed-to-load">
      <h2>
        <span />
        There was an error loading the review opportunity!
      </h2>
      <p>
        Please try again later and if the issue persists contact us at
        <a href="mailto:support@topcoder.com">
          support@topcoder.com
        </a>
        to resolve the issue as soon as possible.
      </p>
    </div>
  </div>
);

export default FailedToLoad;
