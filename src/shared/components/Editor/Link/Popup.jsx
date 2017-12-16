import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import { GhostButton } from 'components/buttons';

const Popup = ({ href, onEdit, style, title }) => (
  <div>
    <a href={href} title={title} target="_blank" rel="noopener noreferrer">{href}</a>
    <GhostButton
      className={style}
      onClick={() => onEdit()}
      size="sm"
    >Edit</GhostButton>
  </div>
);

Popup.defaultProps = {
  href: '',
  onEdit: _.noop,
  title: '',
};

Popup.propTypes = {
  href: PT.string,
  onEdit: PT.func,
  style: PT.string.isRequired,
  title: PT.string,
};

export default Popup;
