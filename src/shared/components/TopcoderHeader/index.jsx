import _ from 'lodash';
import Avatar from 'components/Avatar';
import config from 'utils/config';
import { getRatingColor } from 'utils/tc';
import PT from 'prop-types';
import React from 'react';

import IconNavBlog from '../../../assets/images/nav/blog.svg';
import IconNavBookCP from '../../../assets/images/nav/book-cp.svg';
import IconNavBookData from '../../../assets/images/nav/book-data.svg';
import IconNavBookDesign from '../../../assets/images/nav/book-design.svg';
import IconNavBoolDevelop from '../../../assets/images/nav/book-develop.svg';
import IconNavCP from '../../../assets/images/nav/track-cp.svg';
import IconNavEvents from '../../../assets/images/nav/events.svg';
import IconNavForums from '../../../assets/images/nav/forums.svg';
import IconNavMembers from '../../../assets/images/nav/members.svg';
import IconNavPrograms from '../../../assets/images/nav/programs.svg';
import IconNavRocket from '../../../assets/images/nav/rocket.svg';
import IconNavStatistics from '../../../assets/images/nav/statistics.svg';
import IconNavTcoGeneric from '../../../assets/images/nav/tco-generic.svg';

/* For user sub-menu. */
import IconNavDashboard from '../../../assets/images/nav/dashboard.svg';
import IconNavExit from '../../../assets/images/nav/exit.svg';
import IconNavProfile from '../../../assets/images/nav/profile.svg';
import IconNavSettings from '../../../assets/images/nav/settings.svg';
import IconNavWallet from '../../../assets/images/nav/wallet.svg';

import LogoTopcoderWithName from '../../../assets/images/logo_topcoder_with_name.svg';

import MagnifyingGlass from '../../../assets/images/magnifying_glass.svg';

import MobileHeader from './mobile/Header';
import { SUB_MENU_SHAPE } from './mobile/SubMenu';

import DesktopSubMenu from './desktop/SubMenu';

import './style.scss';

/* NOTE: We use window object only in key / mouse handlers, which are only
 * executed at client side, thus it does not make the code non-isomorphic. */
/* global window */

const BASE_URL = config.URL.BASE;

const MENU = [{
  title: 'Compete',
  items: [{
    icon: <IconNavRocket />,
    link: `${BASE_URL}/challenges`,
    title: 'All Challenges',
  }, {
    icon: <IconNavCP />,
    link: config.URL.ARENA,
    title: 'Competitive Programming',
  }],
}, {
  title: 'Learn',
  items: [{
    icon: <IconNavRocket />,
    link: `${BASE_URL}/getting-started`,
    title: 'Getting Started',
  }, {
    icon: <IconNavBookDesign />,
    link: `${BASE_URL}/community/design`,
    title: 'Design',
  }, {
    icon: <IconNavBoolDevelop />,
    link: `${BASE_URL}/community/development`,
    title: 'Development',
  }, {
    icon: <IconNavBookData />,
    link: `${BASE_URL}/community/data-science/`,
    title: 'Data Science',
  }, {
    icon: <IconNavBookCP />,
    link: `${BASE_URL}/community/competitive-programming`,
    title: 'Competitive Programming',
  }],
}, {
  title: 'Community',
  items: [{
    icon: <IconNavMembers />,
    link: `${BASE_URL}/community/members`,
    title: 'Overview',
  }, {
    icon: <IconNavTcoGeneric />,
    link: config.URL.TCO,
    title: 'TCO',
  }, {
    icon: <IconNavPrograms />,
    link: `${BASE_URL}/community/member-programs`,
    title: 'Programs',
  }, {
    icon: <IconNavForums />,
    link: config.URL.FORUMS,
    title: 'Forums',
  }, {
    icon: <IconNavStatistics />,
    link: `${BASE_URL}/community/statistics`,
    title: 'Statistics',
  }, {
    icon: <IconNavEvents />,
    link: `${BASE_URL}/community/events`,
    title: 'Events',
  }, {
    icon: <IconNavBlog />,
    link: `${BASE_URL}/blog`,
    title: 'Blog',
  }],
}];

