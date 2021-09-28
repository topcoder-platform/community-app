/* eslint-disable max-len */
/**
 * Connects the Redux store to the GigsPages component.
 */
import React, { useState, useEffect } from 'react';
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
  const { profile, growSurf } = props;
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [growSurfState, setGrowSurfState] = useState(growSurf);
  const [copyBtnText, setCopyBtnText] = useState('COPY');
  useEffect(() => {
    setGrowSurfState(props.growSurf);
  }, [growSurf]);

  return (
    <div className={_.isEmpty(profile) ? defautlStyle.container : defautlStyle.containerWithLink}>
      {
        _.isEmpty(profile) ? (
          <span className={defautlStyle.title}>Topcoder Referral Program:</span>
        ) : (
          <a className={defautlStyle.title} href="/community/gig-referral" target="_blank" rel="noreferrer">Topcoder Referral Program:</a>
        )
      }
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
              REFER A FRIEND
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
              growSurfState.loading && <LoadingIndicator />
            }
            {
              growSurfState.data && (
                <div className={defautlStyle.rondedArea}>
                  <span>{`https://www.topcoder.com/gigs?referralId=${growSurfState.data.id}`}</span>
                  <PrimaryButton
                    onClick={() => {
                      const copyhelper = document.createElement('input');
                      copyhelper.className = 'copyhelper';
                      document.body.appendChild(copyhelper);
                      copyhelper.value = `https://www.topcoder.com/gigs?referralId=${growSurfState.data.id}`;
                      copyhelper.select();
                      document.execCommand('copy');
                      document.body.removeChild(copyhelper);
                      setCopyBtnText('COPIED');
                      setTimeout(() => {
                        setCopyBtnText('COPY');
                      }, 3000);
                    }}
                    theme={{
                      button: buttonThemes.tc['primary-borderless-xs'],
                    }}
                  >
                    {copyBtnText}
                  </PrimaryButton>
                </div>
              )
            }
            {
              growSurfState.error && <span>Oops, we couldn&apos;t load your profile. Please try again later or contact <a href="mailto:support@topcoder.com">support</a>.</span>
            }
          </React.Fragment>
        )
      }
    </div>
  );
}

ReferralCode.defaultProps = {
  profile: {},
  growSurf: {},
};

ReferralCode.propTypes = {
  profile: PT.shape(),
  growSurf: PT.shape(),
};

export default ReferralCode;
