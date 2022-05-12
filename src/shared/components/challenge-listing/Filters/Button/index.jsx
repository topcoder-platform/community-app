import React from 'react';
import PT from 'prop-types';

import './styles.scss';

/**
 * Displays a button.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const Button = ({
  children,
  className,
  onClick,
  isInverted,
  isPrimary,
  isSelected,
  isText,
  shade,
  size,
  style,
  disabled,
  value,
}) => (
  <button
    className={className}
    data-value={value}
    styleName={`button ${style ? `button-${style}` : ''} ${
      isPrimary ? 'button-primary' : ''
    } ${isInverted ? 'button-inverted' : ''} ${
      shade ? `button-${shade}` : ''
    } ${isText ? 'button-text' : ''} ${size ? `button-${size}` : ''} ${
      isSelected ? 'is-selected' : ''
    }`}
    onClick={onClick}
    tabIndex={0}
    type="button"
    disabled={disabled}
  >
    {children}
  </button>
);

Button.defaultProps = {
  isInverted: false,
  isPrimary: false,
  disabled: false,
};

Button.propTypes = {
  children: PT.node.isRequired,
  className: PT.string.isRequired,
  onClick: PT.func.isRequired,
  isInverted: PT.bool,
  isPrimary: PT.bool,
  isSelected: PT.bool.isRequired,
  isText: PT.bool.isRequired,
  shade: PT.oneOf(['dark']).isRequired,
  size: PT.string.isRequired,
  style: PT.oneOf(['circle']).isRequired,
  value: PT.any.isRequired,
  disabled: PT.bool,
};

export default Button;