export default function TopcoderHeader({
  activeTrigger,
  closeMenu,
  closeMobileMenu,
  closeSearch,
  currentNav,
  mobileMenuOpened,
  openedMenu,
  openMenu,
  openMobileMenu,
  openSearch,
  profile,
  searchOpened,
}) {
  const mainMenu = MENU.map((item) => {
    let styleName = 'main-menu-item';
    if (openedMenu && openedMenu.title === item.title) styleName += ' opened';
    if (item.title === currentNav.menuTitle) styleName += ' current';
    return (
      <li
        key={item.title}
        onMouseEnter={event => openMenu(item, event.target)}
        onMouseLeave={(event) => {
          /* False when mouse cursor leaves from the main menu element to the
          * sub-menu. In that case we keep the sub-menu opened, and responsible
          * for further tracking of the mouse cursor. */
          if (1 + event.pageY < activeTrigger.bottom) closeMenu();
        }}
        styleName={styleName}
      >{item.title}</li>
    );
  });

  let authButtons;
  let userAvatar;
  let userMenuHandle;
  let userSubMenu;

  if (profile) {
    userAvatar = (
      <div styleName="avatar">
        <Avatar url={profile.photoURL} />
      </div>
    );

    userSubMenu = {
      title: 'User',
      items: [{
        icon: <IconNavDashboard />,
        link: `${BASE_URL}/my-dashboard`,
        title: 'Dashboard',
      }, {
        icon: <IconNavProfile />,
        link: `${BASE_URL}/members/${profile.handle}`,
        title: 'My Profile',
      }, {
        icon: <IconNavWallet />,
        link: `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=false`,
        title: 'Payments',
      }, {
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
    userMenuHandle = (
      <div
        onMouseEnter={event => openMenu(userSubMenu, event.target)}
        onMouseLeave={(event) => {
          /* False when mouse cursor leaves from the main menu element to the
           * sub-menu. In that case we keep the sub-menu opened, and responsible
           * for further tracking of the mouse cursor. */
          if (1 + event.pageY < activeTrigger.bottom) closeMenu();
        }}
        styleName="user-menu"
      >
        <div
          style={{
            color: getRatingColor(_.get(profile, 'maxRating.rating', 0)),
          }}
          styleName="user-menu-handle"
        >
          {profile.handle}
        </div>
        {userAvatar}
      </div>
    );
  } else {
    /* TODO: These registration and login links should be appended with
      ?next=... specifying the url encoded URL, where the user should be
      redirected after successful login / registration. Can't just append
      them, though, as it will break the server-side rendering (during
      server side rendering we don't know yet the correct url for the
      redirection). Most probably, we should use here buttons instead
      of hyperlinks, and compose the target url once the user clicks
      them. */
    authButtons = (
      <div styleName="auth-buttons">
        <a
          className="tc-btn-sm tc-btn-primary"
          href={`${config.URL.AUTH}/registration`}
        >Join</a>
        <a
          className="tc-btn-sm tc-btn-default"
          href={config.URL.AUTH}
        >Log In</a>
      </div>
    );
  }

  return (
    <div styleName="header">
      <div styleName="main-desktop-header">
        <a href={BASE_URL} styleName="logo">
          <LogoTopcoderWithName height={53} width={135} />
        </a>
        <ul styleName="main-menu">
          {mainMenu}
        </ul>
        <div styleName="right-menu">
          {userMenuHandle}
          {authButtons}
          <div
            className={searchOpened ? 'opened' : ''}
            onMouseEnter={event => openSearch(event.target)}
            onMouseLeave={(event) => {
              if (1 + event.pageY < activeTrigger.bottom) closeSearch();
            }}
            styleName="search-icon"
          ><MagnifyingGlass /></div>
        </div>
      </div>
      <DesktopSubMenu
        closeMenu={closeMenu}
        currentSubMenuTitle={currentNav.subMenuTitle}
        menu={openedMenu}
        trigger={activeTrigger}
      />
      <div
        className={searchOpened ? 'opened' : ''}
        onMouseLeave={(event) => {
          /* False when cursor leaves from the sub-menu to the element that has
           * opened it. In that case we want to keep the menu opened, and the
           * element under the mouse will control the menu state further. */
          if ((event.pageX < activeTrigger.left)
            || (event.pageX > activeTrigger.right)
            || (event.pageY > activeTrigger.bottom)) {
            closeSearch();
          }
        }}
        styleName="search-field"
      >
        <input
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              window.location = `${BASE_URL}/search/members?q=${
                encodeURIComponent(event.target.value)
              }`;
            }
          }}
          placeholder="Find members by username or skill"
        />
      </div>
      <MobileHeader
        close={closeMobileMenu}
        mainMenu={MENU}
        open={openMobileMenu}
        opened={mobileMenuOpened}
        profile={profile}
        userMenu={userSubMenu}
      />
    </div>
  );
}

TopcoderHeader.defaultProps = {
  activeTrigger: null,
  mobileMenuOpened: false,
  openedMenu: null,
  profile: null,
  searchOpened: false,
};

TopcoderHeader.propTypes = {
  activeTrigger: PT.shape({
    bottom: PT.number.isRequired,
    left: PT.number.isRequired,
    right: PT.number.isRequired,
    top: PT.number.isRequired,
  }),
  closeMenu: PT.func.isRequired,
  closeMobileMenu: PT.func.isRequired,
  closeSearch: PT.func.isRequired,
  currentNav: PT.shape({
    menuTitle: PT.string,
    subMenuTitle: PT.string,
  }).isRequired,
  mobileMenuOpened: PT.bool,
  openedMenu: SUB_MENU_SHAPE,
  openMenu: PT.func.isRequired,
  openMobileMenu: PT.func.isRequired,
  openSearch: PT.func.isRequired,
  profile: PT.shape({
    photoURL: PT.string,
  }),
  searchOpened: PT.bool,
};
