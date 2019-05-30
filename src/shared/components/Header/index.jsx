import _ from 'lodash';
import React, { useState } from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import { TopNav, LoginNav } from 'navigation-component';
import Logo from 'assets/images/tc-logo.svg';

const Header = ({ profile }) => {
  const [activeLevel1Id, setActiveLevel1Id] = useState();

  const handleChangeLevel1Id = (menuId) => {
    setActiveLevel1Id(menuId);
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

  return (
    <div>
      <TopNav
        menu={config.HEADER_MENU}
        rightMenu={(
          <LoginNav
            loggedIn={!_.isEmpty(profile)}
            notificationButtonState="none"
            notifications={[]}
            accountMenu={config.ACCOUNT_MENU}
            switchText={config.ACCOUNT_MENU_SWITCH_TEXT}
            onSwitch={handleSwitchMenu}
            showNotification={false}
            profile={normalizedProfile}
            authURLs={config.HEADER_AUTH_URLS}
          />
        )}
        logo={<Logo />}
        theme={config.HEADER_MENU_THEME}
        currentLevel1Id={activeLevel1Id}
        onChangeLevel1Id={handleChangeLevel1Id}
      />
    </div>
  );
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
