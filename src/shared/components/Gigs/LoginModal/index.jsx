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

const blobYellow = `${config.URL.CMS_ASSETS}/media/contentful/images.ctfassets.net/45/45dbf3e0e08511e3f8e40ef6d63ea80b35b5f53b6e0dd5c0486c466dfc0c6b9b/blob-yellow-45dbf3e0e08511e3f8e40ef6d63ea80b35b5f53b6e0dd5c0486c466dfc0c6b9b.svg`;
const progressBar = `${config.URL.CMS_ASSETS}/media/contentful/images.ctfassets.net/db/db97ea47aab5b090aad54abb6f4d221b6b4ff165d18096fff1bf9038032219e6/progress-bar-db97ea47aab5b090aad54abb6f4d221b6b4ff165d18096fff1bf9038032219e6.svg`;
const progressBarMid = `${config.URL.CMS_ASSETS}/media/contentful/images.ctfassets.net/f8/f8c3a9883da7f94d8c602283f82a1b7fa3181e8b0b37487a2061ea73ba566e9e/progress-bar-mid-f8c3a9883da7f94d8c602283f82a1b7fa3181e8b0b37487a2061ea73ba566e9e.svg`;
const progressBarXS = `${config.URL.CMS_ASSETS}/media/contentful/images.ctfassets.net/88/8897cb2cc7986602e2293cf23f9f6b381c6618ec3264f6e6876362715e36a8f3/progress-bar-mobile-8897cb2cc7986602e2293cf23f9f6b381c6618ec3264f6e6876362715e36a8f3.svg`;
const blobPurple = `${config.URL.CMS_ASSETS}/media/contentful/images.ctfassets.net/8b/8b6773784c375be832e3515de713427cc0bd02690eb5451c6813d9feb731871a/blob-purple-8b6773784c375be832e3515de713427cc0bd02690eb5451c6813d9feb731871a.svg`;

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
