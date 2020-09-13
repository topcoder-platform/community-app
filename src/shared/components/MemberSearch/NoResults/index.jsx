import React from 'react';
import PropTypes from 'prop-types';
import RobotIcon from '../icons/RobotIcon';

import './style.scss';

const NoResults = ({ entry }) => (
  <div styleName="no-results">
    <p>Sorry, no results found for <span>{entry}</span></p>

    <RobotIcon />
  </div>
);


NoResults.propTypes = {
  entry: PropTypes.string.isRequired,
};

export default NoResults;
