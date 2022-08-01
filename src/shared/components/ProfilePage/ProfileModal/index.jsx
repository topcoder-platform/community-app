import React from 'react';
import PT from 'prop-types';
import { noop } from 'lodash/noop';
import { Modal } from 'topcoder-react-ui-kit';
import cn from 'classnames';

import IconClose from 'assets/images/icon-close-green.svg';
import styles from './styles.scss';

const ProfileModal = ({
  children,
  title,
  onCancel,
  containerClassName,
}) => (
  <Modal
    theme={{
      container: cn(styles['modal-container'], containerClassName),
      overlay: styles['modal-overlay'],
    }}
    onCancel={onCancel}
  >
    <React.Fragment>
      <div styleName="header">
        <h2 styleName="title">
          {title}
        </h2>
        <div styleName="icon" role="presentation" onClick={onCancel}>
          <IconClose />
        </div>
      </div>
      {children}
    </React.Fragment>
  </Modal>
);

ProfileModal.defaultProps = {
  title: null,
  onCancel: noop,
  containerClassName: '',
};

ProfileModal.propTypes = {
  children: PT.node.isRequired,
  title: PT.node,
  onCancel: PT.func,
  containerClassName: PT.string,
};

export default ProfileModal;
