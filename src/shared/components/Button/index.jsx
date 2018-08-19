/**
 * Button component which accepts via props the text to render
 * inside the button, its size and style.
 *
 * On hover, mouse cursor should become pointer, and the onClick()
 * callback passed from parent should be triggered on click.
 *
 * Style:
 * To create outline btn pass 'tc-outline-btn' className
 * To create filled btn pass '{color} tc-blue-btn' className. eg. 'red tc-blue-btn'
 * To create big btn pass 'tc-bg-btn' className along with one of the above two btn type
 */

/* TODO: In its current form this component is not that userful. Should we
 * get rid of it, just replacing with direct use of <button> tag? */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import './styles.scss';

export default function Button({
  children,
  className,
  onClick,
}) {
  return (
    <button
      className={`tc-btn ${className}`}
      onClick={() => onClick()}
      type="button"
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  className: 'tc-blue-btn',
  onClick: _.noop,
  children: null,
};

Button.propTypes = {
  className: PT.string,
  onClick: PT.func,
  children: PT.node,
};
