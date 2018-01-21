import React from 'react';
import { Link } from 'topcoder-react-utils';

import './style.scss';

export default function LinkTest() {
  return (
    <div styleName="container">
      <h1>Link Test</h1>
      <div><Link to="/">Internal Link</Link></div>
      <div><Link to="https://www.google.com">External Link</Link></div>
    </div>
  );
}
