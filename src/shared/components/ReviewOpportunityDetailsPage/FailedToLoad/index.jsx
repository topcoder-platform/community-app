import React from 'react';
import './styles.scss';

const FailedToLoad = () => (
  <div styleName="failed-to-load">
    <h2>
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
);

export default FailedToLoad;
