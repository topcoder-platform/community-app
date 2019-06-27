/**
 * Alternative footer for Topcoder sub-communities. It is just a gray stripe,
 * where dark gray TC logo and (c) msg are rendered.
 */

import React from 'react';

import TopcoderLogoGray from '../../../../assets/images/tc-communities/logo_topcoder_gray.svg';
import './style.scss';
import moment from 'moment';

export default function Footer2() {
  return (
    <div styleName="footer">
      <div styleName="content">
        <TopcoderLogoGray />
        <span styleName="copyright">
&copy; Topcoder, {moment().year()}
        </span>
        <div styleName="right">
          <a
            href="https://www.topcoder.com/about-topcoder/"
            rel="noopener noreferrer"
            target="_blank"
          >
About
          </a>
          &bull;
          <a
            href="https://help.topcoder.com/hc/en-us/articles/219069687-Contact-Support"
            rel="noopener noreferrer"
            target="_blank"
          >
Contact
          </a>
          &bull;
          <a
            href="https://help.topcoder.com/hc/en-us"
            rel="noopener noreferrer"
            target="_blank"
          >
Help
          </a>
          &bull;
          <a
            href="https://www.topcoder.com/community/how-it-works/privacy-policy/"
            rel="noopener noreferrer"
            target="_blank"
          >
Privacy
          </a>
          &bull;
          <a
            href="https://www.topcoder.com/community/how-it-works/terms/"
            rel="noopener noreferrer"
            target="_blank"
          >
Terms
          </a>
        </div>
      </div>
    </div>
  );
}
