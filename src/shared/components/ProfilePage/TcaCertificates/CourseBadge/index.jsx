import React from 'react';
import PT from 'prop-types';

import DataScienceBadgeImg from 'assets/images/profile/tca-certificates/datascience-badge.png';
import DesignBadgeImg from 'assets/images/profile/tca-certificates/design-badge.png';
import DevelopBadgeImg from 'assets/images/profile/tca-certificates/develop-badge.png';
import InterviewBadgeImg from 'assets/images/profile/tca-certificates/interview-badge.png';
import QaBadgeImg from 'assets/images/profile/tca-certificates/qa-badge.png';
import SecurityBadgeImg from 'assets/images/profile/tca-certificates/security-badge.png';

import './styles.scss';

const badgesMap = {
  DATASCIENCE: DataScienceBadgeImg,
  DESIGN: DesignBadgeImg,
  DEV: DevelopBadgeImg,
  INTERVIEW: InterviewBadgeImg,
  QA: QaBadgeImg,
  SECURITY: SecurityBadgeImg,
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
  type: PT.oneOf(['DATASCIENCE', 'DESIGN', 'DEV', 'INTERVIEW', 'QA', 'SECURITY']).isRequired,
};


export default CourseBadge;
