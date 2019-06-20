import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
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

const Header = ({ profile }) => {
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
    normalizedProfile.photoURL = _.has(profile, 'photoURL') ? `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(normalizedProfile.photoURL)}?size=32` : '';
  } else {
    normalizedProfile = null;
  }

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  if (TopNavRef) {
    return (
      <div>
        <TopNavRef
          menu={config.HEADER_MENU}
          rightMenu={(
            <LoginNavRef
              loggedIn={!_.isEmpty(profile)}
              notificationButtonState="none"
              notifications={[]}
              accountMenu={config.ACCOUNT_MENU}
              switchText={config.ACCOUNT_MENU_SWITCH_TEXT}
              onSwitch={handleSwitchMenu}
              onMenuOpen={handleCloseOpenMore}
              showNotification={false}
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
};

Header.propTypes = {
  profile: PT.shape({
    photoURL: PT.string,
  }),
};

export default Header;
