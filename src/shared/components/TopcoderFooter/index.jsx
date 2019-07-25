import moment from 'moment';
import PT from 'prop-types';
import React from 'react';

import { config } from 'topcoder-react-utils';

import FacebookIcon from './icons/facebook.svg';
import InstagramIcon from './icons/instagram.svg';
import LinkedInIcon from './icons/linkedin.svg';
import TwitterIcon from './icons/twitter.svg';

import './style.scss';

function Link({
  children,
  to,
}) {
  return (
    <li styleName="link">
      <a href={to}>
        {children}
      </a>
    </li>
  );
}

Link.propTypes = {
  to: PT.string.isRequired,
  children: PT.node.isRequired,
};

export default function TopcoderFooter() {
  const base = config.URL.BASE;
  const currentYear = moment().year();
  return (
    <div styleName="footer">
      <nav>
        <ol>
          <Link to={`${base}/community/about`}>
ABOUT US
          </Link>
          <Link to={`${base}/community/contact`}>
CONTACT US
          </Link>
          <Link to={config.URL.HELP}>
HELP CENTER
          </Link>
          <Link to={`${base}/community/how-it-works/privacy-policy/`}>
PRIVACY POLICY
          </Link>
          <Link to={`${base}/community/how-it-works/terms/`}>
TERMS
          </Link>
        </ol>
      </nav>
      <div styleName="social-links">
        <hr />
        <a href="https://www.facebook.com/topcoder" target="fbwindow" aria-label="Facebook">
          <FacebookIcon />
        </a>
        <a href="http://www.twitter.com/topcoder" target="twwindow" aria-label="Twitter">
          <TwitterIcon />
        </a>
        <a href="https://www.linkedin.com/company/topcoder" target="liwindow" aria-label="Linkedin">
          <LinkedInIcon />
        </a>
        <a href="https://www.instagram.com/topcoder" target="inwindow" aria-label="Instagram">
          <InstagramIcon />
        </a>
      </div>
      <p styleName="copyright-notice">
        {`© ${currentYear} Topcoder. All Rights Reserved`}
      </p>
    </div>
  );
}
