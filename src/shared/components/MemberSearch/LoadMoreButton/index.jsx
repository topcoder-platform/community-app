import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const LoadMoreButton = ({ callback, loading }) => (
  <button type="button" styleName="load-more" onClick={callback}>
    {loading ? 'Loading...' : 'Load More'}
  </button>
);


LoadMoreButton.propTypes = {
  callback: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

LoadMoreButton.defaultProps = {
  loading: false,
};

export default LoadMoreButton;
