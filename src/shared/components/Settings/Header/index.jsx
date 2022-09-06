/**
 * Header component for settings page
 */
import React from 'react';
import { Button } from 'topcoder-react-ui-kit';
import PT from 'prop-types';

import style from './styles.scss';

export default function Header({ saveSettings, isSaving }) {
  return (
    <div styleName="Header">
      <div styleName="title">
        <h1>Profile Settings</h1>
      </div>
      <Button
        onClick={saveSettings}
        theme={{ button: style.saveButton }}
        disabled={isSaving}
      >
        <span>SAVE CHANGES</span>
      </Button>
    </div>
  );
}

Header.defaultProps = {
  isSaving: false,
};

Header.propTypes = {
  saveSettings: PT.func.isRequired,
  isSaving: PT.bool,
};
