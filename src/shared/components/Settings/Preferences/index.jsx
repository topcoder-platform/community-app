/* eslint-disable prefer-destructuring */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import NewsletterPreferencesContainer from 'containers/NewsletterPreferences';
import PreferenceList from './List';

import ErrorWrapper from '../ErrorWrapper';

import styles from './styles.scss';

export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.newsRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving !== nextProps.isSaving) {
      setTimeout(() => {
        setIsSaving(false);
      }, 600);
    }
  }

  save() {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving) {
      return;
    }
    setIsSaving(true);

    this.newsRef.current.getWrappedInstance().save();
  }

  render() {
    const { profile: { email }, isSaving } = this.props;

    const saveBtn = (
      <PrimaryButton
        onClick={this.save}
        theme={{
          button: `${styles['save-changes-btn']} ${isSaving ? styles.disabled : ''}`,
        }}
        disabled={!!isSaving}
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
              ref={this.newsRef}
            />
            <PreferenceList />
          </div>
        </div>
        <div styleName="footer">{saveBtn}</div>
      </ErrorWrapper>
    );
  }
}

Preferences.defaultProps = {
  isSaving: false,
};

Preferences.propTypes = {
  profile: PT.shape().isRequired,
  isSaving: PT.bool,
  setIsSaving: PT.func.isRequired,
};
