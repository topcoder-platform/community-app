/* eslint-disable max-len */
/**
 * Child component of Settings/Account/ renders the
 * 'My Account' page.
 */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import { omit, get } from 'lodash';
import ConsentComponent from 'components/Settings/ConsentComponent';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import FormField from 'components/Settings/FormField';
import FormInputText from 'components/Settings/FormInputText';
import Personalization from 'components/Settings/Preferences/Personalization';
import { config } from 'topcoder-react-utils';

import Style from './styles.scss';

const theme = {
  container: Style.modalContainer,
};

export default class MyAccount extends ConsentComponent {
  constructor(props) {
    super(props);

    this.state = {
      newEmail: '',
      currentEmail: '',
      isValidEmail: false,
      btnChangeEmailVisible: true,
      btnVerifiEmailVisible: false,
      btnVerifiAgainlVisible: false,
      hasLength: false,
      hasLetter: false,
      hasSymbolNumber: false,
      differentOldPassword: false,
      passwordValid: false,
      rePasswordValid: false,
      showNewTips: false,
      showRePasswordTips: false,
      showEmailTips: false,
      newEmailSameAsCurrent: false,
      focus: {
        'new-password-input': false,
        'new-email-input': false,
        'current-password-input': false,
        're-new-password-input': false,
      },
      passwordInputType: {
        'new-password-input': 'password',
        'new-email-input': 'text',
        'current-password-input': 'password',
        're-new-password-input': 'password',
      },
      newPassword: '',
      currentPassword: '',
      reNewPassword: '',
      isMobileView: false,
      screenSM: 767,
      isSent: false,
      isOpen: false,
    };
    this.reNewPasswordRef = React.createRef();
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
    this.updateButtonsVisible = this.updateButtonsVisible.bind(this);
  }

