import React, { useState, useEffect, useRef } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import QRCode from 'react-qr-code';
import { UserManager } from 'oidc-client';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import MfaImage from 'assets/images/account/security/mfa.svg';
import DiceLogo from 'assets/images/account/security/dicelogo.png';
import DiceLogoBig from 'assets/images/account/security/dicelogobig.png';
import GooglePlay from 'assets/images/account/security/google-play.svg';
import AppleStore from 'assets/images/account/security/apple-store.svg';
import UnsuccessfulIcon from 'assets/images/account/security/unsuccessful.svg';
import Modal from './Modal';


import './styles.scss';

export default function Security({
  usermfa, getUser2fa, updateUser2fa, updateUserDice, getNewDiceConnection,
  getDiceConnection, tokenV3, handle, emailAddress,
}) {
  const [setupStep, setSetupStep] = useState(-1);
  const [isConnVerifyRunning, setIsConnVerifyRunning] = useState(false);
  const [connVerifyCounter, setConnVerifyCounter] = useState(0);
  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
      setConnVerifyCounter(0);
    }, [delay]);
  };

  const getMfaOption = () => {
    const mfaEnabled = _.get(usermfa, 'user2fa.mfaEnabled');
    if (mfaEnabled) return true;
    return false;
  };

  const getDiceOption = () => {
    const diceEnabled = _.get(usermfa, 'user2fa.diceEnabled');
    if (diceEnabled) return true;
    return false;
  };

  const mfaChecked = getMfaOption();
  const diceChecked = getDiceOption();
  const userId = _.get(usermfa, 'user2fa.userId');
  const diceConnection = _.get(usermfa, 'diceConnection');

  const onUpdateMfaOption = () => {
    if (usermfa.updatingUser2fa) {
      return;
    }
    updateUser2fa(userId, !mfaChecked, tokenV3);
  };

  const goToConnection = () => {
    if (mfaChecked && !usermfa.gettingNewDiceConnection) {
      getNewDiceConnection(userId, tokenV3);
    }
    setSetupStep(1);
    setIsConnVerifyRunning(true);
  };

  const getConnectionAccepted = () => {
    if (diceConnection.accepted) return true;
    return false;
  };

  const openSetup = () => {
    setSetupStep(0);
  };

  const closeSetup = () => {
    setSetupStep(-1);
  };

  const verifyConnection = () => {
    if (getConnectionAccepted() || usermfa.diceConnectionError) {
      setIsConnVerifyRunning(false);
    } else if (!usermfa.gettingDiceConnection && diceConnection.id) {
      if (connVerifyCounter >= 60) {
        closeSetup();
      } else {
        getDiceConnection(userId, diceConnection.id, tokenV3);
        setConnVerifyCounter(connVerifyCounter + 1);
      }
    }
  };

  const verificationPopup = () => {
    const diceUrl = config.DICE_VERIFIER_URL;
    const accountsAuth = config.URL.AUTH;
    const manager = new UserManager({
      authority: diceUrl,
      client_id: 'topcoder',
      response_type: 'code',
      scope: 'openid profile vc_authn',
      popup_redirect_uri: `${accountsAuth}/dice-verify-callback.html`,
      response_mode: 'query',
      loadUserInfo: false,
      popupWindowFeatures: 'location=no,toolbar=no,menubar=no,width=1000,height=611,left=100,top=100',
    });
    manager.settings.metadata = {
      issuer: diceUrl,
      jwks_uri: `${diceUrl}/.well-known/openid-configuration/jwks`,
      authorization_endpoint: `${diceUrl}/vc/connect/authorize?pres_req_conf_id=Topcoder_2FA_Validate_Cred`,
      token_endpoint: `${diceUrl}/vc/connect/token`,
      userinfo_endpoint: `${diceUrl}/connect/userinfo`,
      check_session_iframe: `${diceUrl}/vc/connect/checksession`,
      revocation_endpoint: `${diceUrl}/vc/connect/revocation`,
    };

    manager.signinPopup().then(
      (user) => {
        const userEmail = _.get(user, 'profile.Email');
        if (!_.isUndefined(userEmail) && _.lowerCase(userEmail) === _.lowerCase(emailAddress)) {
          updateUserDice(userId, true, tokenV3);
          setSetupStep(3);
        } else {
          setSetupStep(4);
        }
      },
      () => { setSetupStep(4); },
    );
  };

  const goToVerification = () => {
    if (!getConnectionAccepted()) {
      return;
    }
    setSetupStep(2);
    verificationPopup();
  };

  const finishSetup = () => {
    getUser2fa(userId, tokenV3);
    closeSetup();
  };

  useInterval(verifyConnection, setupStep === 1 && isConnVerifyRunning ? 5000 : null);

  const setupStepNodes = [
    <Modal
      onCancel={closeSetup}
      leftButtonName="Cancel"
      leftButtonClick={closeSetup}
      rightButtonName="Next"
      rightButtonClick={goToConnection}
    >
      <div styleName="step-body">
        <div styleName="step-title">
          STEP 1 OF 3
        </div>
        <div styleName="step-content">
          First, please download the DICE ID App from the
          Google Play Store or the iOS App Store.
        </div>
        <div styleName="app-store">
          <div styleName="market">
            <GooglePlay />
            <QRCode size={190} value="https://play.google.com/store/apps/details?id=com.diwallet1" />
          </div>
          <div styleName="market">
            <AppleStore />
            <QRCode size={190} value="https://apps.apple.com/in/app/dice-id/id1624858853" />
          </div>
        </div>
        <div styleName="step-content">
          After you have downloaded and installed the mobile app,
          <strong> make sure to complete the configuration process. </strong>
          When ready, click next below.
        </div>
      </div>
    </Modal>,
    <Modal
      onCancel={closeSetup}
      leftButtonName="Cancel"
      leftButtonClick={closeSetup}
      rightButtonName="Next"
      rightButtonClick={goToVerification}
      rightButtonDisabled={!getConnectionAccepted()}
    >
      <div styleName="step-body">
        <div styleName="step-title">
          STEP 2 OF 3
        </div>
        <div styleName="step-content">
          Scan the following DICE ID QR Code in your DICE ID mobile application.
        </div>
        <div styleName="app-store">
          {diceConnection.connection
            ? <QRCode size={298} value={diceConnection.connection} />
            : 'Loading'}
        </div>
        <div styleName="step-content">
          Once the connection is established, the service will offer you a Verifiable Credential.
          <br />Press the ACCEPT button in your DICE ID App.
        </div>
      </div>
    </Modal>,
    <Modal
      onCancel={closeSetup}
      leftButtonName="Cancel"
      leftButtonClick={closeSetup}
      rightButtonName="Finish"
      rightButtonClick={() => {}}
      rightButtonDisabled
    >
      <div styleName="step-body">
        <div styleName="step-title">
          Processing...
        </div>
        <div styleName="step-content">
          Please wait while your credentials are validated.
        </div>
        <div styleName="body-logo">
          <img src={DiceLogoBig} alt="diceid" />
        </div>
      </div>
      <div styleName="step-footer">
        Powered by DICE ID
      </div>
    </Modal>,
    <Modal
      onCancel={closeSetup}
      leftButtonName="Cancel"
      leftButtonClick={closeSetup}
      rightButtonName="Finish"
      rightButtonClick={finishSetup}
    >
      <div styleName="step-body">
        <div styleName="step-title">
          Setup completed!
        </div>
        <div styleName="step-content">
          Hello {handle},<br /><br />
          Your credentials have been verified and you are all set
          for MFA using your decentralized identity (DICE ID).
        </div>
        <div styleName="body-logo">
          <img src={DiceLogoBig} alt="diceid" />
        </div>
        <div styleName="step-content">
          For more information on DICE ID, please visit<br />
          <a href="https://www.diceid.com/" target="_blank" rel="noreferrer" style={{ color: '#0D61BF' }}>https://www.diceid.com/</a><br /><br />
          Please click Finish bellow.
        </div>
      </div>
    </Modal>,
    <Modal
      onCancel={closeSetup}
      leftButtonName="Cancel"
      leftButtonClick={closeSetup}
      rightButtonName="Finish"
      rightButtonClick={finishSetup}
    >
      <div styleName="step-body">
        <div styleName="step-title-container">
          <div styleName="icon-unsuccessful">
            <UnsuccessfulIcon />
          </div>
          <div styleName="step-title error">
            Unsuccessful Verification
          </div>
        </div>
        <div styleName="step-content">
          Hello {handle},<br /><br />
          Your credentials could not be verified,
          you won&apos;t be able to connect to MFA using your decentralized identity (DICE ID).
        </div>
        <div styleName="body-logo">
          <img src={DiceLogoBig} alt="diceid" />
        </div>
        <div styleName="step-content">
          Please try again your process after few minutes.<br /><br />
          Please click Finish bellow.
        </div>
      </div>
    </Modal>,
  ];
  return (
    <React.Fragment>
      {setupStep >= 0 && (
        setupStepNodes[setupStep]
      )}
      <div styleName="security-container">
        <Collapse>
          <h2 styleName="security-title">
            Security
          </h2>
          <div styleName="factor-container">
            <div styleName="icon-wrapper">
              <MfaImage />
            </div>
            <div styleName="info">
              <div styleName="info-first-line">
                Multi Factor Authentication (MFA) Status
              </div>
              <div styleName="info-second-line">
                Status of MFA for your Topcoder account.
                If enabled, MFA will be enforced during the Topcoder login process.
              </div>
            </div>
            <div className="onoffswitch" styleName="on-off-switch">
              <input
                type="checkbox"
                name="eprf-onoffswitch"
                id="pre-onoffswitch-mfa"
                value="mfaEnabled"
                checked={mfaChecked}
                onChange={onUpdateMfaOption}
                className="onoffswitch-checkbox"
                disabled={mfaChecked}
              />
              <label htmlFor="pre-onoffswitch-mfa" className="onoffswitch-label" styleName={mfaChecked ? 'disabled-toggle' : ''}>
                <span className="onoffswitch-inner" />
                <span className="onoffswitch-switch" />
                <input type="hidden" />
              </label>
            </div>
          </div>
          <div styleName="factor-container">
            <div styleName="icon-wrapper">
              <img src={DiceLogo} alt="diceid" />
            </div>
            <div styleName="info">
              <div styleName="info-first-line">
                DICE ID Authenticator App
              </div>
              <div styleName="info-second-line">
                DICE ID authentication application
              </div>
            </div>
            {diceChecked
              ? (
                <div className="onoffswitch">
                  <input
                    type="checkbox"
                    name="pre-onoffswitch-dice"
                    id="pre-onoffswitch-dice"
                    value="diceEnabled"
                    checked
                    onChange={() => { }}
                    className="onoffswitch-checkbox"
                    disabled
                  />
                  <label htmlFor="pre-onoffswitch-dice" className="onoffswitch-label" styleName="disabled-toggle">
                    <span className="onoffswitch-inner" />
                    <span className="onoffswitch-switch" />
                    <input type="hidden" />
                  </label>
                </div>
              )
              : (
                <div styleName={`button ${mfaChecked ? '' : 'disabled'}`} onClick={openSetup} role="button" tabIndex={0} onKeyDown={openSetup}>
                  Setup DICE ID Authentication
                </div>
              )
            }
          </div>
        </Collapse>
      </div>
    </React.Fragment>
  );
}

Security.propTypes = {
  usermfa: PT.shape().isRequired,
  getUser2fa: PT.func.isRequired,
  updateUser2fa: PT.func.isRequired,
  updateUserDice: PT.func.isRequired,
  getNewDiceConnection: PT.func.isRequired,
  getDiceConnection: PT.func.isRequired,
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  emailAddress: PT.string.isRequired,
};
