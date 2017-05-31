/**
 *  The component displays a Sidebar Placeholder without any data.
 *  The empty data is replaced with grey background.
 */

import React from 'react';
import { MODE } from '../../SideBarFilters/SideBarFilter';
import './style.scss';

const domain = '';

const SidebarFilterPlaceholder = () => (
  <div styleName="SideBarFilters placeholder">
    <div styleName="FilterBox">
      <div styleName="FilterItem highlighted">
        <span styleName="left">{MODE.ALL_CHALLENGES}</span>
      </div>
      <div styleName="FilterItem">
        <span styleName="left">{MODE.OPEN_FOR_REGISTRATION}</span>
      </div>
      <div styleName="FilterItem">
        <span styleName="left">{MODE.ONGOING_CHALLENGES}</span>
      </div>
      <div styleName="FilterItem">
        <span styleName="left">{MODE.OPEN_FOR_REVIEW}</span>
      </div>
      <hr />
      <div styleName="FilterItem">
        <span styleName="left">{MODE.PAST_CHALLENGES}</span>
      </div>
      <hr />
      <div styleName="get-rss">
        <a href={'RSS_LINK'}>Get the RSS feed</a>
      </div>
    </div>
    <div styleName="sidebar-footer">
      <ul>
        <li><a href={`https://www.${domain}/about`}>About</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://help.${domain}/hc/en-us/articles/219069687-Contact-Support`}>Contact</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://help.${domain}`}>Help</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://www.${domain}/community/how-it-works/privacy-policy/`}>Privacy</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://www.${domain}/community/how-it-works/terms/`}>Terms</a></li>
      </ul>
      <p styleName="copyright">Topcoder © 2017</p>
    </div>
  </div>
);

SidebarFilterPlaceholder.defaultProps = {
};

SidebarFilterPlaceholder.propTypes = {

};

export default SidebarFilterPlaceholder;