  componentDidMount() {
    const { profile, loadTabData } = this.props;
    const currentEmail = profile.email;
    this.setState({ currentEmail });
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
    loadTabData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { profileState, profile } = this.props;
    if (profile.email !== nextProps.profile.email) {
      this.setState({ currentEmail: nextProps.profile.email });
    }
    if (profileState.updatingPassword
      && !nextProps.profileState.updatingPassword
      && !nextProps.settingsPageState.incorrectPassword
    ) {
      this.setState({
        rePasswordValid: false,
        passwordValid: false,
        newPassword: '',
        currentPassword: '',
        reNewPassword: '',
      });
    }

    if (nextProps.profileState.updateProfileSuccess
      && !nextProps.profileState.updatingProfile
      && this.state.isSent) {
      this.setState({
        isOpen: true,
      });
    }

    if (nextProps.profileState.updateProfileSuccess
      && !nextProps.profileState.updatingProfile
      && this.state.isSent) {
      this.setState({
        isOpen: true,
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
    const { profileState, updateEmailConflict } = this.props;
    if (profileState.isEmailConflict) {
      updateEmailConflict(false);
    }
    const newEmail = e.target.value;
    const newState = { ...this.state };
    const email = /^([0-9A-Za-z\-_\.+]+)@([0-9A-Za-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;

    newState.newEmail = newEmail;

    if (newEmail === '' || !email.test(newEmail) || newEmail === newState.currentEmail) {
      newState.focus['new-email-input'] = true;
      newState.isValidEmail = false;
      newState.showEmailTips = newEmail !== '';
      newState.newEmailSameAsCurrent = newEmail === newState.currentEmail;
    } else {
      newState.showEmailTips = false;
      newState.isValidEmail = true;
    }

    this.setState(newState);
  }

  onSendVerificationEmail() {
    this.setState({
      isSent: true,
    });
    const { updateProfile, profile, tokenV3 } = this.props;
    profile.email = this.state.newEmail;
    profile.verifyUrl = `${config.URL.EMAIL_VERIFY_URL}`;
    updateProfile(omit(profile, ['groups']), tokenV3);
  }

  onCancelVerificationEmail() {
    const newState = { ...this.state };
    newState.btnChangeEmailVisible = true;
    newState.btnVerifiEmailVisible = false;
    this.setState(newState);
  }

  onChangeEmail() {
    const { profileState } = this.props;
    if (get(profileState, 'credential.hasPassword')) {
      const newState = { ...this.state };
      newState.btnChangeEmailVisible = false;
      newState.btnVerifiEmailVisible = true;
      this.setState(newState);
    }
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
      rePasswordValid,
      newPassword,
      currentPassword,
    } = this.state;

    const { updatingPassword } = profileState;
    if (e) e.preventDefault();

    if (!passwordValid || !rePasswordValid || updatingPassword) {
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
    } else if (e.target.id === 're-new-password-input') {
      newState.showRePasswordTips = true;
    }

    this.setState(newState);
  }

  onPasswordBlur(e) {
    const newState = { ...this.state };
    newState.focus[e.target.id] = false;

    if (e.target.id === 'new-password-input') {
      newState.showNewTips = false;
    } else if (e.target.id === 're-new-password-input') {
      newState.showRePasswordTips = false;
    } else {
      newState.showNewTips = false;
      newState.showRePasswordTips = false;
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
  }

  checkPassword(e) {
    const {
      clearIncorrectPassword,
    } = this.props;
    let { newPassword, currentPassword, reNewPassword } = this.state;

    if (e.target.id === 'current-password-input') {
      currentPassword = e.target.value;
      clearIncorrectPassword();
    } else if (e.target.id === 're-new-password-input') {
      reNewPassword = e.target.value;
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
      reNewPassword,
      rePasswordValid: reNewPassword.length > 0 && newPassword === reNewPassword,
    });
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  updateButtonsVisible(sendSuccess) {
    const newState = { ...this.state };
    if (sendSuccess) {
      newState.btnVerifiAgainlVisible = true;
      newState.btnVerifiEmailVisible = false;
    }

    // rest sent verification email status
    newState.isSent = false;
    // close modal
    newState.isOpen = false;

    this.setState(newState);
  }

  render() {
    const {
      handle,
      settingsPageState,
      profileState,
    } = this.props;

    const {
      newEmail,
      currentEmail,
      btnChangeEmailVisible,
      // btnVerifiEmailVisible,
      // btnVerifiAgainlVisible,
      focus,
      hasLength,
      hasLetter,
      hasSymbolNumber,
      differentOldPassword,
      passwordInputType,
      showNewTips,
      showEmailTips,
      newEmailSameAsCurrent,
      passwordValid,
      showRePasswordTips,
      rePasswordValid,
      // isValidEmail,
      isOpen,
    } = this.state;

    const { updatingPassword, /* updatingProfile, */ isEmailConflict = false } = profileState;
    const { incorrectPassword } = settingsPageState;

    return (
      <React.Fragment>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {
          isOpen && (
            <Modal theme={theme}>
              <div styleName="verification-send-container">
                <div styleName="verification-send-details">
                  <div styleName="verification-send-title">
                    Email Change Verification
                  </div>
                  <div styleName="verification-send-message">
                    A confirmation email has been sent to both accounts.&nbsp;
                    In order to finalize your email address change request,&nbsp;
                    you must click on the links in the message sent to both your&nbsp;
                    old and new email accounts.
                  </div>
                  <div styleName="verification-send-button">
                    <PrimaryButton
                      styleName="white-label"
                      onClick={() => this.updateButtonsVisible(true)}
                    >
                      Close
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </Modal>
          )
        }
        <div styleName="form-container">
          <Collapse>
            <h2 styleName="form-title">
              Username & Password
            </h2>
            {
              incorrectPassword
              && (
                <div styleName="error-message" style={{ marginBottom: '20px' }}>
                  Your current password is incorrect.
                  Please check that you entered the right one.
                </div>
              )
            }
            <div styleName="form-content">
              <div styleName="form-label">
                While your Topcoder handle or username and your email cannot be changed,
                we encourage to change your password frequently.
              </div>
              <div styleName="form-body">
                <form styleName="account-form" noValidate autoComplete="off">
                  <FormField label="Username" style={{ flex: '0 0 100%' }} disabled>
                    <FormInputText
                      id="username"
                      name="username"
                      type="text"
                      value={handle}
                      disabled
                    />
                  </FormField>
                  <FormField label="Primary Email" style={{ flex: '0 0 100%' }} disabled>
                    <FormInputText
                      id="email"
                      name="email"
                      type="text"
                      value={currentEmail}
                      disabled
                    />
                  </FormField>
                  <div styleName={`row ${btnChangeEmailVisible ? 'hide' : ''}`}>
                    <div styleName="field col-1">
                      <label htmlFor="newemail">
                        New Email
                        <input type="hidden" />
                      </label>
                    </div>
                    <div styleName="field col-2">
                      <div styleName="validation-bar" className="form-field">
                        <div styleName={`password toggle-password ${focus['new-email-input'] ? 'focus' : ''}`}>
                          <input id="new-email-input" styleName="password-input" ref={this.newEmailRef} onBlur={this.onNewEmailBlur} value={newEmail} onChange={this.onUpdateNewEmailInput} name="newemail" placeholder="New email" required />
                        </div>
                        <div id="password-tips" styleName="tips password-tips" className={showEmailTips ? '' : 'hidden'}>
                          <h3>
                            {
                              newEmailSameAsCurrent
                                ? 'The new email cannot be the same as the current email.'
                                : 'Your email address is not valid.'
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    get(profileState, 'credential.hasPassword') === false && (
                      <div styleName="error-message">
                        Since you joined Topcoder using your &lt;SSO Service&gt; account,
                        any email updates will need to be handled by logging in to
                        your &lt;SSO Service&gt; account.
                      </div>
                    )
                  }
                  {
                    isEmailConflict && (
                      <div styleName="error-message">
                        The email you have entered is already in use.
                      </div>
                    )
                  }
                  {/* TEMPORARY DISABLE CHANGE E-MAIL - community-app#5107
                  <div styleName="row button-group">
                    <div
                      styleName={`button-change-email ${btnChangeEmailVisible ? 'active' : 'hide'}`}
                    >
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onChangeEmail}
                      >
                        Change Email
                      </PrimaryButton>
                    </div>
                    <div
                      styleName={
                        `button-verification-email ${btnVerifiEmailVisible ? 'active' : 'hide'}`
                      }
                    >
                      <PrimaryButton
                        styleName="white-label"
                        disabled={!isValidEmail || updatingProfile}
                        onClick={this.onSendVerificationEmail}
                      >
                        Send Verification Email
                      </PrimaryButton>
                    </div>
                    <div
                      styleName={
                        `button-verification-again ${btnVerifiAgainlVisible ? 'active' : 'hide'}`
                      }
                    >
                      <PrimaryButton
                        styleName="white-label"
                        disabled={!isValidEmail || updatingProfile}
                        onClick={this.onSendVerificationEmail}
                      >
                        Send Verification Email Again
                      </PrimaryButton>
                    </div>
                    <div
                      styleName={
                        `button-cancel-change-email ${btnVerifiEmailVisible ? 'active' : 'hide'}`
                      // }
                    >
                      <PrimaryButton
                        styleName="white-label"
                        onClick={this.onCancelVerificationEmail}
                      >
                        Cancel
                      </PrimaryButton>
                    </div>
                  </div>
                  // */}
                </form>
                {
                  profileState.credential && profileState.credential.hasPassword
                  && (
                  <React.Fragment>
                    <form name="newPasswordForm" styleName="password-form" noValidate>
                      <FormField label="Current Password" style={{ flex: '0 0 100%' }}>
                        <FormInputText
                          ref={this.currentPasswordRef}
                          id="current-password-input"
                          name="password"
                          type={passwordInputType['current-password-input']}
                          onChange={this.checkPassword}
                          placeholder="Type your current password"
                          minLength="8"
                          maxLength="64"
                          required
                        />
                      </FormField>

                      {/* show password */}
                      {/* <div>
                          <div styleName="validation-bar" className="form-field">
                            <div styleName={`password toggle-password ${focus['current-password-input'] ? 'focus' : ''}`}>
                              <label htmlFor="currentPasswordCheckbox" styleName="passwordCheckbox">
                                <input type="checkbox" id="currentPasswordCheckbox" styleName="currentPasswordCheckbox"
                                onChange={() => this.toggleTypeAttribute('current-password-input')} />
                                Show
                              </label>
                            </div>
                          </div>
                        </div> */}

                      <FormField label="New Password" style={{ flex: '0 0 100%' }}>
                        <FormInputText
                          ref={this.newPasswordRef}
                          id="new-password-input"
                          name="password"
                          type={passwordInputType['new-password-input']}
                          onChange={this.checkPassword}
                          onFocus={this.onPasswordFocus}
                          onBlur={this.onPasswordBlur}
                          placeholder="Type your new password"
                          minLength="8"
                          maxLength="64"
                          required
                        />
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
                      </FormField>

                      {/* <div>
                        <div styleName="validation-bar" className="form-field">
                          <div styleName={`password toggle-password ${focus['new-password-input'] ? 'focus' : ''}`}>
                            <label htmlFor="newPasswordCheckbox" styleName="passwordCheckbox">
                              <input type="checkbox" id="newPasswordCheckbox" styleName="newPasswordCheckbox" onChange={() => this.toggleTypeAttribute('new-password-input')} />
                              Show
                            </label>
                          </div>
                        </div>
                      </div> */}

                      <FormField label="Re-Type New Password" style={{ flex: '0 0 100%' }}>
                        <FormInputText
                          ref={this.reNewPasswordRef}
                          id="re-new-password-input"
                          name="re-password"
                          type={passwordInputType['re-new-password-input']}
                          onChange={this.checkPassword}
                          onFocus={this.onPasswordFocus}
                          onBlur={this.onPasswordBlur}
                          placeholder="Re-Type New Password"
                          minLength="8"
                          maxLength="64"
                          required
                        />
                        <div id="password-tips" styleName="tips password-tips" className={showRePasswordTips ? '' : 'hidden'}>
                          <h3>
                            Your Re-typed password must:
                          </h3>
                          <p styleName={rePasswordValid ? 're-password-match' : ''}>
                            Match the new password entered
                          </p>
                        </div>
                      </FormField>

                      {/* <div>
                        <div styleName="validation-bar" className="form-field">
                          <div styleName={`password toggle-password ${focus['re-new-password-input'] ? 'focus' : ''}`}>
                            <input id="re-new-password-input" styleName="password-input" ref={this.reNewPasswordRef} onChange={this.checkPassword} onFocus={this.onPasswordFocus} onBlur={this.onPasswordBlur} name="re-password" type={passwordInputType['re-new-password-input']} placeholder="RE-TYPE YOUR NEW PASSWORD" minLength="8" maxLength="64" required />
                            <label htmlFor="reNewPasswordCheckbox" styleName="passwordCheckbox">
                              <input type="checkbox" id="reNewPasswordCheckbox" styleName="newPasswordCheckbox" onChange={() => this.toggleTypeAttribute('re-new-password-input')} />
                              Show
                            </label>
                          </div>
                        </div>
                      // </div> */}
                    </form>

                    <div styleName="button-change-password">
                      <PrimaryButton
                        theme={{ button: Style.button }}
                        disabled={!passwordValid || !rePasswordValid || updatingPassword}
                        onClick={this.onUpdatePassword}
                      >
                        { !updatingPassword && 'Change Password' }
                        { updatingPassword && <i className="fa fa-spinner fa-spin" /> }
                      </PrimaryButton>
                    </div>
                  </React.Fragment>
                  )
                }
                {
                  profileState.credential && profileState.credential.hasPassword === false
                  && (
                    <div styleName="sso-text">
                      <p>
                        You joined Topcoder by using an external account,
                        so we don&#39;t have a password for you.
                      </p>
                    </div>
                  )
                }
                <Personalization {...this.props} />
              </div>
            </div>
          </Collapse>
        </div>
      </React.Fragment>
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
  loadTabData: PT.func.isRequired,
  updateEmailConflict: PT.func.isRequired,
};
