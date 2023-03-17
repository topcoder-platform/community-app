import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import { Modal } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import PT from 'prop-types';
import FormInputRadio from './FormInputRadio';

import style from './styles.scss';

const MyPrimaryRole = ({
  user, tokenV3, updatePrimaryRole,
}) => {
  const [primaryRole, setPrimaryRole] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user.roles.indexOf('Topcoder Talent') !== -1) {
      setPrimaryRole('Topcoder Talent');
    } else {
      setPrimaryRole('Topcoder Customer');
    }
  }, [user.roles]);

  const handleRoleChange = (value) => {
    setPrimaryRole(value);
    updatePrimaryRole(value, tokenV3);
    setShowModal(true);
  };

  const AUTH_URL = config.URL.AUTH;
  const handleSignoutClick = () => {
    window.location.href = `${AUTH_URL}?logout=true&retUrl=${encodeURIComponent(config.URL.COMMUNITY_APP)}`;
  };

  return (
    <React.Fragment>
      {showModal && (
      <Modal theme={style}>
        <div styleName="nagModal">

          <div styleName="header">
            <div styleName="title">
              <span>CONFIRMED</span>
            </div>
          </div>

          <div styleName="description">
            <span>
              You have successfully changed your account role. Please sign out of your account
              and login to complete this update.
            </span>
          </div>

          <div styleName="actionButtons">
            <button type="button" styleName="primaryBtn" onClick={handleSignoutClick}>
              Sign Out
            </button>
          </div>

        </div>
      </Modal>
      )}
      <div styleName="form-container">
        <Collapse>
          <h2 styleName="form-title">Account Role</h2>
          <div styleName="form-content">
            <div styleName="form-label">
              Access to Topcoder tools and applications are based on your account
              role. If you change this setting, you will be required to sign out
              of your account and login.
            </div>
            <div styleName="form-body">
              <form styleName="account-form" noValidate autoComplete="off">
                <FormInputRadio
                  text="Topcoder Talent"
                  value="Topcoder Talent"
                  selectedValue={primaryRole}
                  onSelectionChange={handleRoleChange}
                />
                <FormInputRadio
                  text="Topcoder Customer"
                  value="Topcoder Customer"
                  selectedValue={primaryRole}
                  onSelectionChange={handleRoleChange}
                />
              </form>
            </div>
          </div>
        </Collapse>
      </div>
    </React.Fragment>
  );
};

MyPrimaryRole.propTypes = {
  user: PT.shape().isRequired,
  tokenV3: PT.string.isRequired,
  updatePrimaryRole: PT.func.isRequired,
};


export default withRouter(MyPrimaryRole);
