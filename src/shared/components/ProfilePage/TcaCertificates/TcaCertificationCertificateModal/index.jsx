import React from 'react';
import PT from 'prop-types';
import { noop } from 'lodash/noop';
import { config } from 'topcoder-react-utils';

import ProfileModal from '../../ProfileModal';
import styles from './styles.scss';

const tcAcademyPath = `${config.PLATFORMUI_SITE_URL}${config.TC_ACADEMY_BASE_PATH}`;

const TcaCertificationCertificateModal = ({
  certificate,
  onCancel,
}) => (
  <ProfileModal
    title=""
    onCancel={onCancel}
    containerClassName={styles['tca-modal']}
  >
    <iframe
      styleName="iframe"
      src={`${tcAcademyPath}/${certificate.completionUuid}?view-style=modal`}
      title={certificate.certificationTitle}
    />
  </ProfileModal>
);

TcaCertificationCertificateModal.defaultProps = {
  onCancel: noop,
};

TcaCertificationCertificateModal.propTypes = {
  certificate: PT.shape().isRequired,
  onCancel: PT.func,
};

export default TcaCertificationCertificateModal;
