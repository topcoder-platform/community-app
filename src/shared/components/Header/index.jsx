import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import Logo from 'assets/images/TC-logo-new.svg';
import { tracking } from '../../actions';

import './style.scss';

let TopNavRef;
let LoginNavRef;

try {
  // eslint-disable-next-line global-require
  const { TopNav, LoginNav } = require('navigation-component');
  TopNavRef = TopNav;
  LoginNavRef = LoginNav;
} catch (e) {
  // window is undefined
}

const Header = ({
  profile, auth, notifications, loadNotifications, markNotificationAsRead,
  markAllNotificationAsRead, markAllNotificationAsSeen, dismissChallengeNotifications, headerMenu,
}) => {
  const [activeLevel1Id, setActiveLevel1Id] = useState();
  const [path, setPath] = useState();
  const [openMore, setOpenMore] = useState(true);

  const handleChangeLevel1Id = (menuId) => {
    setActiveLevel1Id(menuId);
  };

  const handleCloseOpenMore = () => {
    setOpenMore(false);
  };

  const handleChangeOpenMore = (changedOpenMore) => {
    setOpenMore(changedOpenMore);
  };

  const handleSwitchMenu = () => {
    setActiveLevel1Id(config.HEADER_MENU[0].id);
  };

  let normalizedProfile = profile && _.clone(profile);
  if (profile) {
    normalizedProfile.photoURL = (_.has(profile, 'photoURL') && profile.photoURL !== null)
      ? `${config.CDN.PUBLIC}/avatar/${encodeURIComponent(profile.photoURL)}?size=32` : '';
  } else {
    normalizedProfile = null;
  }

  useEffect(() => {
    setPath(window.location.pathname + window.location.search);
  }, []);

  /*
  * Load Notifications and Init Google Analytics
  */
  useEffect(() => {
    if (auth) {
      if (auth.tokenV3) {
        loadNotifications(auth.tokenV3);
      }
      if (auth.user) {
        tracking.init(auth.user.handle);
      }
    }
  }, []);

  if (TopNavRef) {
    console.log('TopNavRef');
    console.log(JSON.stringify(profile, 4, null));
    
    return (
      <div styleName="nav-header-wrapper">
        <TopNavRef
          menu={headerMenu || config.HEADER_MENU}
          rightMenu={(
            <LoginNavRef
              loggedIn={!_.isEmpty(profile)}
              notificationButtonState="new"
              notifications={notifications || []}
              loadNotifications={loadNotifications}
              markNotificationAsRead={markNotificationAsRead}
              markAllNotificationAsRead={markAllNotificationAsRead}
              markAllNotificationAsSeen={markAllNotificationAsSeen}
              dismissChallengeNotifications={dismissChallengeNotifications}
              accountMenu={config.ACCOUNT_MENU}
              switchText={config.ACCOUNT_MENU_SWITCH_TEXT}
              onSwitch={handleSwitchMenu}
              onMenuOpen={handleCloseOpenMore}
              showNotification
              auth={auth}
              profile={normalizedProfile}
              authURLs={config.HEADER_AUTH_URLS}
              tracking={tracking}
            />
          )}
          logo={<Logo />}
          theme={config.HEADER_MENU_THEME}
          currentLevel1Id={activeLevel1Id}
          onChangeLevel1Id={handleChangeLevel1Id}
          path={path}
          openMore={openMore}
          setOpenMore={handleChangeOpenMore}
          loggedIn={!_.isEmpty(profile)}
          profileHandle={profile ? profile.handle : ''}
          isWipro={(profile && profile.email && profile.email.includes('@wipro.com'))}
          tracking={tracking}
        />
      </div>
    );
  }

  return (<div />);
};

Header.defaultProps = {
  profile: null,
  auth: null,
  headerMenu: null,
};

Header.propTypes = {
  profile: PT.shape({
    photoURL: PT.string,
    handle: PT.string,
    email: PT.string,
  }),
  auth: PT.shape(),
  notifications: PT.arrayOf(PT.object).isRequired,
  loadNotifications: PT.func.isRequired,
  markNotificationAsRead: PT.func.isRequired,
  markAllNotificationAsRead: PT.func.isRequired,
  markAllNotificationAsSeen: PT.func.isRequired,
  dismissChallengeNotifications: PT.func.isRequired,
  headerMenu: PT.arrayOf(PT.object),
};

export default Header;
