/* eslint-disable prefer-destructuring */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import MyAccount from './MyAccount';
import ErrorWrapper from '../ErrorWrapper';

import styles from './styles.scss';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.myAccountRef = React.createRef();
  }

  componentWillReceiveProps() {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving) {
      setIsSaving(false);
    }
  }

  save() {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving) {
      return;
    }
    const {
      newPassword,
      currentPassword,
      reNewPassword,
      passwordValid,
      rePasswordValid,
      updatingPassword,
    } = this.myAccountRef.current.state;

    const newAccountDirty = newPassword !== ''
      && currentPassword !== ''
      && reNewPassword !== '';

    let valid = true;
    let dirty;

    if (newAccountDirty) {
      valid = valid && (passwordValid && rePasswordValid && !updatingPassword);
      dirty = true;
    }

    if (dirty && valid) {
      this.myAccountRef.current.onUpdatePassword();
      setIsSaving(true);
    }
  }

  render() {
    const { isSaving } = this.props;

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
        <div styleName="account-container">
          <div styleName="header">
            <h3>Account information & Security</h3>
          </div>
          <MyAccount
            {...this.props}
            ref={this.myAccountRef}
          />
        </div>
        <div styleName="footer">{saveBtn}</div>
      </ErrorWrapper>
    );
  }
}

Account.defaultProps = {
  isSaving: false,
  setIsSaving: () => {},
};

Account.propTypes = {
  // userTraits: PT.array.isRequired,
  isSaving: PT.bool,
  setIsSaving: PT.func,
};
