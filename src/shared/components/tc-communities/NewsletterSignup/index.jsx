/**
 * NewsletterSignup component
 *
 * TODO: it's logic is not implemented yet, only design
 *       for now we add global alert and disable no-alert rule
 */
/* global alert */
/* eslint-disable no-alert */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';
import defaultStyle from './style.scss';

function NewsletterSignup(props) {
  const { imageSrc, title, text, buttonText, emailPlaceholder, theme } = props;

  return (
    <div className={theme.container} style={{ backgroundImage: `url(${imageSrc})` }}>
      <div className={theme.content}>
        <h2 className={theme.title}>{title}</h2>
        <p className={theme.text}>{text}</p>
        <div className={theme.form}>
          <input className={theme.formEmail} type="email" placeholder={emailPlaceholder} />
          <button className={theme.formButton} onClick={() => alert('NewsletterSignup logic is not implemented yet.')}>{buttonText}</button>
        </div>
      </div>
    </div>
  );
}

NewsletterSignup.defaultProps = {
  emailPlaceholder: 'Email address',
  buttonText: 'Sign Up',
  theme: {},
};

NewsletterSignup.propTypes = {
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
};

export default themr('tcCommunities-NewsletterSignup', defaultStyle)(NewsletterSignup);
