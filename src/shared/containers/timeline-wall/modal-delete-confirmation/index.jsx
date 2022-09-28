import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import IconCloseGreen from 'assets/images/icon-close-green.svg';

import style from './styles.scss';

function ModalDeleteConfirmation({ onClose, eventItem }) {
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
        <strong> “{eventItem.title}”</strong> from <strong>{eventItem.creator.handle}</strong>?
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
  onClose: () => { },
  eventItem: {
    creator: {},
    media: [],
  },
};

/**
 * Prop Validation
 */
ModalDeleteConfirmation.propTypes = {
  onClose: PT.func,
  eventItem: PT.any,
};

export default ModalDeleteConfirmation;
