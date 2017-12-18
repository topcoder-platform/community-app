/**
 * Popup Component for Image Decorators
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import { GhostButton } from 'components/buttons';

import './style.scss';

const Popup = ({ onEdit }) => (
  <div>
    <GhostButton
      className="edit"
      onClick={() => onEdit()}
      size="sm"
    >Edit</GhostButton>
  </div>
);

Popup.defaultProps = {
  onEdit: _.noop,
};

Popup.propTypes = {
  onEdit: PT.func,
};

export default Popup;
