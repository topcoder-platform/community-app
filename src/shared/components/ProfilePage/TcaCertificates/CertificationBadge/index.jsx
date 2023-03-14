import React from 'react';
import PT from 'prop-types';

import 'assets/images/profile/tca-certificates/tca-certifications-badges-sprite.png';
import './styles.scss';

const CertificationBadge = ({ type: badgeType, level, size }) => (
  <div
    className={`badge-${badgeType}--${level}`.toLowerCase()}
    styleName={`tca-badge-wrap size-${size}`}
  />
);

CertificationBadge.defaultProps = {
  size: 'md',
};

CertificationBadge.propTypes = {
  size: PT.oneOf(['md']),
  level: PT.oneOf(['Beginner', 'Intermediate', 'Expert', 'All Levels']).isRequired,
  type: PT.oneOf(['DATASCIENCE', 'DESIGN', 'DEV', 'DATABASE', 'INTERVIEW', 'QA', 'SECURITY']).isRequired,
};


export default CertificationBadge;
