import React, { useState } from 'react';
import PT from 'prop-types';
import { Modal, Button } from 'topcoder-react-ui-kit';
import FormField from 'components/Settings/FormField';
import FormInputSelect from 'components/Settings/FormInputSelect';

import style from './styles.scss';

function ModalFakeLogin({ onClose }) {
  const [role, setRole] = useState('Guest');
  const options = [
    { value: 'Guest', label: 'Guest' },
    { value: 'Authenticated user', label: 'Authenticated user' },
    { value: 'Admin user', label: 'Admin user' },
  ];

  return (
    <Modal
      theme={{ container: style.container, overlay: style.overlay }}
      onCancel={onClose}
    >
      <span>FAKE LOGIN</span>

      <FormField label="User Role">
        <FormInputSelect
          name="reason"
          options={options}
          value={role}
          onChange={(e) => {
            setRole(e.value);
          }}
          labelKey="label"
          valueKey="value"
          clearable={false}
        />
      </FormField>

      <div>
        <Button
          onClick={() => {
            onClose(role);
          }}
          theme={{ button: style.saveButton }}
        >
          <span>OK</span>
        </Button>
      </div>
    </Modal>
  );
}

/**
 * Default values for Props
 */
ModalFakeLogin.defaultProps = {
  onClose: () => { },
};

/**
 * Prop Validation
 */
ModalFakeLogin.propTypes = {
  onClose: PT.func,
};

export default ModalFakeLogin;
