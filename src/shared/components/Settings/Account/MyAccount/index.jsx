/**
 * Child component of Settings/Account/ renders the
 * 'My Account' page.
 */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { omit } from 'lodash';
import Personalization from 'components/Settings/Preferences/Personalization';

import './styles.scss';

export default class MyAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newEmail: '',
      currentEmail: '',
      inputNewEmailVisible: false,
      btnChangeEmailVisible: true,
      btnVerifiEmailVisible: false,
      btnVerifiAgainlVisible: false,
      hasLength: false,
      hasLetter: false,
      hasSymbolNumber: false,
      differentOldPassword: false,
      passwordValid: false,
      showNewTips: false,
      showEmailTips: false,
      focus: {
        'new-password-input': false,
        'new-email-input': false,
        'current-password-input': false,
      },
      passwordInputType: {
        'new-password-input': 'password',
        'new-email-input': 'text',
        'current-password-input': 'password',
      },
      newPassword: '',
      currentPassword: '',
      isMobileView: false,
      screenSM: 768,
    };
    this.newPasswordRef = React.createRef();
    this.currentPasswordRef = React.createRef();

    this.onNewEmailFocus = this.onNewEmailFocus.bind(this);
    this.onNewEmailBlur = this.onNewEmailBlur.bind(this);

    this.onPasswordFocus = this.onPasswordFocus.bind(this);
    this.onPasswordBlur = this.onPasswordBlur.bind(this);
    this.onUpdatePassword = this.onUpdatePassword.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.toggleTypeAttribute = this.toggleTypeAttribute.bind(this);
    this.onSendVerificationEmail = this.onSendVerificationEmail.bind(this);
    this.onCancelVerificationEmail = this.onCancelVerificationEmail.bind(this);
    this.onUpdateNewEmailInput = this.onUpdateNewEmailInput.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    const { profile } = this.props;
    const currentEmail = profile.email;
    this.setState({ currentEmail });
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const {
      profileState,
    } = this.props;
    if (profileState.updatingPassword
      && !nextProps.profileState.updatingPassword
      && !nextProps.settingsPageState.incorrectPassword
    ) {
      this.setState({
        passwordValid: false,
        newPassword: '',
        currentPassword: '',
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
    const {
      clearIncorrectPassword,
    } = this.props;
    clearIncorrectPassword();
  }

  onUpdateNewEmailInput(e) {
    const newEmail = e.target.value;
    this.setState({
      newEmail,
      showEmailTips: false,
    });
  }

  onSendVerificationEmail() {
    const newState = { ...this.state };
    const { updateProfile, profile, tokenV3 } = this.props;

    const email = /^([0-9A-Za-z\-_\.+]+)@([0-9A-Za-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;

    if (newState.newEmail === '' || !email.test(newState.newEmail) || newState.newEmail === newState.currentEmail) {
      newState.focus['new-email-input'] = true;
      newState.showEmailTips = true;
    } else {
      newState.btnChangeEmailVisible = false;
      newState.btnVerifiAgainlVisible = true;
      newState.btnVerifiEmailVisible = false;
      newState.inputNewEmailVisible = false;
      newState.currentEmail = newState.newEmail;

      profile.email = newState.newEmail;
      updateProfile(omit(profile, ['groups']), tokenV3);
    }

    this.setState(newState);
  }

  onCancelVerificationEmail() {
    const newState = { ...this.state };
    newState.inputNewEmailVisible = false;
    newState.btnChangeEmailVisible = true;
    newState.btnVerifiEmailVisible = false;
    this.setState(newState);
  }

  onChangeEmail() {
    const newState = { ...this.state };
    newState.inputNewEmailVisible = true;
    newState.btnChangeEmailVisible = false;
    newState.btnVerifiEmailVisible = true;
    this.setState(newState);
  }

  onUpdatePassword(e) {
    const {
      profile,
      updatePassword,
      tokenV3,
      profileState,
    } = this.props;
    const {
      passwordValid,
    } = this.state;

    const { updatingPassword } = profileState;
    e.preventDefault();
    const { newPassword, currentPassword } = this.state;
    if (!passwordValid || updatingPassword) {
      const newState = { ...this.state };
      newState.focus['new-password-input'] = true;
      newState.showNewTips = true;
      this.setState(newState);
      return;
    }
    updatePassword(
      profile, tokenV3,
      newPassword, currentPassword,
    );
  }

  onNewEmailFocus(e) {
    const newState = { ...this.state };
    newState.focus[e.target.id] = true;

    if (e.target.id === 'new-email-input') {
      newState.showEmailTips = true;
    }

    this.setState(newState);
  }

  onNewEmailBlur(e) {
    const newState = { ...this.state };
    newState.focus[e.target.id] = false;

    if (e.target.id === 'new-email-input') {
      newState.showEmailTips = false;
    }

    this.setState(newState);
  }

  onPasswordFocus(e) {
    const newState = { ...this.state };
    newState.focus[e.target.id] = true;

    if (e.target.id === 'new-password-input') {
      newState.showNewTips = true;
    } else if (e.target.id === 'current-password-input') {
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
    } else if (e.target.id === 'current-password-input') {
      if (e.relatedTarget && e.relatedTarget.id === 'currentPasswordCheckbox') {
        newState.showNewTips = true;
      } else {
        newState.showNewTips = false;
      }
    } else {
      newState.showNewTips = false;
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
    let differentOldPassword = false;
    if (newPassword) {
      hasLength = newPassword.length >= 8;
      hasLetter = /[a-zA-Z]/.test(newPassword);
      hasSymbolNumber = /[-!$@#%^&*()_+|~=`{}[\]:";'<>?,./]/.test(newPassword) || /[\d]/.test(newPassword);
    }
    if (currentPassword !== newPassword) {
      differentOldPassword = true;
    }
    this.setState({
      hasLength,
      hasLetter,
      hasSymbolNumber,
      differentOldPassword,
      passwordValid: currentPassword.length
      && hasLength && hasLetter && hasSymbolNumber && differentOldPassword,
      newPassword,
      currentPassword,
    });
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  render() {
    const {
      settingsUI,
      handle,
      profileState,
      settingsPageState,
    } = this.props;
    const tabs = settingsUI.TABS.ACCOUNT;
    const currentTab = settingsUI.currentAccountTab;
    const containerStyle = currentTab === tabs.MYACCOUNT ? '' : 'hide';
    const {
      newEmail,
      currentEmail,
      btnChangeEmailVisible,
      btnVerifiEmailVisible,
      btnVerifiAgainlVisible,
      focus,
      hasLength,
      hasLetter,
      hasSymbolNumber,
      differentOldPassword,
      passwordInputType,
      showNewTips,
      showEmailTips,
      passwordValid,
      isMobileView,
    } = this.state;

    const { updatingPassword } = profileState;
    const { incorrectPassword } = settingsPageState;

    return (
      <div styleName={containerStyle}>
        <div styleName="myaccount-container">
          {
            incorrectPassword
            && (
              <div styleName="error-message">
                Your current password is incorrect.
                Please check that you entered the right one.
              </div>
            )
          }
          <h1>
            Account
          </h1>
          <div styleName="sub-title">
            Username & Password
          </div>
          <div styleName="form-container-default">
            {
              isMobileView ? (
                <form name="email-form-mobile" styleName="form-mobile" noValidate autoComplete="off">
                  <div styleName="row">
                    <div styleName="field">
                      <label htmlFor="username-mobile">
                        Username
                      </label>
                      <input id="username-mobile" name="username" type="text" value={handle} styleName="form-field grey" disabled />
                    </div>
                    <div styleName="field">
                      <label htmlFor="email-mobile">
                        Primary Email
                      </label>
                      <input id="email-mobile" name="email" type="text" value={currentEmail} styleName="form-field grey" disabled />
                    </div>
                    <div styleName={`field ${btnChangeEmailVisible ? 'hide' : ''}`}>
                      <label htmlFor="newemail">
                        New Email
                      </label>
                      <div styleName="validation-bar" className="form-field">
                        <div styleName={`password toggle-password ${focus['new-email-input'] ? 'focus' : ''}`}>
                          <input id="new-email-input" styleName="password-input" ref={this.newEmailRef} onBlur={this.onNewEmailBlur} value={newEmail} onChange={this.onUpdateNewEmailInput} name="newemail" placeholder="Create new email" required />
                        </div>
                        <div id="password-tips" styleName="tips password-tips" className={showEmailTips ? '' : 'hidden'}>
                          <h3>
                            Your email address is not valid.
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="password-tips" styleName="tips password-tips mobile" className={showEmailTips ? '' : 'hidden'}>
                    <h3>
                      Your email address is not valid.
                    </h3>
                  </div>
                  <div styleName="row">
                    <div styleName={`button-change-email ${btnChangeEmailVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onChangeEmail}
                      >
                        Change Email
                      </PrimaryButton>
                    </div>
                    <div styleName={`button-verification-email ${btnVerifiEmailVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onSendVerificationEmail}
                      >
                        Send Verification Email
                      </PrimaryButton>
                    </div>
                    <div styleName={`button-verification-again ${btnVerifiAgainlVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onSendVerificationEmail}
                      >
                        Send Verification Email Again
                      </PrimaryButton>
                    </div>
                    <div styleName={`button-cancel-change-email ${btnVerifiEmailVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onCancelVerificationEmail}
                      >
                        Cancel
                      </PrimaryButton>
                    </div>
                  </div>
                </form>
              ) : (
                <form name="email-form-default" styleName="form-default" noValidate autoComplete="off">
                  <div styleName="row">
                    <div styleName="field col-1">
                      <label htmlFor="username">
                        Username
                      </label>
                    </div>
                    <div styleName="field col-2">
                      <input id="username" name="username" type="text" value={handle} styleName="form-field grey" disabled />
                    </div>
                  </div>
                  <div styleName="row">
                    <div styleName="field col-1">
                      <label htmlFor="email">
                        Primary Email
                      </label>
                    </div>
                    <div styleName="field col-2">
                      <input id="email" name="email" type="text" value={currentEmail} styleName="form-field grey" disabled />
                    </div>
                  </div>
                  <div styleName={`row ${btnChangeEmailVisible ? 'hide' : ''}`}>
                    <div styleName="field col-1">
                      <label htmlFor="newemail">
                        New Email
                      </label>
                    </div>
                    <div styleName="field col-2">
                      <div styleName="validation-bar" className="form-field">
                        <div styleName={`password toggle-password ${focus['new-email-input'] ? 'focus' : ''}`}>
                          <input id="new-email-input" styleName="password-input" ref={this.newEmailRef} onBlur={this.onNewEmailBlur} value={newEmail} onChange={this.onUpdateNewEmailInput} name="newemail" placeholder="Create new email" required />
                        </div>
                        <div id="password-tips" styleName="tips password-tips" className={showEmailTips ? '' : 'hidden'}>
                          <h3>
                            Your email address is not valid.
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div styleName="row">
                    <div styleName={`button-change-email ${btnChangeEmailVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onChangeEmail}
                      >
                        Change Email
                      </PrimaryButton>
                    </div>
                    <div styleName={`button-verification-email ${btnVerifiEmailVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onSendVerificationEmail}
                      >
                        Send Verification Email
                      </PrimaryButton>
                    </div>
                    <div styleName={`button-verification-again ${btnVerifiAgainlVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onSendVerificationEmail}
                      >
                        Send Verification Email Again
                      </PrimaryButton>
                    </div>
                    <div styleName={`button-cancel-change-email ${btnVerifiEmailVisible ? 'active' : 'hide'}`}>
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onCancelVerificationEmail}
                      >
                        Cancel
                      </PrimaryButton>
                    </div>
                  </div>
                </form>
              )
            }
            {
              profileState.credential && profileState.credential.hasPassword
              && (
                <div styleName="password-wrap">
                  {
                    isMobileView ? (
                      <form name="passowrd-form-mobile" styleName="form-mobile" noValidate autoComplete="off">
                        <div styleName="row">
                          <div styleName="field">
                            <label htmlFor="password">
                              Password
                            </label>
                            <div styleName="validation-bar" className="form-field">
                              <div styleName={`password toggle-password ${focus['current-password-input'] ? 'focus' : ''}`}>
                                <input id="current-password-input" styleName="password-input" ref={this.currentPasswordRef} onChange={this.checkPassword} name="password" type={passwordInputType['current-password-input']} placeholder="Not filled for security reasons" minLength="8" maxLength="64" required />
                                <label htmlFor="currentPasswordCheckbox" styleName="passwordCheckbox">
                                  <input type="checkbox" id="currentPasswordCheckbox" styleName="currentPasswordCheckbox" onChange={() => this.toggleTypeAttribute('current-password-input')} />
                                  Show
                                </label>
                              </div>
                            </div>
                          </div>
                          <div styleName="field">
                            <label htmlFor="email">
                              New password
                            </label>
                            <div styleName="validation-bar" className="form-field">
                              <div styleName={`password toggle-password ${focus['new-password-input'] ? 'focus' : ''}`}>
                                <input id="new-password-input" styleName="password-input" ref={this.newPasswordRef} onChange={this.checkPassword} onFocus={this.onPasswordFocus} onBlur={this.onPasswordBlur} name="password" type={passwordInputType['new-password-input']} placeholder="Type a new password to change it" minLength="8" maxLength="64" required />
                                <label htmlFor="newPasswordCheckbox" styleName="passwordCheckbox">
                                  <input type="checkbox" id="newPasswordCheckbox" styleName="newPasswordCheckbox" onChange={() => this.toggleTypeAttribute('new-password-input')} />
                                  Show
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id="password-tips" styleName="tips password-tips mobile" className={showNewTips ? '' : 'hidden'}>
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
                          <p styleName={differentOldPassword ? 'different-with-old-password' : ''}>
                            Should not be the same as the old password
                          </p>
                        </div>
                        <div styleName="row">
                          <div styleName="button-change-password">
                            <PrimaryButton
                              styleName="white-label"
                              disabled={!passwordValid || updatingPassword}
                              onClick={this.onUpdatePassword}
                            >
                              {
                                !updatingPassword && 'Change Password'
                              }
                              {
                                updatingPassword && <i className="fa fa-spinner fa-spin" />
                              }
                            </PrimaryButton>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <form name="newPasswordForm" styleName="password-section" noValidate>
                        <div styleName="row">
                          <div styleName="field col-1">
                            <label htmlFor="password">
                              Password
                            </label>
                          </div>
                          <div styleName="field col-2">
                            <div styleName="validation-bar" className="form-field">
                              <div styleName={`password toggle-password ${focus['current-password-input'] ? 'focus' : ''}`}>
                                <input id="current-password-input" styleName="password-input" ref={this.currentPasswordRef} onChange={this.checkPassword} name="password" type={passwordInputType['current-password-input']} placeholder="Not filled for security reasons" minLength="8" maxLength="64" required />
                                <label htmlFor="currentPasswordCheckbox" styleName="passwordCheckbox">
                                  <input type="checkbox" id="currentPasswordCheckbox" styleName="currentPasswordCheckbox" onChange={() => this.toggleTypeAttribute('current-password-input')} />
                                  Show
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div styleName="row">
                          <div styleName="field col-1">
                            <label htmlFor="new-password">
                              New password
                            </label>
                          </div>
                          <div styleName="field col-2">
                            <div styleName="validation-bar" className="form-field">
                              <div styleName={`password toggle-password ${focus['new-password-input'] ? 'focus' : ''}`}>
                                <input id="new-password-input" styleName="password-input" ref={this.newPasswordRef} onChange={this.checkPassword} onFocus={this.onPasswordFocus} onBlur={this.onPasswordBlur} name="password" type={passwordInputType['new-password-input']} placeholder="Type a new password to change it" minLength="8" maxLength="64" required />
                                <label htmlFor="newPasswordCheckbox" styleName="passwordCheckbox">
                                  <input type="checkbox" id="newPasswordCheckbox" styleName="newPasswordCheckbox" onChange={() => this.toggleTypeAttribute('new-password-input')} />
                                  Show
                                </label>
                              </div>
                              <div id="password-tips" styleName="tips password-tips" className={showNewTips ? '' : 'hidden'}>
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
                                <p styleName={differentOldPassword ? 'different-with-old-password' : ''}>
                                  Should not be the same as the old password
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div styleName="row">
                          <div styleName="button-change-password">
                            <PrimaryButton
                              styleName="white-label"
                              disabled={!passwordValid || updatingPassword}
                              onClick={this.onUpdatePassword}
                            >
                              {
                                !updatingPassword && 'Change Password'
                              }
                              {
                                updatingPassword && <i className="fa fa-spinner fa-spin" />
                              }
                            </PrimaryButton>
                          </div>
                        </div>
                      </form>
                    )
                  }
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
            <Personalization {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

MyAccount.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  settingsUI: PT.shape().isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  updatePassword: PT.func.isRequired,
  updateProfile: PT.func.isRequired,
  clearIncorrectPassword: PT.func.isRequired,
};
