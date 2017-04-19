import Avatar from 'components/Avatar';
import PT from 'prop-types';
import React from 'react';

import Auth from '../../Auth';
import LogoTopcoder from '../../../../../assets/images/logo_topcoder.svg';
import Menu from '../Menu';
import { SUB_MENU_SHAPE } from '../SubMenu';
import './style.scss';

/* TODO: According to recent discussion in jsx-a11y's Git, this rule should not
 * trigger for static elements when they have a properly set role attribute.
 * Hovewer, it does trigger at the moment. Probably, the most recent changes
 * have not been published to npm yet. As a temporary solution, we disable
 * this rule where necessary. */
/* eslint-disable jsx-a11y/no-static-element-interactions */

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

Header.defaultProps = {
  opened: false,
  profile: null,
  userMenu: null,
};

Header.propTypes = {
  close: PT.func.isRequired,
  mainMenu: PT.arrayOf(SUB_MENU_SHAPE).isRequired,
  open: PT.func.isRequired,
  opened: PT.bool,
  profile: PT.shape({}),
  userMenu: SUB_MENU_SHAPE,
};
