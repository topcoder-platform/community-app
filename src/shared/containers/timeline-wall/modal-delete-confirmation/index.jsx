import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import IconCloseGreen from 'assets/images/icon-close-green.svg';

import style from './styles.scss';

function ModalDeleteConfirmation({
  id, onClose, eventItem, handle, deleteEvent,
}) {
  return (
    <Modal
      theme={{ container: style.container, overlay: style.overlay }}
      onCancel={onClose}
    >
      <div styleName="header">
        <span styleName="text-title">Delete Confirmation</span>
        <button styleName="btn-close" onClick={onClose} type="button"><IconCloseGreen /></button>
      </div>
      <span styleName="text-description">Are you sure you want to delete the event
        <strong> “{eventItem.title}”</strong> from <strong>{handle}</strong>?
      </span>
      <div styleName="separator" />
      <div styleName="bottom">
        <button
          onClick={onClose}
          styleName="btn-outline btn-cancel"
          type="button"
        >NO, CANCEL
        </button>

        <button
          onClick={() => {
            deleteEvent(id);
            onClose(true);
          }}
          styleName="btn-primary"
          type="button"
        >YES, DELETE
        </button>
      </div>
    </Modal>
  );
}

/**
 * Default values for Props
 */
ModalDeleteConfirmation.defaultProps = {
  id: '',
  onClose: () => { },
  eventItem: {
    creator: {},
    media: [],
  },
  handle: '',
};

/**
 * Prop Validation
 */
ModalDeleteConfirmation.propTypes = {
  id: PT.string,
  onClose: PT.func,
  eventItem: PT.any,
  handle: PT.string,
  deleteEvent: PT.func.isRequired,
};

export default ModalDeleteConfirmation;
