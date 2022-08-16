import React from 'react';
import PT from 'prop-types';

import DataScienceBadgeImg from 'assets/images/profile/tca-certificates/datascience-badge.png';
import DesignBadgeImg from 'assets/images/profile/tca-certificates/design-badge.png';
import DevelopBadgeImg from 'assets/images/profile/tca-certificates/develop-badge.png';
import QaBadgeImg from 'assets/images/profile/tca-certificates/qa-badge.png';

import './styles.scss';

const badgesMap = {
  DATASCIENCE: DataScienceBadgeImg,
  DESIGN: DesignBadgeImg,
  DEV: DevelopBadgeImg,
  QA: QaBadgeImg,
};

const CourseBadge = ({ type: badgeType, size }) => {
  const badgeImg = badgesMap[badgeType];

  return (
    <div styleName={`tca-badge-wrap size-${size}`}>
      <img src={badgeImg} alt={badgeType} />
    </div>
  );
};

CourseBadge.defaultProps = {
  size: 'md',
};

CourseBadge.propTypes = {
  size: PT.oneOf(['md']),
  type: PT.oneOf(['DATASCIENCE', 'DESIGN', 'DEV', 'QA']).isRequired,
};


export default CourseBadge;
