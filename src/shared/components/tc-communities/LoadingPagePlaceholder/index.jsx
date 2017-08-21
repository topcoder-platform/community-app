/**
 * Placeholder to show while we are loading community code chunks, metadata,
 * etc. At the moment it is just a loading indicator centered in the page.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import './style.scss';

export default function LoadingPagePlaceholder() {
  return <div styleName="loading"><LoadingIndicator /></div>;
}
