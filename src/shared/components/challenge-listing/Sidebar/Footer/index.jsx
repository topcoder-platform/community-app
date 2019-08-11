/**
 * Sidebar footer. Contains About / Contact / Help / Privacy / Terms links
 * and Topcoder copyright.
 */

import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import { config } from 'topcoder-react-utils';
import './style.scss';

export default function Footer({
  hideTcLinksInFooter,
}) {
  const goToLink = (url) => {
    window.open(url);
  };
  return (
    <div styleName="sidebar-footer">
      {
        hideTcLinksInFooter ? null : (
          <ul>
            <li>
              <a role="link" onKeyPress={() => goToLink(`${config.URL.BASE}/about`)} onClick={() => goToLink(`${config.URL.BASE}/about`)} aria-label="About" tabIndex="0">
About
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a role="link" onKeyPress={() => goToLink(`${config.URL.HELP}/hc/en-us/articles/219069687-Contact-Support`)} onClick={() => goToLink(`${config.URL.HELP}/hc/en-us/articles/219069687-Contact-Support`)} aria-label="Contact" tabIndex="0">
Contact
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a role="link" onKeyPress={() => goToLink(config.URL.HELP)} onClick={() => goToLink(config.URL.HELP)} aria-label="Help" tabIndex="0">
Help
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a role="link" onKeyPress={() => goToLink(`${config.URL.BASE}/community/how-it-works/privacy-policy/`)} onClick={() => goToLink(`${config.URL.BASE}/community/how-it-works/privacy-policy/`)} aria-label="Privacy" tabIndex="0">
Privacy
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a role="link" onKeyPress={() => goToLink(`${config.URL.BASE}/community/how-it-works/terms/`)} onClick={() => goToLink(`${config.URL.BASE}/community/how-it-works/terms/`)} aria-label="Terms" tabIndex="0">
Terms
              </a>
            </li>
          </ul>
        )
      }
      <p styleName="copyright">
Topcoder ©
        {moment().year()}
      </p>
    </div>
  );
}

Footer.defaultProps = {
  hideTcLinksInFooter: false,
};

Footer.propTypes = {
  hideTcLinksInFooter: PT.bool,
};
