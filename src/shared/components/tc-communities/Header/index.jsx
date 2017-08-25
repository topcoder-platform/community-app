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
import { Link, NavLink } from 'utils/router';
import { getRatingColor } from 'utils/tc';
import Dropdown from 'components/tc-communities/Dropdown';
import { themr } from 'react-css-themr';
import IconSearch from '../../../../assets/images/tc-communities/search.svg';
import IconNavExit from '../../../../assets/images/nav/exit.svg';
import IconNavSettings from '../../../../assets/images/nav/settings.svg';

import style from './style.scss';

function Header(props) {
  const {
    activeTrigger,
    closeMenu,
    communitySelector,
    openMenu,
    openedMenu,
    logos,
    hideSearch,
    chevronOverAvatar,
    additionalLogos,
    menuItems,
    pageId,
    isMobileOpen,
    onMobileToggleClick,
    profile,
    theme,
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

  const renderedLogos = logos.map((item) => {
    const img = _.isString(item) ? item : item.img;
    let logo = <img alt="logo" src={_.isString(item) ? item : item.img} />;
    if (_.isObject(item) && item.url) {
      logo = (
        <Link
          key={img}
          to={item.url}
          className={theme.logo}
        >{logo}</Link>
      );
    } else {
      logo = (
        <span
          key={img}
          className={theme.logo}
        >{logo}</span>
      );
    }
    return logo;
  });

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
      className={theme.userMenu}
      key="login-state"
    >
      <div
        style={{
          color: getRatingColor(_.get(profile, 'maxRating.rating', 0)),
        }}
        className={theme.userMenuHandle}
      >
        {profile.handle}
      </div>
      {
        chevronOverAvatar ?
          <span className={theme.chevronDown} /> :
          <div className={theme.avatar}>
            <Avatar url={profile.photoURL} />
          </div>
      }
    </div>
  ) : (
    <div className={theme.authorize}>
      <button
        onClick={() => {
          const url = encodeURIComponent(window.location.href);
          window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}`;
        }}
        className={theme.btnRegister}
      >Register</button>
      <button
        onClick={() => {
          const url = encodeURIComponent(window.location.href);
          window.location = `${config.URL.AUTH}/member?retUrl=${url}`;
        }}
        className={theme.btnLogin}
      >Login</button>
    </div>
  );

  const currentPage = pageId === 'home' ? '.' : pageId;

  return (
    <div>
      <header className={theme.container}>
        <div className={theme.header}>
          <button
            className={theme.mobileToggle}
            onClick={onMobileToggleClick}
          >
            <span>Toggle navigation</span>
            <i /><i /><i />
          </button>
          <div className={theme.logosWrap}>
            <div className={theme.logos}>
              {renderedLogos}
            </div>

            <div className={theme.challengeDropdown}>
              <Dropdown
                options={communitySelector}
                value={communitySelector[0]}
              />
            </div>

          </div>
          <div className={theme.userWrapMobile}>
            {profile && (
              <div className={theme.avatarMobile}>
                <Avatar url={profile ? profile.photoURL : ''} />
              </div>
            )}
          </div>
        </div>
        <div
          className={isMobileOpen ? theme.menuWrapOpen : theme.menuWrap}
        >
          <ul className={theme.menu}>
            {_.map(menuItems, item => (
              <li
                className={theme.menuItem}
                key={item.url}
              >
                <NavLink
                  activeClassName={theme.menuLinkActive}
                  className={theme.menuLink}
                  isActive={() => currentPage === item.url}
                  to={item.url}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className={theme.userWrap}>
          {loginState}
          { !hideSearch && <div className={theme.search}><IconSearch /></div>}
          <div className={theme.additionalLogos}>
            {_.map(additionalLogos, (logoUrl, index) =>
              (
                <span
                  key={index}
                  className={theme.logo}
                >
                  <img src={logoUrl} alt="Community logo" />
                </span>
              ),
            )}
          </div>
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
  additionalLogos: [],
  hideSearch: false,
  chevronOverAvatar: false,
  isMobileOpen: false,
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
  logos: PT.arrayOf(PT.oneOfType([
    PT.string,
    PT.shape({
      img: PT.string.isRequired,
      url: PT.string,
    }),
  ])),
  additionalLogos: PT.arrayOf(PT.string),
  hideSearch: PT.bool,
  chevronOverAvatar: PT.bool,
  openedMenu: PT.shape({}),
  openMenu: PT.func.isRequired,
  pageId: PT.string.isRequired,
  isMobileOpen: PT.bool,
  onMobileToggleClick: PT.func.isRequired,
  profile: PT.shape({}),
  theme: PT.shape().isRequired,
};

export default themr('CommunityHeader', style)(Header);
