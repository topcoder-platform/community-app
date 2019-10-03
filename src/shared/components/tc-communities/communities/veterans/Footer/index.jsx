import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyle from './style.scss';

function Footer({ theme }) {
  return (
    <footer className={theme.footer}>
      <div className={theme.footerText}>
        &copy; Copyright Topcoder Ltd 2017
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
