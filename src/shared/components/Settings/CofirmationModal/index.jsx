import React from 'react';
import PT from 'prop-types';
import { Modal, PrimaryButton, GhostButton } from 'topcoder-react-ui-kit';
import modal from './styles.scss';

export default function ConfirmationModal(props) {
  const { onConfirm, onCancel, name } = props;
  return (
    <Modal theme={modal}>
      <div styleName="modal.deletion-confirmation-container">
        <div styleName="modal.deletion-confirmation">
          <div styleName="modal.deletion-confirmation-title">HEADS UP!</div>
          <div styleName="modal.deletion-confirmation-message">
            Are you sure you want to delete `{name}`? This action can&apos;t be undone.
          </div>
          <div styleName="modal.deletion-confirmation-buttons">
            <div styleName="modal.deletion-confirmation-button-yes">
              <GhostButton onClick={onConfirm}>Yes, Delete</GhostButton>
            </div>
            <div styleName="modal.deletion-confirmation-button-no">
              <PrimaryButton onClick={onCancel}>Cancel</PrimaryButton>
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
