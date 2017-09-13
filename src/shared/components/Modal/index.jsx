/**
 * This generic component will implement the semi-transparent background
 * and the white window in the center, which wraps the content provided as children.
 *
 * When semi-transparent background is clicked, it should trigger the onCancel()
 * callback passed from the parent.
 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { themr } from 'react-css-themr';
import defaultStyle from './styles.scss';

function Modal(props) {
  return (
    <div>
      <div
        className={props.theme.container}
        onWheel={event => event.preventDefault()}
      >{props.children}</div>
      <button
        onClick={() => props.onCancel()}
        onWheel={event => event.preventDefault()}
        className={props.theme.overlay}
      />
    </div>
  );
}
Modal.defaultProps = {
  onCancel: _.noop,
  children: null,
  theme: {},
};

Modal.propTypes = {
  onCancel: PT.func,
  children: PT.node,
  theme: PT.shape(),
};

export default themr('Modal', defaultStyle)(Modal);
