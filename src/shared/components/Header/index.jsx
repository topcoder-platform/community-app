import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import { tracking } from 'topcoder-react-lib';
import Logo from 'assets/images/tc-logo.svg';

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
  markAllNotificationAsRead, markAllNotificationAsSeen, dismissChallengeNotifications,
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
    setPath(window.location.pathname);
  }, []);

  /*
   * Reload notificaitons if token was changed
   * This prevent to use expired token in API call
   */
  if (auth) {
    useEffect(() => {
      loadNotifications(auth.tokenV3);
    }, [auth.tokenV3]);
  }

  /*
   * Init Google Analytics
  */
  if (auth && auth.user) {
    useEffect(() => {
      tracking.init(auth.user.handle);
    }, [auth.user.handle]);
  }

  if (TopNavRef) {
    return (
      <div>
        <TopNavRef
          menu={config.HEADER_MENU}
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
        />
      </div>
    );
  }

  return (<div />);
};

Header.defaultProps = {
  profile: null,
  auth: null,
};

Header.propTypes = {
  profile: PT.shape({
    photoURL: PT.string,
    handle: PT.string,
  }),
  auth: PT.shape(),
  notifications: PT.arrayOf(PT.object).isRequired,
  loadNotifications: PT.func.isRequired,
  markNotificationAsRead: PT.func.isRequired,
  markAllNotificationAsRead: PT.func.isRequired,
  markAllNotificationAsSeen: PT.func.isRequired,
  dismissChallengeNotifications: PT.func.isRequired,
};

export default Header;
