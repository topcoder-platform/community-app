/**
 * NewsletterSignup component
 */

/* global window */

import fetch from 'isomorphic-fetch';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { themr } from 'react-css-super-themr';
import { errors } from 'topcoder-react-lib';
import qs from 'qs';

import { config } from 'topcoder-react-utils';

import defaultStyle from './style.scss';

const { fireErrorMessage } = errors;

class NewsletterSignup extends React.Component {
  subscribe() {
    const { apikey, url } = this.props;
    if (!apikey || !url) {
      fireErrorMessage('NewsletterSignup logic is not implemented yet!', '');
    } else {
      const formData = qs.stringify({
        [apikey]: '',
        EMAIL: this.email.value,
      });
      fetch(`/community-app-assets/api/proxy-post?url=${encodeURIComponent(url)}`, {
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `ApiKey ${config.SERVER_API_KEY}`,
        },
        method: 'POST',
      }).then(res => res.text())
        .then((res) => { window.document.write(res); });
    }
  }

  render() {
    const {
      imageSrc,
      title,
      text,
      buttonText,
      emailPlaceholder,
      theme,
    } = this.props;
    return (
      <div
        className={theme.container}
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className={theme.content}>
          <h2 className={theme.title}>
            {title}
          </h2>
          <p className={theme.text}>
            {text}
          </p>
          <div className={theme.form}>
            <input
              className={theme.formEmail}
              placeholder={emailPlaceholder}
              ref={(node) => { this.email = node; }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') this.subscribe();
              }}
              type="email"
            />
            <PrimaryButton
              onClick={() => this.subscribe()}
              size="md"
              theme={{ button: theme.formButton }}
            >
              {buttonText}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

NewsletterSignup.defaultProps = {
  apikey: '',
  emailPlaceholder: 'Email address',
  buttonText: 'Sign Up',
  theme: {},
  url: '',
};

NewsletterSignup.propTypes = {
  apikey: PT.string,
  imageSrc: PT.string.isRequired,
  title: PT.string.isRequired,
  text: PT.string.isRequired,
  emailPlaceholder: PT.string,
  buttonText: PT.string,
  theme: PT.shape({
    container: PT.string,
    content: PT.string,
    title: PT.string,
    text: PT.string,
    form: PT.string,
    formEmail: PT.string,
    formButton: PT.string,
  }),
  url: PT.string,
};

export default themr('tcCommunities-NewsletterSignup', defaultStyle)(NewsletterSignup);
