import moment from 'moment';
import PT from 'prop-types';
import React from 'react';

import { config } from 'topcoder-react-utils';

import FacebookIcon from './icons/facebook.svg';
import GooglePlusIcon from './icons/google_plus.svg';
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
        <ul>
          <Link to={`${base}/sitemap`}>
SITE MAP
          </Link>
          <Link to={`${base}/about`}>
ABOUT US
          </Link>
          <Link to={`${config.URL.HELP}/hc/en-us/articles/219069687-Contact-Support`}>
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
        </ul>
      </nav>
      <div styleName="social-links">
        <hr />
        <a href="https://www.facebook.com/topcoder" target="fbwindow">
          <FacebookIcon />
        </a>
        <a href="http://www.twitter.com/topcoder" target="twwindow">
          <TwitterIcon />
        </a>
        <a href="https://www.linkedin.com/company/topcoder" target="liwindow">
          <LinkedInIcon />
        </a>
        <a href="https://plus.google.com/u/0/b/104268008777050019973/104268008777050019973/posts" target="gpwindow">
          <GooglePlusIcon />
        </a>
      </div>
      <p styleName="copyright-notice">
        {`© ${currentYear} Topcoder. All Rights Reserved`}
      </p>
    </div>
  );
}
