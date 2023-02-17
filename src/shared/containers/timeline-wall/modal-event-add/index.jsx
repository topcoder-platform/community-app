import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import IconCloseGreen from 'assets/images/icon-close-green.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import cn from 'classnames';

import style from './styles.scss';

function ModalEventAdd({
  onClose, isAdmin, uploading, uploadResult,
}) {
  const successMessage = !isAdmin ? 'Thank you! Your event was submitted for review. You’ll receive an email once the review is completed'
    : 'Thank you! Your event was added to the Timeline Wall.';
  return (
    <Modal
      theme={{ container: style.container, overlay: style.overlay }}
      onCancel={onClose}
    >
      <div styleName="header">
        <span styleName="text-title">{uploadResult ? 'Error' : 'Confirmation'}</span>
        <button styleName="btn-close" onClick={onClose} type="button"><IconCloseGreen /></button>
      </div>
      {
        uploading ? (
          <LoadingIndicator />
        ) : (
          <span styleName={cn('text-description', {
            error: !!uploadResult,
          })}
          >
            {
              uploadResult || successMessage
            }
          </span>
        )
      }
      <div styleName="separator" />
      <div styleName="bottom">
        <button
          onClick={onClose}
          styleName="btn-outline btn-cancel"
          type="button"
        >CANCEL
        </button>

        <button
          onClick={onClose}
          styleName="btn-primary"
          type="button"
          disabled={uploading}
        >OK
        </button>
      </div>
    </Modal>
  );
}

/**
 * Default values for Props
 */
ModalEventAdd.defaultProps = {
  onClose: () => { },
  isAdmin: false,
  uploading: false,
  uploadResult: '',
};

/**
 * Prop Validation
 */
ModalEventAdd.propTypes = {
  onClose: PT.func,
  isAdmin: PT.bool,
  uploading: PT.bool,
  uploadResult: PT.string,
};

export default ModalEventAdd;
