import React from 'react';
import PT from 'prop-types';
import {
  Modal, PrimaryButton, Button, GhostButton,
} from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/icon-close-green.svg';

import styles from './styles.scss';

export default function ConfirmationModal(props) {
  const { onConfirm, onCancel, name } = props;
  return (
    <Modal theme={{ container: styles.modal, overlay: styles['modal-overlay'] }}>
      <div styleName="modal-dialog">
        <div styleName="modal-content">
          <div styleName="modal-header">
            DELETE CONFIRMATION
            <GhostButton theme={{ button: styles.close }} onClick={onCancel}>
              <IconClose />
            </GhostButton>
          </div>
          <div styleName="modal-body">
            <span styleName="title">
              Are you sure you want to delete<span>{' '}{name}</span>? This action cannot be undone.
            </span>
          </div>
          <div styleName="modal-footer">
            <div>
              <PrimaryButton theme={{ button: styles['button-save'] }} onClick={onConfirm}>Yes, Delete</PrimaryButton>
            </div>
            <div>
              <Button theme={{ button: styles['button-save-ghost'] }} onClick={onCancel}>No, Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  onConfirm: PT.func.isRequired,
  onCancel: PT.func.isRequired,
  name: PT.string.isRequired,
};
