/**
 * The Header component for communities
 *
 * Along with css modules it has global css classes
 * so the whole design can be overridden by an additional css file
 */

/* global window */

import _ from 'lodash';
import config from 'utils/config';
import DesktopSubMenu from 'components/TopcoderHeader/desktop/SubMenu';
import React from 'react';
import PT from 'prop-types';
import Avatar from 'components/Avatar';
import { Link, NavLink } from 'react-router-dom';
import { getRatingColor } from 'utils/tc';
import Dropdown from 'components/tc-communities/Dropdown';
import IconSearch from '../../../../assets/images/tc-communities/search.svg';
import IconNavExit from '../../../../assets/images/nav/exit.svg';
import IconNavSettings from '../../../../assets/images/nav/settings.svg';

import './style.scss';

export default function Header(props) {
  const {
    activeTrigger,
    closeMenu,
    communitySelector,
    openMenu,
    openedMenu,
    logos,
    menuItems,
    pageId,
    cssUrl,
    isMobileOpen,
    onMobileToggleClick,
    profile,
  } = props;

  const BASE_URL = config.URL.BASE;

  let userSubMenu;
  if (profile) {
    userSubMenu = {
      title: 'User',
      items: [{
        icon: <IconNavSettings />,
        link: `${BASE_URL}/settings/profile`,
        title: 'Settings',
      }, {
        icon: <IconNavExit />,
        // TODO: In addition to hitting ${BASE_URL}/logout, which logs out
        // from the accounts-app, we should wipe out auth cookies!
        link: `${BASE_URL}/logout`,
        title: 'Log Out',
      }],
    };
  }

  const loginState = profile ? (
    <div
      onMouseEnter={event => openMenu(userSubMenu, event.target)}
      onMouseLeave={(event) => {
        /* False when mouse cursor leaves from the main menu element to the
          * sub-menu. In that case we keep the sub-menu opened, and responsible
          * for further tracking of the mouse cursor. */
        if (1 + event.pageY < activeTrigger.bottom) closeMenu();
      }}
      /* Login state component. */
      styleName="user-menu"
      key="login-state"
    >
      <div
        style={{
          color: getRatingColor(_.get(profile, 'maxRating.rating', 0)),
        }}
        styleName="user-menu-handle"
      >
        {profile.handle}
      </div>
      <div styleName="avatar">
        <Avatar url={profile.photoURL} />
      </div>
    </div>
  ) : (
    <div styleName="authorize">
      <button
        onClick={() => {
          const url = encodeURIComponent(window.location.href);
          window.location = `${config.URL.AUTH}/registration?retUrl=${url}`;
        }}
        styleName="btnRegister"
      >Register</button>
      <button
        onClick={() => {
          const url = encodeURIComponent(window.location.href);
          window.location = `${config.URL.AUTH}?retUrl=${url}`;
        }}
        styleName="btnLogin"
      >Login</button>
    </div>
  );

  const currentPage = pageId === 'home' ? '.' : pageId;

  return (
    <div>
      {cssUrl && <link rel="stylesheet" type="text/css" href={cssUrl} />}
      <header styleName="container" className="tc-communities__header__container">
        <div styleName="header" className="tc-communities__header__header">
          <button
            styleName="mobile-toggle"
            className="tc-communities__header__mobile-toggle"
            onClick={onMobileToggleClick}
          >
            <span>Toggle navigation</span>
            <i /><i /><i />
          </button>
          <div styleName="logos-wrap">
            <div styleName="logos" className="tc-communities__header__logos">
              {_.map(logos, (logoUrl, index) =>
                (menuItems.length ? (
                  <Link
                    key={index}
                    to={menuItems[0].url}
                    styleName="logo"
                    className="tc-communities__header__logo"
                  >
                    <img src={logoUrl} alt="Community logo" />
                  </Link>
                ) : (
                  <span
                    key={index}
                    styleName="logo"
                    className="tc-communities__header__logo"
                  >
                    <img src={logoUrl} alt="Community logo" />
                  </span>
                )),
              )}
            </div>

            <div styleName="challenge-dropdown">
              <Dropdown
                options={communitySelector}
                value={communitySelector[0]}
              />
            </div>

          </div>
          <div styleName="user-wrap-mobile">
            {profile && (
              <div styleName="avatar-mobile">
                <Avatar url={profile ? profile.photoURL : ''} />
              </div>
            )}
          </div>
        </div>
        <div
          styleName={`menu-wrap${isMobileOpen ? ' open' : ''}`}
          className={`tc-communities__header__menu-wrap${isMobileOpen ? ' tc-communities__header__open' : ''}`}
        >
          <ul styleName="menu" className="tc-communities__header__menu">
            {_.map(menuItems, item => (
              <li
                styleName="menu-item"
                className="tc-communities__header__menu-item"
                key={item.url}
              >
                <NavLink
                  styleName="menu-link"
                  className="tc-communities__header__menu-link"
                  activeClassName="menu-link_active tc-communities__header__menu-link_active"
                  isActive={() => currentPage === item.url}
                  to={item.url}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div styleName="user-wrap">
          {loginState}
          <div styleName="search"><IconSearch /></div>
        </div>
      </header>
      <DesktopSubMenu
        closeMenu={closeMenu}
        menu={openedMenu}
        trigger={activeTrigger}
      />
    </div>
  );
}

Header.defaultProps = {
  activeTrigger: null,
  menuItems: [],
  openedMenu: null,
  logos: [],
  isMobileOpen: false,
  cssUrl: null,
  profile: null,
};

Header.propTypes = {
  activeTrigger: PT.shape({}),
  closeMenu: PT.func.isRequired,
  communitySelector: PT.arrayOf(PT.shape()).isRequired,
  menuItems: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    url: PT.string.isRequired,
  })),
  logos: PT.arrayOf(PT.string),
  openedMenu: PT.shape({}),
  openMenu: PT.func.isRequired,
  pageId: PT.string.isRequired,
  isMobileOpen: PT.bool,
  cssUrl: PT.string,
  onMobileToggleClick: PT.func.isRequired,
  profile: PT.shape({}),
};
