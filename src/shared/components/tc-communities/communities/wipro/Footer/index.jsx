import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';

import defaultStyle from './style.scss';

function Footer(props) {
  return (
    <footer className={props.theme.footer}>
      <div className={props.theme.footerText}>{props.text}</div>
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
  text: PT.string.isRequired,
  theme: PT.shape({
    footer: PT.string.isRequired,
    footerText: PT.string,
  }),
};

export default themr('Footer', defaultStyle)(Footer);
