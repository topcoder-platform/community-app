/**
 * This generic component will implement the semi-transparent background
 * and the white window in the center, which wraps the content provided as children.
 *
 * When semi-transparent background is clicked, it should trigger the onCancel()
 * callback passed from the parent.
 */

/* global document */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './styles.scss';

/* NOTE: Modal component is implemented as class because we should append /
 * remove a special class to the document's body to block its scrolling while
 * keeping the modal's content scrollable. Unfortunately, just catching and
 * manipulating on mouse wheel events does not help. */
class Modal extends React.Component {
  componentDidMount() {
    document.body.classList.add('scrolling-disabled-by-modal');
  }

  componentWillUnmount() {
    document.body.classList.remove('scrolling-disabled-by-modal');
  }

  render() {
    const {
      children,
      onCancel,
      theme,
    } = this.props;
    return (
      <div>
        <div
          className={theme.container}
          onWheel={event => event.stopPropagation()}
        >{children}
        </div>
        <button
          onClick={() => onCancel()}
          className={theme.overlay}
        />
      </div>
    );
  }
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
