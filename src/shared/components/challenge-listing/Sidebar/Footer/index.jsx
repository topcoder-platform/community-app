/**
 * Sidebar footer. Contains About / Contact / Help / Privacy / Terms links
 * and Topcoder copyright.
 */

import config from 'utils/config';
import React from 'react';
import './style.scss';

export default function Footer() {
  return (
    <div styleName="sidebar-footer">
      <ul>
        <li><a href={`${config.URL.BASE}/about`}>About</a>&nbsp;•&nbsp;</li>
        <li><a href={`${config.URL.HELP}/hc/en-us/articles/219069687-Contact-Support`}>Contact</a>&nbsp;•&nbsp;</li>
        <li><a href={config.URL.HELP}>Help</a>&nbsp;•&nbsp;</li>
        <li><a href={`${config.URL.BASE}/community/how-it-works/privacy-policy/`}>Privacy</a>&nbsp;•&nbsp;</li>
        <li><a href={`${config.URL.BASE}/community/how-it-works/terms/`}>Terms</a></li>
      </ul>
      <p styleName="copyright">Topcoder © 2017</p>
    </div>
  );
}
