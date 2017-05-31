/**
 *  The component displays a Sidebar Placeholder without any data.
 *  The empty data is replaced with grey background.
 */

import React from 'react';
import '../../SideBarFilters/SideBarFilters.scss';
import { MODE } from '../../SideBarFilters/SideBarFilter';
import './SidebarFilterPlaceholder.scss';

const domain = '';

const SidebarFilterPlaceholder = () => (
  <div className="SideBarFilters placeholder">
    <div className="FilterBox">
      <div className="FilterItem highlighted">
        <span className="left">{MODE.ALL_CHALLENGES}</span>
      </div>
      <div className="FilterItem">
        <span className="left">{MODE.OPEN_FOR_REGISTRATION}</span>
      </div>
      <div className="FilterItem">
        <span className="left">{MODE.ONGOING_CHALLENGES}</span>
      </div>
      <div className="FilterItem">
        <span className="left">{MODE.OPEN_FOR_REVIEW}</span>
      </div>
      <hr />
      <div className="FilterItem">
        <span className="left">{MODE.PAST_CHALLENGES}</span>
      </div>
      <hr />
      <div className="get-rss">
        <a href={'RSS_LINK'}>Get the RSS feed</a>
      </div>
    </div>
    <div className="sidebar-footer">
      <ul>
        <li><a href={`https://www.${domain}/about`}>About</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://help.${domain}/hc/en-us/articles/219069687-Contact-Support`}>Contact</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://help.${domain}`}>Help</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://www.${domain}/community/how-it-works/privacy-policy/`}>Privacy</a>&nbsp;•&nbsp;</li>
        <li><a href={`https://www.${domain}/community/how-it-works/terms/`}>Terms</a></li>
      </ul>
      <p className="copyright">Topcoder © 2017</p>
    </div>
  </div>
);

SidebarFilterPlaceholder.defaultProps = {
};

SidebarFilterPlaceholder.propTypes = {

};

export default SidebarFilterPlaceholder;
