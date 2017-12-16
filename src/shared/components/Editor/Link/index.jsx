import PT from 'prop-types';
import React from 'react';

import Tooltip from '../../Tooltip';

import Popup from './Popup';

import style from './style.scss';

const Link = ({ contentState, children, entityKey }) => {
  const {
    href,
    title,
  } = contentState.getEntity(entityKey).getData();

  const popup = (
    <Popup
      href={href}
      style={style.edit}
    />
  );

  return (
    <span>
      <Tooltip
        align={{
          offset: [0, 5],
        }}
        content={popup}
        className={style.popup}
        suppressDiv
      >
        <a href={href} title={title} target="_blank" rel="noopener noreferrer">{children}</a>
      </Tooltip>
    </span>
  );
};

Link.defaultProps = {
  children: null,
};

Link.propTypes = {
  contentState: PT.shape().isRequired,
  children: PT.node,
  entityKey: PT.string.isRequired,
};

export default Link;
