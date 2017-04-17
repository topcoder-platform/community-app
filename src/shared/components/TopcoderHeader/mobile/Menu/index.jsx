import React from 'react';

import Auth from '../../Auth';
import LogoTopcoder from '../../../../../assets/images/logo_topcoder.svg';
import Search from '../Search';
import SubMenu from '../SubMenu';
import UserMenu from '../UserMenu';

import './style.scss';

export default function Menu({
  close,
  mainMenu,
  profile,
  userMenu,
}) {
  return (
    <div styleName="menu">
      <div styleName="title">
        <LogoTopcoder styleName="tc-logo" />
        [ topcoder ]
        <span
          onClick={close}
          role="button"
          styleName="x-cross"
        >&times;</span>
      </div>
      <Search />
      {
        profile
        ? <UserMenu menu={userMenu} profile={profile} />
        : <Auth column />
      }
      <div styleName="separator" />
      {mainMenu.map(item => <SubMenu subMenu={item} />)}
    </div>
  );
}