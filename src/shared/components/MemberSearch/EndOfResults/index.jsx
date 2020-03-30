import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const EndOfResults = ({ endOfResultsText }) => (
  <div styleName="end-of-results">{endOfResultsText}</div>
);

EndOfResults.propTypes = {
  endOfResultsText: PropTypes.string,
};

EndOfResults.defaultProps = {
  endOfResultsText: 'End of results',
};

export default EndOfResults;
