import PT from 'prop-types';
import React from 'react';

import Auth from '../../Auth';
import LogoTopcoder from '../../../../../assets/images/logo_topcoder.svg';
import Search from '../Search';
import SubMenu, { SUB_MENU_SHAPE } from '../SubMenu';
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
          onKeyPress={close}
          role="button"
          styleName="x-cross"
          tabIndex={0}
        >
&times;
        </span>
      </div>
      <Search />
      {
        profile
          ? <UserMenu menu={userMenu} profile={profile} />
          : <Auth column />
      }
      <div styleName="separator" />
      {mainMenu.map(item => <SubMenu key={item.title} subMenu={item} />)}
    </div>
  );
}

Menu.defaultProps = {
  profile: null,
  userMenu: null,
};

Menu.propTypes = {
  close: PT.func.isRequired,
  mainMenu: PT.arrayOf(SUB_MENU_SHAPE).isRequired,
  profile: PT.shape({}),
  userMenu: SUB_MENU_SHAPE,
};
