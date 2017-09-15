/**
 * Alternative footer for Topcoder sub-communities. It is just a gray stripe,
 * where dark gray TC logo and (c) msg are rendered.
 */

import React from 'react';

import TopcoderLogoGray from '../../../../assets/images/tc-communities/logo_topcoder_gray.svg';
import './style.scss';

export default function Footer2() {
  return (
    <div styleName="footer">
      <div styleName="content">
        <TopcoderLogoGray />
        <span styleName="copyright">&copy; Topcoder, 2017</span>
      </div>
    </div>
  );
}
