/* eslint-disable max-len */
/**
 * The modal used for gig referral flow
 */

/* global window */

import { isEmpty } from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { config, Link } from 'topcoder-react-utils';
import tc from 'components/buttons/themed/tc.scss';
import LoadingIndicator from 'components/LoadingIndicator';
import modalStyle from './modal.scss';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};

// help article link
const HELP_INFO_LINK = '/community/gig-referral';

function ReferralModal({
  profile,
  onCloseButton,
  isReferrSucess,
  isReferrError,
  referralId,
  onReferralDone,
}) {
  const retUrl = window.location.href;
  return (
    <Modal
      onCancel={onCloseButton}
      theme={modalStyle}
    >
      { !isEmpty(profile) ? (
        <div className={modalStyle.referrals}>
          {
            referralId && !isReferrError && !isReferrSucess && (
            <div className={modalStyle.referrForm}>
              <p style={{ textAlign: 'center' }}>Sending your referral...</p>
              <LoadingIndicator />
            </div>
            )
          }
          {
            isReferrSucess ? (
              <div className={modalStyle.referrSucess}>
                <h3 className={modalStyle.title}>CONGRATULATIONS!</h3>
                <p className={modalStyle.sucessMsg}>Your referral has been sent.</p>
                <div className={modalStyle.ctaButtons}>
                  <PrimaryButton
                    onClick={onReferralDone}
                    theme={{
                      button: buttonThemes.tc['primary-green-md'],
                    }}
                  >
                    CLOSE
                  </PrimaryButton>
                  <Link to="/gigs" className={buttonThemes.tc['primary-white-md']}>FIND ANOTHER GIG</Link>
                </div>
              </div>
            ) : null
          }
          {
            isReferrError ? (
              <div className={modalStyle.referrSucess}>
                <h3 className={modalStyle.title}>OOPS!</h3>
                <p className={modalStyle.loginMsg}>{isReferrError.message}</p>
                {
                  isReferrError.userError ? (
                    <p>If you think this is an error please contact <a href="mailto:support@topcoder.com">support@topcoder.com</a>.</p>
                  ) : (
                    <p>Looks like there is a problem on our end. Please try again.<br />If this persists please contact <a href="mailto:support@topcoder.com">support@topcoder.com</a>.</p>
                  )
                }
                <div className={modalStyle.ctaButtons}>
                  <PrimaryButton
                    onClick={onCloseButton}
                    theme={{
                      button: buttonThemes.tc['primary-green-md'],
                    }}
                  >
                    CLOSE
                  </PrimaryButton>
                  <Link to="/gigs" className={buttonThemes.tc['primary-white-md']}>FIND ANOTHER GIG</Link>
                </div>
              </div>
            ) : null
          }
        </div>
      ) : (
        <div className={modalStyle.loginRequired}>
          <h3 className={modalStyle.title}>REFERRAL PROGRAM</h3>
          <p className={modalStyle.loginMsg}>Please login to receive your referral code.</p>
          <div className={modalStyle.ctaButtons}>
            <PrimaryButton
              onClick={() => {
                window.location = `${config.URL.AUTH}/member?retUrl=${encodeURIComponent(retUrl)}`;
              }}
              theme={{
                button: buttonThemes.tc['primary-green-md'],
              }}
            >
              LOGIN
            </PrimaryButton>
            <Link to={`${config.URL.AUTH}/?retUrl=${encodeURIComponent(retUrl)}&mode=signUp&utm_source=gig_listing&regSource=gigs`} className={buttonThemes.tc['primary-white-md']} openNewTab="true">REGISTER</Link>
          </div>
          <p className={modalStyle.regTxt}>Find out how the referral program works <a href={HELP_INFO_LINK} target="_blank" rel="noreferrer">here</a>.</p>
        </div>
      )}
    </Modal>
  );
}

ReferralModal.defaultProps = {
  profile: null,
  referralId: null,
  isReferrError: null,
};

ReferralModal.propTypes = {
  profile: PT.shape(),
  onCloseButton: PT.func.isRequired,
  isReferrSucess: PT.bool.isRequired,
  isReferrError: PT.shape(),
  referralId: PT.string,
  onReferralDone: PT.func.isRequired,
};

export default ReferralModal;
