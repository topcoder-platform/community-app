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
  return (
    <div styleName="sidebar-footer">
      {
        hideTcLinksInFooter ? null : (
          <ul>
            <li>
              <a href={`${config.URL.BASE}/about`} aria-label={`About`}>
About
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a href={`${config.URL.HELP}/hc/en-us/articles/219069687-Contact-Support`} aria-label={`Contact`}>
Contact
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a href={config.URL.HELP} aria-label={`Help`}>
Help
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a href={`${config.URL.BASE}/community/how-it-works/privacy-policy/`} aria-label={`Privacy`}>
Privacy
              </a>
&nbsp;•&nbsp;
            </li>
            <li>
              <a href={`${config.URL.BASE}/community/how-it-works/terms/`} aria-label={`Terms`}>
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
