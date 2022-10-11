import React, { useState, useEffect, useRef } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import QRCode from 'react-qr-code';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import MfaImage from 'assets/images/account/security/mfa.svg';
import DiceLogo from 'assets/images/account/security/dicelogo.png';
import DiceLogoBig from 'assets/images/account/security/dicelogobig.png';
import GooglePlay from 'assets/images/account/security/google-play.png';
import AppleStore from 'assets/images/account/security/apple-store.svg';
import UnsuccessfulIcon from 'assets/images/account/security/unsuccessful.svg';
import Modal from './Modal';
import VerificationListener from './VerificationListener';


import './styles.scss';

export default function Security({
  usermfa, updateUser2fa, updateUserDice, getNewDiceConnection,
  getDiceConnection, tokenV3, handle, emailAddress,
}) {
  const [setupStep, setSetupStep] = useState(-1);
  const [isConnVerifyRunning, setIsConnVerifyRunning] = useState(false);
  const [connVerifyCounter, setConnVerifyCounter] = useState(0);
  const [isVerificationProcessing, setIsVerificationProcessing] = useState(false);
  const diceVerifyUrl = config.DICE_VERIFY_URL;
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
    setIsVerificationProcessing(false);
  };

  const verifyConnection = () => {
    if (getConnectionAccepted() || usermfa.diceConnectionError) {
      setIsConnVerifyRunning(false);
    } else if (!usermfa.gettingDiceConnection && diceConnection.id) {
      if (connVerifyCounter >= 36) {
        closeSetup();
      } else {
        getDiceConnection(userId, diceConnection.id, tokenV3);
        setConnVerifyCounter(connVerifyCounter + 1);
      }
    }
  };

  const goToVerification = () => {
    if (!getConnectionAccepted()) {
      return;
    }
    setSetupStep(2);
  };

  const verificationCallback = (data) => {
    if (data.success) {
      const userEmail = _.get(data, 'user.profile.Email');
      if (!_.isUndefined(userEmail) && _.lowerCase(userEmail) === _.lowerCase(emailAddress)) {
        updateUserDice(userId, true, tokenV3);
        setSetupStep(3);
      } else {
        setSetupStep(4);
      }
    } else {
      setSetupStep(4);
    }
  };

  const onStartProcessing = () => {
    setIsVerificationProcessing(true);
  };

  useInterval(verifyConnection, setupStep === 1 && isConnVerifyRunning ? 5000 : null);

  const getVerificationStepTitle = () => {
    if (isVerificationProcessing) {
      return 'Processing...';
    }
    return 'STEP 3 OF 3';
  };

  const getVerificationStepText = () => {
    if (isVerificationProcessing) {
      return 'Please wait while your credentials are validated.';
    }
    return 'Scan the following DICE ID QR Code in your DICE ID mobile application to confirm your credential.';
  };

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
          <div styleName="market mmr">
            <a href="https://play.google.com/store/apps/details?id=com.diwallet1" target="_blank" rel="noreferrer" styleName="market-link"><img src={GooglePlay} alt="Google Play Store" /></a>
            <QRCode size={190} value="https://play.google.com/store/apps/details?id=com.diwallet1" />
          </div>
          <div styleName="market">
            <a href="https://apps.apple.com/in/app/dice-id/id1624858853" target="_blank" rel="noreferrer" styleName="market-link"><AppleStore /></a>
            <QRCode size={190} value="https://apps.apple.com/in/app/dice-id/id1624858853" />
          </div>
        </div>
        <div styleName="step-content no-margin">
          After you have downloaded and installed the mobile app,
          <strong> make sure to complete the configuration process. </strong>
          When ready, click next below.
        </div>
      </div>
    </Modal>,
    <Modal
      onCancel={closeSetup}
      leftButtonName="Back"
      leftButtonClick={openSetup}
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
        <div styleName="step-content no-margin">
          Once the connection is established, the service will offer you a Verifiable Credential.
          <br />Press the ACCEPT button in your DICE ID App.
          <br />If you DECLINE the invitation, please try again after 5 minutes.
        </div>
      </div>
    </Modal>,
    <Modal
      onCancel={closeSetup}
      leftButtonName="Cancel"
      leftButtonClick={closeSetup}
      rightButtonName=""
      rightButtonClick={() => {}}
      rightButtonHide
    >
      <div styleName="step-body">
        <div styleName="step-title">
          {getVerificationStepTitle()}
        </div>
        <div styleName="step-content">
          {getVerificationStepText()}
        </div>
        <iframe src={`${diceVerifyUrl}/dice-verifier.html`} title="dice verifier" width="100%" height="350px" />
      </div>
      {isVerificationProcessing && (
      <div styleName="step-footer">
        Powered by DICE ID
      </div>
      )}
      <VerificationListener
        event="message"
        callback={verificationCallback}
        origin={diceVerifyUrl}
        type="DICE_VERIFICATION"
        onProcessing={onStartProcessing}
        startType="DICE_VERIFICATION_START"
      />
    </Modal>,
    <Modal
      onCancel={closeSetup}
      leftButtonName="Cancel"
      leftButtonClick={closeSetup}
      rightButtonName="Finish"
      rightButtonClick={closeSetup}
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
        <div styleName="step-content no-margin">
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
      rightButtonClick={closeSetup}
    >
      <div styleName="step-body">
        <div styleName="step-title-container">
          <div styleName="icon-unsuccessful">
            <UnsuccessfulIcon />
          </div>
          <div styleName="step-title error no-margin">
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
        <div styleName="step-content no-margin">
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
            <div styleName="first-line">
              <div styleName="icon-wrapper">
                <MfaImage />
              </div>
              <div className="onoffswitch" styleName="mfa-switch-mobile">
                <input
                  type="checkbox"
                  name="eprf-onoffswitch"
                  id="pre-onoffswitch-mfa"
                  value="mfaEnabled"
                  checked={mfaChecked}
                  onChange={onUpdateMfaOption}
                  className="onoffswitch-checkbox"
                  disabled={mfaChecked && diceChecked}
                />
                <label htmlFor="pre-onoffswitch-mfa" className="onoffswitch-label" styleName={mfaChecked && diceChecked ? 'disabled-toggle' : ''}>
                  <span className="onoffswitch-inner" />
                  <span className="onoffswitch-switch" />
                  <input type="hidden" />
                </label>
              </div>
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
            <div className="onoffswitch" styleName="mfa-switch">
              <input
                type="checkbox"
                name="eprf-onoffswitch"
                id="pre-onoffswitch-mfa"
                value="mfaEnabled"
                checked={mfaChecked}
                onChange={onUpdateMfaOption}
                className="onoffswitch-checkbox"
                disabled={mfaChecked && diceChecked}
              />
              <label htmlFor="pre-onoffswitch-mfa" className="onoffswitch-label" styleName={mfaChecked && diceChecked ? 'disabled-toggle' : ''}>
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
              <div styleName="info-second-line dice-info">
                DICE ID authentication application
              </div>
              <div styleName="info-second-line dice-info-mobile">
                {diceChecked ? 'DICE ID Authenticator is enabled.' : 'Please set up DICE ID Authenticator from your desktop device'}
              </div>
            </div>
            {diceChecked
              ? (
                <div className="onoffswitch" styleName="dice-switch">
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
  updateUser2fa: PT.func.isRequired,
  updateUserDice: PT.func.isRequired,
  getNewDiceConnection: PT.func.isRequired,
  getDiceConnection: PT.func.isRequired,
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  emailAddress: PT.string.isRequired,
};
