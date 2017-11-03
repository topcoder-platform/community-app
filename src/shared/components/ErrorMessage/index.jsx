/**
 * This component will show a modal window detailing an error.
 * It is displayed by calling fireErrorMessage from utils/errors and should not
 * be used directly.
 */

/* eslint-env browser */

import React from 'react';
import PT from 'prop-types';
import { DangerButton } from 'components/buttons';
import config from 'utils/config';

import './styles.scss';

class ErrorMessage extends React.Component {
  componentDidMount() {
    document.body.classList.add('scrolling-disabled-by-modal');
  }

  componentWillUnmount() {
    document.body.classList.remove('scrolling-disabled-by-modal');
  }

  render() {
    const {
      title,
      details,
      onOk,
    } = this.props;

    return (
      <div id="error-alert-container" styleName="overlay">
        <div
          styleName="container"
          onWheel={event => event.stopPropagation()}
        >
          <p styleName="title">{title}</p>
          <p styleName="details">{details}</p>
          <p styleName="details">We are sorry you have encountered this problem. Please log the issue into our <a href={config.URL.COMMUNITY_APP_GITHUB_ISSUES} target="_blank" rel="noopener noreferrer">GitHub repository</a> so that we can fix it as soon as possible</p>
          <DangerButton
            onClick={(e) => {
              e.preventDefault();
              onOk();
            }}
          >OK</DangerButton>
        </div>
      </div>
    );
  }
}

/**
 * Prop Validation
 */
ErrorMessage.propTypes = {
  title: PT.string.isRequired,
  details: PT.string.isRequired,
  onOk: PT.func.isRequired,
};

export default ErrorMessage;
