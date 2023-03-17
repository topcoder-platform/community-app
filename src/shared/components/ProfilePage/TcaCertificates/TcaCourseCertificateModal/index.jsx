import React from 'react';
import PT from 'prop-types';
import { noop } from 'lodash/noop';
import { config } from 'topcoder-react-utils';

import ProfileModal from '../../ProfileModal';
import styles from './styles.scss';

const tcAcademyPath = `${config.PLATFORMUI_SITE_URL}${config.TC_ACADEMY_BASE_PATH}`;

const TcaCourseCertificateModal = ({
  certificate,
  onCancel,
  memberHandle,
}) => (
  <ProfileModal
    title="Topcoder Academy"
    onCancel={onCancel}
    containerClassName={styles['tca-certificate-modal']}
  >
    <iframe
      styleName="iframe"
      src={[
        tcAcademyPath,
        certificate.provider,
        certificate.certification,
        memberHandle,
        'certificate',
      ].join('/')}
      title={certificate.certificationTitle}
    />
  </ProfileModal>
);

TcaCourseCertificateModal.defaultProps = {
  onCancel: noop,
};

TcaCourseCertificateModal.propTypes = {
  certificate: PT.shape().isRequired,
  onCancel: PT.func,
  memberHandle: PT.string.isRequired,
};

export default TcaCourseCertificateModal;
