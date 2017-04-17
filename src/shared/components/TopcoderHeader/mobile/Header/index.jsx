import Avatar from 'components/Avatar';
import React from 'react';

import Auth from '../../Auth';
import LogoTopcoder from '../../../../../assets/images/logo_topcoder.svg';
import Menu from '../Menu';
import './style.scss';

export default function Header({
  close,
  mainMenu,
  open,
  opened,
  profile,
  userMenu,
}) {
  return (
    <div styleName="header-wrapper">
      <div
        onClick={open}
        role="button"
        styleName="header"
      >
        {<LogoTopcoder styleName="logo" />}
        <div styleName="menu">Menu</div>
        {profile ? (
          <div styleName="avatar">
            <Avatar url={profile.photoURL} />
          </div>
        ) : <div styleName="auth"><Auth /></div>}
      </div>
      {opened ? (
        <Menu
          close={close}
          mainMenu={mainMenu}
          profile={profile}
          userMenu={userMenu}
        />
      ) : ''}
    </div>
  );
}

