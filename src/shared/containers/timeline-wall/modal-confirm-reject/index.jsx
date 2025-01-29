import React, { useState, useMemo } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { Modal } from 'topcoder-react-ui-kit';
import IconCloseGreen from 'assets/images/icon-close-green.svg';
import FormField from 'components/Settings/FormField';
import FormInputTextArea from 'components/Settings/FormInputTextArea';
import FormInputSelect from 'components/Settings/FormInputSelect';
import { config } from 'topcoder-react-utils';

import style from './styles.scss';

function ModalConfirmReject({ onClose, onReject }) {
  const [formData, setFormData] = useState({
    note: '',
  });
  const options = _.get(config, 'TIMELINE.REJECTION_EVENT_REASONS', []).map(reason => ({
    value: reason, label: reason,
  }));

  const canSubmitForm = useMemo(() => !!formData.reason
    && !!formData.note, [formData]);

  return (
    <Modal
      theme={{ container: style.container, overlay: style.overlay }}
      onCancel={onClose}
    >
      <div styleName="header">
        <span styleName="text-title">Confirm Reject Event</span>
        <button styleName="btn-close" onClick={onClose} type="button"><IconCloseGreen /></button>
      </div>
      <div styleName="separator separator-1" />
      <span styleName="text-description">Please provide a reason for rejecting this event.
        Note that this action cannot be undone.
      </span>

      <FormField label="Rejection Reason" styleName="field-reason">
        <FormInputSelect
          name="reason"
          options={options}
          value={formData.reason}
          onChange={(e) => {
            setFormData({
              ...formData,
              reason: e,
            });
          }}
          labelKey="label"
          valueKey="value"
          clearable={false}
        />
      </FormField>

      <FormField label="Note" isTextarea styleName="field-note">
        <FormInputTextArea
          id="note"
          name="note"
          type="text"
          placeholder=""
          onChange={(e) => {
            setFormData({
              ...formData,
              note: e.target.value,
            });
          }}
          value={formData.note}
          cols="3"
          rows="10"
          showChartCount={false}
        />
      </FormField>
      <div styleName="separator separator-2" />
      <div styleName="bottom">
        <button
          onClick={onClose}
          styleName="btn-outline btn-cancel"
          type="button"
        >CANCEL
        </button>

        <button
          onClick={() => {
            onClose(true);
            onReject({
              reason: formData.reason.value,
              note: formData.note,
            });
          }}
          styleName="btn-primary"
          type="button"
          disabled={!canSubmitForm}
        >REJECT
        </button>
      </div>
    </Modal>
  );
}

/**
 * Default values for Props
 */
ModalConfirmReject.defaultProps = {
  onClose: () => { },
};

/**
 * Prop Validation
 */
ModalConfirmReject.propTypes = {
  onClose: PT.func,
  onReject: PT.func.isRequired,
};

export default ModalConfirmReject;
