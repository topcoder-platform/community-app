/**
 * The common background for payment-related pages. It has grayish pattern,
 * black Topcoder logo in the top-left corner, and optional escape button
 * in the top-right corner.
 */

import PT from 'prop-types';
import React from 'react';
import TopcoderLogo from '../../../../../assets/images/logo-topcoder-mono.svg';
import CloseIcon from '../../../../../assets/images/sandbox/payments/close.svg';
import './style.scss';

/* TODO: For now it is just a placeholder that does nothing. */
export default function Background({ children, onExit, escapeButton }) {
  return (
    <div styleName="background">
      <TopcoderLogo styleName="logo" />
      {escapeButton &&
        <a styleName="esc" onClick={onExit} role="button" tabIndex={-1}>
          <div styleName="button">
            <CloseIcon />
          </div>
          <div styleName="text">ESC</div>
        </a>
      }
      {children}
    </div>
  );
}

Background.defaultProps = {
  children: null,
  escapeButton: true,
  onExit: () => {},
};

Background.propTypes = {
  children: PT.node,
  onExit: PT.func,
  escapeButton: PT.bool,
};
