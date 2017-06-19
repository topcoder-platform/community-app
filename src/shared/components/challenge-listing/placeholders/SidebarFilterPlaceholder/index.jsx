/**
 *  The component displays a Sidebar Placeholder without any data.
 *  The empty data is replaced with grey background.
 */

import React from 'react';
import Footer from '../../SideBarFilters/Footer';
import { MODE } from '../../SideBarFilters/SideBarFilter';
import './style.scss';

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
    <Footer />
  </div>
);

SidebarFilterPlaceholder.defaultProps = {
};

SidebarFilterPlaceholder.propTypes = {

};

export default SidebarFilterPlaceholder;
