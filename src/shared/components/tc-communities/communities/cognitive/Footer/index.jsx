import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyle from './style.scss';

function Footer(props) {
  return (
    <footer className={props.theme.footer}>
      <div className={props.theme.footerText}>
        <img src="/community-app-assets/themes/cognitive/logo-footer.png" alt="TopCoder Logo" />
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  text: '',
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
