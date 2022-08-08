/* eslint-disable prefer-destructuring */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import NewsletterPreferencesContainer from 'containers/NewsletterPreferences';
import PreferenceList from './List';

import ErrorWrapper from '../ErrorWrapper';

import styles from './styles.scss';

export default class Preferences extends React.Component {
  render() {
    const { profile: { email } } = this.props;

    const saveBtn = (
      <PrimaryButton
        onClick={this.save}
        theme={{
          button: `${styles['save-changes-btn']} ${styles.disabled}`,
        }}
        disabled
      >
        Save Changes
      </PrimaryButton>
    );

    return (
      <ErrorWrapper>
        <div styleName="preferences-container">
          <div styleName="header">
            <h3>Platform preferences</h3>
          </div>
          <div styleName="platform-banner">
            <NewsletterPreferencesContainer
              email={email}
            />
            <PreferenceList />
          </div>
        </div>
        <div styleName="footer">{saveBtn}</div>
      </ErrorWrapper>
    );
  }
}

Preferences.propTypes = {
  profile: PT.shape().isRequired,
};
