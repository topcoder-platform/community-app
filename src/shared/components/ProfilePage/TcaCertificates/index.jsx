import React, { useState } from 'react';
import PT from 'prop-types';

import './styles.scss';
import TcaLogo from 'assets/images/profile/tca-certificates/tca-logo.svg';
import List from './List';
import TcaCertificationCertificateModal from './TcaCertificationCertificateModal';
import TcaCourseCertificateModal from './TcaCourseCertificateModal';
import CertificationBadge from './CertificationBadge';
import CourseBadge from './CourseBadge';

const TcaCertificates = ({ certifications, courses, memberHandle }) => {
  const [showCertificationCertificate, setShowCertificationCertificate] = useState(false);
  const [showCourseCertificate, setShowCourseCertificate] = useState(false);

  return (
    <div styleName="tca-certificates">
      <h3 styleName="title">
        <TcaLogo />
        Topcoder Academy
      </h3>

      <h4 styleName="category-title">Certifications</h4>
      <List
        certificates={certifications}
        isVerified
        onClick={certificate => setShowCertificationCertificate(certificate)}
        renderIcon={enrollment => (
          <CertificationBadge
            type={enrollment.topcoderCertification.certificationCategory.track || 'DEV'}
            level={enrollment.topcoderCertification.learnerLevel || 'Beginner'}
          />
        )}
      />
      <h4 styleName="category-title">Courses</h4>
      <List
        certificates={courses}
        isVerified
        onClick={certificate => setShowCourseCertificate(certificate)}
        renderIcon={certificate => <CourseBadge type={certificate.certificationTrackType || 'DEV'} />}
      />

      { showCertificationCertificate && (
        <TcaCertificationCertificateModal
          onCancel={() => setShowCertificationCertificate(false)}
          certificate={showCertificationCertificate}
        />
      )}
      { showCourseCertificate && (
        <TcaCourseCertificateModal
          onCancel={() => setShowCourseCertificate(false)}
          certificate={showCourseCertificate}
          memberHandle={memberHandle}
        />
      )}
    </div>
  );
};

TcaCertificates.defaultProps = {
  certifications: [],
  courses: [],
};

TcaCertificates.propTypes = {
  certifications: PT.arrayOf(PT.shape),
  courses: PT.arrayOf(PT.shape),
  memberHandle: PT.string.isRequired,
};

export default TcaCertificates;
