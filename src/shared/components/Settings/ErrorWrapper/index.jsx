/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PT from 'prop-types';
import { logger } from 'topcoder-react-lib';

import './styles.scss';

export default class ErrorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    const { children } = this.props;

    if (error) {
      logger.error(error, errorInfo);

      return (
        <div styleName="container">
          { process.env.NODE_ENV !== 'production' ? `${error.name}: ${error.message}` : 'There was an issue loading the page' }
        </div>
      );
    }

    return children;
  }
}

ErrorWrapper.propTypes = {
  children: PT.any.isRequired,
};
