/**
 * <Link> Draft Decorator Component
 * Renders links within the draft component including a popup Tooltip to edit
 */
import PT from 'prop-types';
import React from 'react';

import Tooltip from 'components/Tooltip';

import Popup from './Popup';

const Link = ({
  children, contentState, entityKey, updateEntityData,
}) => {
  const {
    href,
    triggerPopup,
  } = contentState.getEntity(entityKey).getData();

  const popup = (
    <Popup
      href={href}
      onEdit={updated => updateEntityData(entityKey, { href: updated })}
    />
  );

  return (
    <span>
      <Tooltip
        align={{
          offset: [0, 5],
        }}
        content={popup}
        suppressDiv
        trigger={['click', 'hover']}
        defaultVisible={triggerPopup}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Tooltip>
    </span>
  );
};

Link.defaultProps = {
  children: null,
};

Link.propTypes = {
  children: PT.node,
  contentState: PT.shape().isRequired,
  entityKey: PT.string.isRequired,
  updateEntityData: PT.func.isRequired,
};

export default Link;
