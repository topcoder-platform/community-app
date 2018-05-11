/**
 * Child component of Settings/Account/Credential renders the
 * 'Credential' section of account setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import Styles from './styles.scss';

export default class Credential extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLength: false,
      hasLetter: false,
      hasSymbolNumber: false,
      passwordValid: false,
      showNewTips: false,
      focus: {
        'new-password-input': false,
        'current-password-input': false,
      },
    };

    this.onPasswordFocus = this.onPasswordFocus.bind(this);
    this.onPasswordBlur = this.onPasswordBlur.bind(this);
    this.onUpdatePassword = this.onUpdatePassword.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.toggleTypeAttribute = this.toggleTypeAttribute.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profileState.updatingPassword
      && !nextProps.profileState.updatingPassword
      && !nextProps.settingsPageState.incorrectPassword
    ) {
      document.querySelector('#new-password-input').value = '';
      document.querySelector('#current-password-input').value = '';
      this.setState({ passwordValid: false });
    }
  }

  onUpdatePassword(e) {
    e.preventDefault();
    const newPassword = document.querySelector('#new-password-input').value;
    const currentPassword = document.querySelector('#current-password-input').value;
    this.props.updatePassword(
      this.props.profile, this.props.tokenV3,
      newPassword, currentPassword,
    );
  }

  onPasswordFocus(e) {
    const newState = { ...this.state };
    newState.focus[e.target.id] = true;

    if (e.target.id === 'new-password-input') {
      newState.showNewTips = true;
    }

    this.setState(newState);
  }

  onPasswordBlur(e) {
    const newState = { ...this.state };
    newState.focus[e.target.id] = false;

    if (e.target.id === 'new-password-input') {
      if (e.relatedTarget && e.relatedTarget.id === 'newPasswordCheckbox') {
        newState.showNewTips = true;
      } else {
        newState.showNewTips = false;
      }
    }

    this.setState(newState);
  }

  toggleTypeAttribute(inputId) {
    _.noop(this);
    const input = document.querySelector(`#${inputId}`);
    if (input.type === 'text') {
      input.type = 'password';
    } else {
      input.type = 'text';
    }
    input.focus();
  }

  checkPassword(e) {
    if (e.target.id === 'current-password-input') {
      this.props.clearIncorrectPassword();
    }

    const password = document.querySelector('#new-password-input').value;
    let hasLength = false;
    let hasLetter = false;
    let hasSymbolNumber = false;
    if (password) {
      hasLength = password.length >= 8;
      hasLetter = /[a-zA-Z]/.test(password);
      hasSymbolNumber = /[-!$@#%^&*()_+|~=`{}[\]:";'<>?,./]/.test(password) || /[\d]/.test(password);
    }
    const currentPassword = document.querySelector('#current-password-input').value;
    this.setState({
      ...this.state,
      hasLength,
      hasLetter,
      hasSymbolNumber,
      passwordValid: currentPassword.length && hasLength && hasLetter && hasSymbolNumber,
    });
  }

  render() {
    const {
      profile,
      profileState,
      settingsPageState,
    } = this.props;

    const { updatingPassword } = profileState;
    const { incorrectPassword } = settingsPageState;

    return (
      <div className="settings-section" styleName="credentials">
        <div className="section-info">
          <h2>Credentials</h2>
          <div className="description">Used to log in to your account and cannot be edited. Please contact support@topcoder.com if you need to make changes.</div>
        </div>
        <div className="section-fields" styleName="section-fields">
          <div className="form-label username">Username</div>
          <input name="username" value={profile.handle} disabled className="form-field grey" />
          <div className="form-label">Email</div>
          <input name="email" value={profile.email} disabled className="form-field grey" />
          {
            profileState.credential && profileState.credential.hasPassword &&
            <div>
              <form name="newPasswordForm" noValidate>
                <div className="form-label">Current password</div>
                <div styleName="validation-bar" className="form-field">
                  <div styleName={`password toggle-password ${this.state.focus['current-password-input'] ? 'focus' : ''}`}>
                    <input id="current-password-input" styleName="password-input" onChange={this.checkPassword} onFocus={this.onPasswordFocus} onBlur={this.onPasswordBlur} name="currentPassword" type="password" placeholder="Password" required />
                    <label htmlFor="currentPasswordCheckbox">
                      <input type="checkbox" id="currentPasswordCheckbox" onChange={() => this.toggleTypeAttribute('current-password-input')} />
                      Show
                    </label>
                  </div>
                  {
                    incorrectPassword &&
                    <div className="form-input-error">
                      <p>
                        Your current password is incorrect.
                        Please check that you entered the right one.
                      </p>
                    </div>
                  }
                </div>
                <div className="form-label">New Password</div>
                <div styleName="validation-bar" className="form-field">
                  <div styleName={`password toggle-password ${this.state.focus['new-password-input'] ? 'focus' : ''}`}>
                    <input id="new-password-input" styleName="password-input" onChange={this.checkPassword} onFocus={this.onPasswordFocus} onBlur={this.onPasswordBlur} name="password" type="password" placeholder="Create new password" minLength="8" maxLength="64" required />
                    <label htmlFor="newPasswordCheckbox">
                      <input type="checkbox" id="newPasswordCheckbox" onChange={() => this.toggleTypeAttribute('new-password-input')} />
                      Show
                    </label>
                  </div>
                  <div id="password-tips" styleName="tips password-tips" className={this.state.showNewTips ? '' : 'hidden'}>
                    <div styleName="arrow" />
                    <h3>Your password must have:</h3>
                    <p styleName={this.state.hasLength ? 'has-length-between-range' : ''}>At least 8 characters</p>
                    <p styleName={this.state.hasLetter ? 'has-letter' : ''}>At least one letter</p>
                    <p styleName={this.state.hasSymbolNumber ? 'has-symbol-or-number' : ''}>At least one number or symbol</p>
                  </div>
                </div>
                <div styleName="button-container">
                  <PrimaryButton
                    disabled={!this.state.passwordValid || updatingPassword}
                    onClick={this.onUpdatePassword}
                    theme={{ button: Styles['save-password-button'] }}
                  >
                    {
                      !updatingPassword && 'Change Password'
                    }
                    {
                      updatingPassword && <i className="fa fa-spinner fa-spin" />
                    }
                  </PrimaryButton>
                </div>
              </form>
            </div>
          }
          {
            profileState.credential && profileState.credential.hasPassword === false &&
            <div>
              <p>
                You joined Topcoder by using an external account,
                so we don&quot;t have a password for you.
              </p>
            </div>
          }
        </div>
      </div>
    );
  }
}

Credential.propTypes = {
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  updatePassword: PT.func.isRequired,
  clearIncorrectPassword: PT.func.isRequired,
};
