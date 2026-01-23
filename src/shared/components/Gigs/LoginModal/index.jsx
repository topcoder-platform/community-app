/* eslint-disable max-len */
/**
 * The modal used for login enforcing
 */

/* global window */

import PT from 'prop-types';
import React from 'react';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import SVG from 'react-inlinesvg';
import MediaQuery from 'react-responsive';
import tc from 'components/buttons/themed/tc.scss';
import ThinkingFaceMobile from 'assets/images/thinking-face-mobile.svg';
import ThinkingFace from 'assets/images/thinking-face-laptop-tablet.svg';
import modalStyle from './modal.scss';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};

const blobYellow = 'https://images.ctfassets.net/b5f1djy59z3a/3wYRUnrUj3v765abrGRwlM/b0f9b49b4f49dc163e6913559a19b9e3/blob-yellow.svg';
const progressBar = 'https://images.ctfassets.net/b5f1djy59z3a/2BX7LOrvVzKEarIJ8boCFm/bba0dd3e0180d2dc355809e6c1954631/progress-bar.svg';
const progressBarMid = 'https://images.ctfassets.net/b5f1djy59z3a/517ZRt9geweW3QTtzlUqJu/11e33e876426f97e0725ba5fff9755f8/progress-bar-mid.svg';
const progressBarXS = 'https://images.ctfassets.net/b5f1djy59z3a/6QxH7uVKCngtzBaXDn3Od1/3e0222a1ce773cead3f3a45f291f43a6/progress-bar-mobile.svg';
const blobPurple = 'https://images.ctfassets.net/b5f1djy59z3a/1ZRCwp1uoShcES16lQmeu/ba084734120ffedebcb92b4e3fa2d667/blob-purple.svg';

function LoginModal({ retUrl, onCancel, utmSource }) {
  return (
    <Modal
      theme={modalStyle}
      onCancel={onCancel}
    >
      <div className={modalStyle.loginRequired}>
        <SVG src={blobYellow} className={modalStyle.blobYellow} />
        <h3 className={modalStyle.title}>YAY! You are almost done!</h3>
        <p className={modalStyle.loginMsg}>
          Looks like you&apos;re not a Topcoder member yet. Or maybe
          you&apos;re not logged in?<MediaQuery maxDeviceWidth={425}><ThinkingFaceMobile className={modalStyle.thinkingFace} /></MediaQuery><MediaQuery minDeviceWidth={426}><ThinkingFace className={modalStyle.thinkingFace} /></MediaQuery>
          It&apos;s quick to register and it&apos;s free!
        </p>
        <MediaQuery minDeviceWidth={769}>
          <SVG src={progressBar} className={modalStyle.progressBar} />
        </MediaQuery>
        <MediaQuery maxDeviceWidth={768} minDeviceWidth={630}>
          <SVG src={progressBarMid} className={modalStyle.progressBar} />
        </MediaQuery>
        <MediaQuery maxDeviceWidth={630}>
          <SVG src={progressBarXS} className={modalStyle.progressBar} />
        </MediaQuery>
        <div className={modalStyle.ctaButtons}>
          <PrimaryButton
            onClick={() => {
              window.location = `${config.URL.AUTH}/?retUrl=${encodeURIComponent(retUrl)}&mode=signUp&utmSource=${utmSource}&regSource=gigs`;
            }}
            theme={{
              button: buttonThemes.tc['primary-green-md'],
            }}
          >
            REGISTER NOW
          </PrimaryButton>
        </div>
        <p className={modalStyle.regTxt}>Already a member? <a href={`${config.URL.AUTH}/member?retUrl=${encodeURIComponent(retUrl)}`}>Login here</a></p>
        <SVG src={blobPurple} className={modalStyle.blobPurple} />
      </div>
    </Modal>
  );
}

LoginModal.defaultProps = {
  utmSource: 'gig_listing',
};

LoginModal.propTypes = {
  retUrl: PT.string.isRequired,
  onCancel: PT.func.isRequired,
  utmSource: PT.string,
};

export default LoginModal;
