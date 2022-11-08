/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import FallBackAwardIcon from 'assets/images/default-award.svg';

import './styles.scss';

const AwardBadge = ({
  title, imageUrl, mimeType, onSelectBadge,
}) => (
  <div role="presentation" styleName="awardBadge" onClick={onSelectBadge}>
    {
      imageUrl ? (
        <img src={imageUrl} type={mimeType} alt="award-badge" styleName="image" />
      ) : (
        <FallBackAwardIcon styleName="image" />
      )
    }
    <div styleName="title">
      <span>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: title }} />
      </span>
    </div>
  </div>
);

AwardBadge.defaultProps = {
  title: '',
  imageUrl: null,
  mimeType: 'image/svg+xml',
};

AwardBadge.propTypes = {
  title: PT.string,
  imageUrl: PT.string,
  mimeType: PT.string,
  onSelectBadge: PT.func.isRequired,
};

export default AwardBadge;
