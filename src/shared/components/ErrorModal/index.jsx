/**
 * This component will show a modal window detailing an error.
 * It is displayed by calling utils/errorAlert and should not be used directly.
 */

/* eslint-env browser */

import { PrimaryButton } from 'components/buttons';
import React from 'react';

import './styles.scss';

const GITHUB_URL = 'https://github.com/topcoder-platform/community-app/issues';

const ErrorModal = () => (
  <div id="error-alert-container" styleName="overlay">
    <div
      styleName="container"
      onWheel={event => event.stopPropagation()}
    >
      <p styleName="title" id="error-alert-title" />
      <p styleName="details" id="error-alert-details" />
      <p styleName="details">We are sorry you have encountered this problem. Please log the issue into our <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub repository</a> so that we can fix it as soon as possible</p>
      <PrimaryButton
        onClick={() => {
          document.getElementById('error-alert-container').style.display = 'none';
          document.body.classList.remove('scrolling-disabled-by-modal');
        }}
      >OK</PrimaryButton>
    </div>
  </div>
);

export default ErrorModal;
