/* eslint-disable max-len */
/**
 * Connects the Redux store to the GigsPages component.
 */
import React, { useState } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { PrimaryButton } from 'topcoder-react-ui-kit';
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
  return (
    <div className={defautlStyle.container}>
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
                  onReferralDone={() => {}}
                />
              )
            }
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span>Your referral link:</span>
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
