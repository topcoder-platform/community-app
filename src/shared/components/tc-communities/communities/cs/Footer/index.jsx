import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';

/* This rule will be disabled in the next update of topcoder-react-utils,
 * because it makes more harm than good. */
/* eslint-disable react/jsx-one-expression-per-line */

import defaultStyle from './style.scss';

function Footer({ theme }) {
  return (
    <footer className={theme.footer}>
      <div className={theme.footerText}>
        &copy; Copyright Topcoder {moment().year()}
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  // text: '',
  theme: {
    footer: '',
    footerText: '',
  },
};

Footer.propTypes = {
  theme: PT.shape({
    footer: PT.string.isRequired,
    footerText: PT.string,
  }),
};

export default themr('Footer', defaultStyle)(Footer);
