/**
 * Child component of Settings/Account/Credential renders the
 * 'Credential' section of account setting page.
 */
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
      passwordInputType: {
        'new-password-input': 'password',
        'current-password-input': 'password',
      },
      newPassword: '',
      currentPassword: '',
    };

    this.newPasswordRef = React.createRef();
    this.currentPasswordRef = React.createRef();

    this.onPasswordFocus = this.onPasswordFocus.bind(this);
    this.onPasswordBlur = this.onPasswordBlur.bind(this);
    this.onUpdatePassword = this.onUpdatePassword.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.toggleTypeAttribute = this.toggleTypeAttribute.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      profileState,
    } = this.props;
    if (profileState.updatingPassword
      && !nextProps.profileState.updatingPassword
      && !nextProps.settingsPageState.incorrectPassword
    ) {
      this.setState({ passwordValid: false, newPassword: '', currentPassword: '' });
    }
  }

  onUpdatePassword(e) {
    const {
      profile,
      updatePassword,
      tokenV3,
    } = this.props;
    e.preventDefault();
    const { newPassword, currentPassword } = this.state;
    updatePassword(
      profile, tokenV3,
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
    const {
      passwordInputType,
    } = this.state;

    let type = passwordInputType[inputId];
    if (type === 'text') {
      type = 'password';
    } else {
      type = 'text';
    }

    this.setState({
      passwordInputType: {
        ...passwordInputType,
        [inputId]: type,
      },
    });

    setImmediate(() => {
      if (inputId === 'current-password-input') {
        this.currentPasswordRef.current.focus();
      } else {
        this.newPasswordRef.current.focus();
      }
    });
  }

  checkPassword(e) {
    const {
      clearIncorrectPassword,
    } = this.props;
    let { newPassword, currentPassword } = this.state;

    if (e.target.id === 'current-password-input') {
      currentPassword = e.target.value;
      clearIncorrectPassword();
    } else {
      newPassword = e.target.value;
    }

    let hasLength = false;
    let hasLetter = false;
    let hasSymbolNumber = false;
    if (newPassword) {
      hasLength = newPassword.length >= 8;
      hasLetter = /[a-zA-Z]/.test(newPassword);
      hasSymbolNumber = /[-!$@#%^&*()_+|~=`{}[\]:";'<>?,./]/.test(newPassword) || /[\d]/.test(newPassword);
    }
    this.setState({
      hasLength,
      hasLetter,
      hasSymbolNumber,
      passwordValid: currentPassword.length && hasLength && hasLetter && hasSymbolNumber,
      newPassword,
      currentPassword,
    });
  }

  render() {
    const {
      profile,
      profileState,
      settingsPageState,
    } = this.props;

    const {
      focus,
      hasLength,
      hasLetter,
      hasSymbolNumber,
      passwordInputType,
      passwordValid,
      showNewTips,
    } = this.state;

    const { updatingPassword } = profileState;
    const { incorrectPassword } = settingsPageState;

    return (
      <div className="settings-section" styleName="credentials">
        <div className="section-info">
          <h2>
Credentials
          </h2>
          <div className="description">
            Used to log in to your account and cannot be edited. Please contact
            support@topcoder.com if you need to make changes.
          </div>
        </div>
        <div className="section-fields" styleName="credentials-section-fields">
          <div className="form-label username">
Username
          </div>
          <input name="username" value={profile.handle} disabled className="form-field grey" />
          <div className="form-label">
Email
          </div>
          <input name="email" value={profile.email} disabled className="form-field grey" />
          {
            profileState.credential && profileState.credential.hasPassword
            && (
            <div>
              <form name="newPasswordForm" noValidate>
                <div className="form-label">
Current password
                </div>
                <div styleName="validation-bar" className="form-field">
                  <div styleName={`password toggle-password ${focus['current-password-input'] ? 'focus' : ''}`}>
                    <input id="current-password-input" styleName="password-input" ref={this.currentPasswordRef} onChange={this.checkPassword} onFocus={this.onPasswordFocus} onBlur={this.onPasswordBlur} name="currentPassword" type={passwordInputType['current-password-input']} placeholder="Password" required />
                    <label htmlFor="currentPasswordCheckbox">
                      <input type="checkbox" id="currentPasswordCheckbox" onChange={() => this.toggleTypeAttribute('current-password-input')} />
                      Show
                    </label>
                  </div>
                  {
                    incorrectPassword
                    && (
                    <div className="form-input-error">
                      <p>
                        Your current password is incorrect.
                        Please check that you entered the right one.
                      </p>
                    </div>
                    )
                  }
                </div>
                <div className="form-label">
New Password
                </div>
                <div styleName="validation-bar" className="form-field">
                  <div styleName={`password toggle-password ${focus['new-password-input'] ? 'focus' : ''}`}>
                    <input id="new-password-input" styleName="password-input" ref={this.newPasswordRef} onChange={this.checkPassword} onFocus={this.onPasswordFocus} onBlur={this.onPasswordBlur} name="password" type={passwordInputType['new-password-input']} placeholder="Create new password" minLength="8" maxLength="64" required />
                    <label htmlFor="newPasswordCheckbox">
                      <input type="checkbox" id="newPasswordCheckbox" onChange={() => this.toggleTypeAttribute('new-password-input')} />
                      Show
                    </label>
                  </div>
                  <div id="password-tips" styleName="tips password-tips" className={showNewTips ? '' : 'hidden'}>
                    <div styleName="arrow" />
                    <h3>
Your password must have:
                    </h3>
                    <p styleName={hasLength ? 'has-length-between-range' : ''}>
At least 8 characters
                    </p>
                    <p styleName={hasLetter ? 'has-letter' : ''}>
At least one letter
                    </p>
                    <p styleName={hasSymbolNumber ? 'has-symbol-or-number' : ''}>
At least one number or symbol
                    </p>
                  </div>
                </div>
                <div styleName="button-container">
                  <PrimaryButton
                    disabled={!passwordValid || updatingPassword}
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
            )
          }
          {
            profileState.credential && profileState.credential.hasPassword === false
            && (
            <div>
              <p>
                You joined Topcoder by using an external account,
                so we don&quot;t have a password for you.
              </p>
            </div>
            )
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
