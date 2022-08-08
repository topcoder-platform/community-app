import React, { useState } from 'react';
import PT from 'prop-types';

import './styles.scss';
import TcaLogo from 'assets/images/profile/tca-certificates/tca-logo.svg';
import List from './List';
import TcaCertificateModal from './TcaCertificateModal';

const TcaCertificates = ({ certificates, memberHandle }) => {
  const [showCertificate, setShowCertificate] = useState(false);
  return (
    <div styleName="tca-certificates">
      <h3 styleName="title">
        <TcaLogo />
        Topcoder Academy
      </h3>

      <List
        certificates={certificates}
        isVerified
        onClick={certificate => setShowCertificate(certificate)}
      />

      { showCertificate && (
        <TcaCertificateModal
          onCancel={() => setShowCertificate(false)}
          certificate={showCertificate}
          memberHandle={memberHandle}
        />
      )}
    </div>
  );
};

TcaCertificates.defaultProps = {
  certificates: [],
};

TcaCertificates.propTypes = {
  certificates: PT.arrayOf(PT.shape),
  memberHandle: PT.string.isRequired,
};

export default TcaCertificates;
