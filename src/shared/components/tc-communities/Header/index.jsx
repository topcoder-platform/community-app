/**
 * The Header component for communities
 *
 * Along with css modules it has global css classes
 * so the whole design can be overridden by an additional css file
 */

/* global window */

import _ from 'lodash';
import DesktopSubMenu from 'components/TopcoderHeader/desktop/SubMenu';
import React from 'react';
import PT from 'prop-types';
import { Avatar, PrimaryButton, Button } from 'topcoder-react-ui-kit';
import {
  config,
  Link,
  NavLink,
  isomorphy,
} from 'topcoder-react-utils';
import { getRatingColor } from 'utils/tc';
import Dropdown from 'components/tc-communities/Dropdown';
import { themr } from 'react-css-super-themr';
import Menu from 'components/Contentful/Menu';

import IconSearch from '../../../../assets/images/tc-communities/search.svg';
import IconNavExit from '../../../../assets/images/nav/exit.svg';
import IconNavProfile from '../../../../assets/images/nav/profile.svg';
import IconNavWallet from '../../../../assets/images/nav/wallet.svg';
import IconNavSettings from '../../../../assets/images/nav/settings.svg';

import style from './style.scss';

function Header(props) {
  const {
    activeTrigger,
    baseUrl,
    closeMenu,
    communityId,
    communitySelector,
    groupIds,
    hideJoinNow,
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
    meta,
  } = props;

  let {
    logoutRedirect,
  } = props;

  const BASE_URL = config.URL.BASE;
  const AUTH_URL = config.URL.AUTH;
  const normalizedProfile = profile && _.clone(profile);
  const isZurichCompetitor = (profile && profile.groups) ? _.intersection(
    _.map(profile.groups, 'oldId'),
    meta.competitorsGroupIds,
  ) : [];

  if (_.isEmpty(logoutRedirect) && isomorphy.isClientSide()) {
    logoutRedirect = window.location.href;
  }

  let userSubMenu;

  if (profile) {
    console.log('PROFILE');
    console.log(JSON.stringify(profile, null, 4));
    let profileLink = `${meta ? _.replace(BASE_URL, 'www', meta.subdomains[0]) : BASE_URL}/members/${normalizedProfile.handle}`;
    let paymentsLink = `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=false`;

    // Handle Wipro specific links (PS-257)
    if (profile && profile.email && profile.email.includes('@wipro.com')) {
      profileLink = 'https://topgear-app.wipro.com/user-details';
      paymentsLink = 'https://topgear-app.wipro.com/my_payments';
    }

    userSubMenu = {
      title: 'User',
      items: [{
        enforceA: true,
        icon: <IconNavProfile />,
        link: profileLink,
        title: 'My Profile',
      }, {
        openNewTab: true,
        icon: <IconNavWallet />,
        link: paymentsLink,
        title: 'Payments',
      }, {
        icon: <IconNavSettings />,
        link: `${meta ? _.replace(BASE_URL, 'www', meta.subdomains[0]) : BASE_URL}/settings/account`,
        title: 'Settings',
      }, {
        icon: <IconNavExit />,
        // TODO: In addition to hitting ${AUTH_URL}/logout, which logs out
        // from the accounts-app, we should wipe out auth cookies!
        link: `${AUTH_URL}?logout=true&retUrl=${encodeURIComponent(logoutRedirect)}`,
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
        >
          {logo}
        </Link>
      );
    } else {
      logo = (
        <span
          key={img}
          className={theme.logo}
        >
          {logo}
        </span>
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
        chevronOverAvatar
          ? <span className={theme.chevronDown} />
          : (
            <div className={theme.avatar}>
              <Avatar url={profile.photoURL} />
            </div>
          )
      }
    </div>
  ) : (
    <div className={theme.authorize}>
      {
        communityId === 'zurich' ? (
          <PrimaryButton
            onClick={() => {
              const returnUrl = encodeURIComponent(window.location.href);
              window.location = `${config.URL.AUTH}/sso-login/?retUrl=${returnUrl}&utm_source=${communityId}`;
            }}
            size="sm"
            title="Lorem Ipsum"
          >
            Log In
            <div className={theme.loginHint}>Lorem ipsum bla bla</div>
          </PrimaryButton>
        ) : (
          <Button
            onClick={() => {
              const url = encodeURIComponent(`${window.location.href}?join=${groupIds[0]}`);
              window.location = `${config.URL.AUTH}/member?retUrl=${url}&utm_source=${communityId}`;
            }}
            size="sm"
          >
            Log In
          </Button>
        )
      }
      { hideJoinNow ? null : (
        <PrimaryButton
          onClick={() => {
            let url = encodeURIComponent(`${window.location.href}?join=${groupIds[0]}`);
            url = encodeURIComponent(`${config.URL.AUTH}/member?retUrl=${url}&utm_source=${communityId}`);
            url = encodeURIComponent(url);
            window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}&utm_source=${communityId}`;
          }}
          size="sm"
        >
          Join Topcoder
        </PrimaryButton>
      )}
    </div>
  );

  const currentPage = pageId === 'home' ? '' : pageId;
  const menuIterator = (item) => {
    if (communityId === 'zurich' && item.url === '/challenges?communityId=zurich' && !isZurichCompetitor.length) {
      return null;
    }
    return (
      <li
        className={theme.menuItem}
        key={item.url}
      >
        <NavLink
          activeClassName={theme.menuLinkActive}
          className={theme.menuLink}
          openNewTab={item.openNewTab}
          isActive={() => `/${currentPage}` === item.url}
          to={item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`}
        >
          {item.title}
        </NavLink>
      </li>
    );
  };

  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div>
      <header className={theme.container}>
        <div className={theme.header}>
          <button
            className={theme.mobileToggle}
            onClick={onMobileToggleClick}
            type="button"
          >
            <span>
              Toggle navigation
            </span>
            <i />
            <i />
            <i />
          </button>
          <div className={theme.logosWrap}>
            <div className={theme.logos}>
              {renderedLogos}
            </div>
            {
              !_.startsWith(communityId, 'tco') ? (
                <div className={theme.challengeDropdown}>
                  <Dropdown
                    options={communitySelector}
                    value="-1"
                  />
                </div>
              ) : null
            }
          </div>
          <div className={theme.userWrapMobile}>
            {profile && (
              <div className={theme.avatarMobile}>
                <Avatar url={profile ? profile.photoURL : ''} />
              </div>
            )}
          </div>
        </div>
        <div className={isMobileOpen ? theme.menuWrapOpen : theme.menuWrap}>
          {
            menuItems[0] && menuItems[0].navigationMenu ? (
              <Menu
                id={menuItems[0].navigationMenu}
                baseUrl={baseUrl}
                spaceName={menuItems[0].spaceName}
                environment={menuItems[0].environment}
              />
            ) : (
              <ul className={theme.menu}>
                {_.map(menuItems, menuIterator)}
                {
                  profile && communityId === 'zurich' ? (
                    <li
                      className={theme.extraMenuItem}
                      key="myProjects"
                    >
                      <NavLink
                        to={`https://connect.topcoder${isDev ? '-dev' : ''}.com/`}
                        className={theme.menuLink}
                      >
                        My Projects
                      </NavLink>
                    </li>
                  ) : null
                }
              </ul>
            )
          }
        </div>
        <div className={theme.userWrap}>
          {loginState}
          {
            profile && communityId === 'zurich' ? (
              <NavLink
                to={`https://connect.topcoder${isDev ? '-dev' : ''}.com/`}
                className={theme.extraUserLink}
              >
                My Projects
              </NavLink>
            ) : null
          }
          { !hideSearch && (
          <div className={theme.search}>
            <IconSearch />
          </div>
          )}
          <div className={theme.additionalLogos}>
            {_.map(additionalLogos, (logoUrl, index) => (
              <span
                key={index}
                className={theme.logo}
              >
                <img src={logoUrl} alt="Community logo" />
              </span>
            ))}
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
  baseUrl: '',
  groupIds: [''],
  hideJoinNow: false,
  menuItems: [],
  openedMenu: null,
  logos: [],
  additionalLogos: [],
  hideSearch: false,
  chevronOverAvatar: false,
  profile: null,
  isMobileOpen: false,
  logoutRedirect: null,
};

Header.propTypes = {
  activeTrigger: PT.shape({
    bottom: PT.string,
  }),
  baseUrl: PT.string,
  closeMenu: PT.func.isRequired,
  communityId: PT.string.isRequired,
  communitySelector: PT.arrayOf(PT.shape()).isRequired,
  groupIds: PT.arrayOf(PT.string),
  isMobileOpen: PT.bool,

  menuItems: PT.arrayOf(PT.shape({
    title: PT.string,
    url: PT.string,
    navigationMenu: PT.string,
    spaceName: PT.string,
    environment: PT.string,
  })),
  logos: PT.arrayOf(PT.oneOfType([
    PT.string,
    PT.shape({
      img: PT.string.isRequired,
      url: PT.string,
    }),
  ])),
  additionalLogos: PT.arrayOf(PT.string),
  hideJoinNow: PT.bool,
  hideSearch: PT.bool,
  chevronOverAvatar: PT.bool,
  openedMenu: PT.shape({}),
  openMenu: PT.func.isRequired,
  pageId: PT.string.isRequired,
  onMobileToggleClick: PT.func.isRequired,
  profile: PT.shape({
    photoURL: PT.string,
    groups: PT.any,
    handle: PT.string,
    email: PT.string,
  }),
  theme: PT.shape().isRequired,
  logoutRedirect: PT.string,
  meta: PT.shape().isRequired,
};

export default themr('CommunityHeader', style)(Header);
