/* eslint-disable max-len */
/**
 * Connects the Redux store to the GigsPages component.
 */
import React, { useState } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import LoadingIndicator from 'components/LoadingIndicator';
import tc from 'components/buttons/themed/tc.scss';
import ReferralModal from '../ReferralModal';
import defautlStyle from './style.scss';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};

function ReferralCode(props) {
  const { profile } = props;
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('abcXYZ');
  return (
    <div className={_.isEmpty(profile) ? defautlStyle.container : defautlStyle.containerWithLink}>
      <span className={defautlStyle.title}>Topcoder Referral Program:</span>
      {
        _.isEmpty(profile) ? (
          <React.Fragment>
            <span>Do you know someone who is perfect for a gig? You could earn $500 for referring them!</span>
            <PrimaryButton
              onClick={() => {
                setLoginModalOpen(true);
              }}
              theme={{
                button: buttonThemes.tc['primary-borderless-sm'],
              }}
            >
              REFFER A FRIEND
            </PrimaryButton>
            {
              loginModalOpen
              && (
                <ReferralModal
                  profile={profile}
                  onCloseButton={() => setLoginModalOpen(false)}
                  isReferrSucess={false}
                  isReferrError={false}
                  onReferralDone={() => { }}
                />
              )
            }
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span>Your referral link:</span>
            {
              referralCode ? (
                <div className={defautlStyle.rondedArea}>
                  <span>{`https://www.topcoder.com/gigs/${referralCode}`}</span>
                  <PrimaryButton
                    onClick={() => {
                      const copyhelper = document.createElement('input');
                      copyhelper.className = 'copyhelper';
                      document.body.appendChild(copyhelper);
                      copyhelper.value = `https://www.topcoder.com/gigs/${referralCode}`;
                      copyhelper.select();
                      document.execCommand('copy');
                      document.body.removeChild(copyhelper);
                    }}
                    theme={{
                      button: buttonThemes.tc['primary-borderless-xs'],
                    }}
                  >
                    COPY
                  </PrimaryButton>
                </div>
              ) : <LoadingIndicator />
            }
          </React.Fragment>
        )
      }
    </div>
  );
}

ReferralCode.defaultProps = {
  profile: null,
};

ReferralCode.propTypes = {
  profile: PT.shape(),
};

export default ReferralCode;
