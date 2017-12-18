/**
 * <Image> Draft Decorator Component
 * Renders images within the draft component including a popup edit button and modal
 */
import PT from 'prop-types';
import React from 'react';

import Tooltip from 'components/Tooltip';

import Popup from './Popup';

const Image = ({ children, contentState, entityKey, updateEntityData }) => {
  const {
    description,
    size,
    src,
    triggerModal,
  } = contentState.getEntity(entityKey).getData();

  const popup = (
    <Popup
      onEdit={(newSrc, newSize) => {
        updateEntityData(entityKey, { src: newSrc, size: newSize });
      }}
      size={size}
      src={src}
      triggerModal={triggerModal}
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
        defaultVisible={triggerModal}
      >
        <img src={src} alt={description} height={`${size}%`} width={`${size}%`} />
      </Tooltip>
      {children}
    </span>
  );
};

Image.propTypes = {
  contentState: PT.shape().isRequired,
  children: PT.node.isRequired,
  entityKey: PT.string.isRequired,
  updateEntityData: PT.func.isRequired,
};

export default Image;
