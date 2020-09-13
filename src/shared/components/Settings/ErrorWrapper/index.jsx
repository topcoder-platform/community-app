/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

export default class ErrorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      info: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      hasError: true,
      info: errorInfo.componentStack,
    });
  }

  render() {
    const { hasError, info } = this.state;
    const { children } = this.props;
    let isCurrentTab = false;

    if (hasError) {
      if (info.toString().includes(children.type.displayName)) {
        isCurrentTab = true;
      }

      if (isCurrentTab) {
        return (
          <div styleName="container">
            <h4>{`There was an issue loading the ${children.type.displayName}`}</h4>
          </div>
        );
      }

      return children;
    }

    return children;
  }
}

ErrorWrapper.propTypes = {
  children: PT.any.isRequired,
};
