/**
 * The common background for payment-related pages. It has grayish pattern,
 * black Topcoder logo in the top-left corner, and optional escape button
 * in the top-right corner.
 */

import PT from 'prop-types';
import React from 'react';
import TopcoderLogo from '../../../../../assets/images/logo-topcoder-mono.svg';
import './style.scss';

/* TODO: For now it is just a placeholder that does nothing. */
export default function Background({ children }) {
  return (
    <div styleName="background">
      <TopcoderLogo styleName="logo" />
      {children}
    </div>
  );
}

Background.defaultProps = {
  children: null,
};

Background.propTypes = {
  children: PT.node,
};
