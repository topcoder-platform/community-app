/**
 * User Consent Modal
 */
import React from 'react';
import PT from 'prop-types';
import Modal from 'components/Modal';
import { PrimaryButton, Button } from 'topcoder-react-ui-kit';
import modal from './styles.scss';

export default function UserConsentModal(props) {
  const { onSaveTrait } = props;
  return (
    <Modal theme={modal}>
      <div styleName="modal.userconsent-confirmation-container">
        <div styleName="modal.userconsent-confirmation">
          <div styleName="modal.userconsent-confirmation-title">
                        Topcoder would like to use your information for
                        to make your experience more personal.
          </div>
          <div styleName="modal.userconsent-confirmation-message">
                        You can opt out from personalization any time in the
                        future in at Preferences &gt; Personalization.
          </div>
          <div styleName="modal.userconsent-confirmation-buttons">
            <div styleName="modal.userconsent-confirmation-button-no">
              <Button onClick={e => onSaveTrait(e, false)}>
                                Dont&#39;t allow
              </Button>
            </div>
            <div styleName="modal.userconsent-confirmation-button-yes">
              <PrimaryButton onClick={e => onSaveTrait(e, true)}>
                                Allow
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

UserConsentModal.propTypes = {
  onSaveTrait: PT.func.isRequired,
};
