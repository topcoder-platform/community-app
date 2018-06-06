/**
 * Top Banner component of Assets page IoT community
 */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

const TopBanner = ({
  display,
  toggleGrid,
  toggleList,
}) => {
  const gridBtnStyleName = `switch-to-grid ${display === 'grid' ? 'active' : ''}`;
  const listBtnStyleName = `switch-to-list ${display === 'list' ? 'active' : ''}`;

  return (
    <div styleName="assets-header">
      <h1>Predix Assets</h1>
      <div styleName="description">
        <p>Download the latest Predix assets created by Topcoder members to accelerate your Predix learning, and be sure to check out the latest Predix challenges. Your winning code could be posted next!</p>
      </div>

      <div styleName="view-mode">
        <a styleName={gridBtnStyleName} onClick={toggleGrid} />
        <a styleName={listBtnStyleName} onClick={toggleList} />
      </div>
    </div>);
};

TopBanner.propTypes = {
  display: PT.string,
  toggleGrid: PT.func,
  toggleList: PT.func,
};
TopBanner.defaultProps = {
  display: '',
  toggleGrid: () => {},
  toggleList: () => {},
};

export default TopBanner;
