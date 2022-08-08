import React from 'react';
import PT from 'prop-types';
import FallBackAwardIcon from 'assets/images/default-award.svg';

import './styles.scss';

const AwatarModal = ({
  modalData,
}) => {
  const {
    title, description, imageUrl, mimeType,
  } = modalData;

  return (
    <div styleName="awardModal">
      {
        imageUrl ? (
          <img src={imageUrl} type={mimeType} alt="award-badge" styleName="image" />
        ) : (
          <FallBackAwardIcon styleName="image" />
        )
      }

      <div styleName="rightContent">
        <div styleName="title">
          <span>{title}</span>
        </div>

        <div styleName="description">
          {description}
        </div>
      </div>
    </div>
  );
};

AwatarModal.defaultProps = {
  modalData: {},
};

AwatarModal.propTypes = {
  modalData: PT.shape(
    {
      title: PT.string,
      description: PT.string,
      imageUrl: PT.string,
      mimeType: PT.string,
    },
  ),
};

export default AwatarModal;
