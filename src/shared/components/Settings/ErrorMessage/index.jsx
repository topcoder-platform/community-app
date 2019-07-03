import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const marginTop = (value) => {
  if (value) {
    return 'active-margin';
  }

  return 'active';
};

const ErrorMessage = ({ invalid, message, addMargin }) => (
  <span styleName={`error-message ${invalid ? marginTop(addMargin) : ''}`}>
    {message}
  </span>
);

ErrorMessage.defaultProps = {
  addMargin: false,
};

ErrorMessage.propTypes = {
  invalid: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  addMargin: PropTypes.bool,
};

export default ErrorMessage;
