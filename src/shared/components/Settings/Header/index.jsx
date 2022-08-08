/**
 * Header component for settings page
 */
import React from 'react';
import { Button } from 'topcoder-react-ui-kit';
import PT from 'prop-types';

import style from './styles.scss';

export default function Header({ saveSettings, isSaving, isPreferencesTab }) {
  return (
    <div styleName="Header">
      <div styleName="title">
        <h1>Profile Settings</h1>
      </div>
      <Button
        onClick={saveSettings}
        theme={{ button: style.saveButton }}
        disabled={isSaving || isPreferencesTab}
      >
        <span>SAVE CHANGES</span>
      </Button>
    </div>
  );
}

Header.defaultProps = {
  isSaving: false,
  isPreferencesTab: false,
};

Header.propTypes = {
  saveSettings: PT.func.isRequired,
  isPreferencesTab: PT.bool,
  isSaving: PT.bool,
};
