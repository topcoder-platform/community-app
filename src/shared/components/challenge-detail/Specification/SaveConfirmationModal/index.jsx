import LoadingIndicator from 'components/LoadingIndicator';
import Modal from 'components/Modal';
import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import style from './style.scss';

export default function SaveConfirmationModal({
  onDone,
  saving,
}) {
  return (
    <Modal
      theme={{ container: style.container }}
    >
      <h1 styleName="title">
Saving The Challenge
      </h1>
      {
        saving ? <LoadingIndicator /> : (
          <PrimaryButton
            onClick={onDone}
          >
Done
          </PrimaryButton>
        )
      }
    </Modal>
  );
}

SaveConfirmationModal.propTypes = {
  onDone: PT.func.isRequired,
  saving: PT.bool.isRequired,
};
