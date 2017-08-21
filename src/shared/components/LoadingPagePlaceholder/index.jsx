/**
 * Just the loading indicator centered above gray background.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import './style.scss';

export default function LoadingPagePlaceholder() {
  return (
    <div styleName="background">
      <div styleName="page">
        <LoadingIndicator />
      </div>
    </div>
  );
}
