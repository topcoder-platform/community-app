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
import IconNavDat from '../../../assets/images/nav/track-data.svg';
import IconNavDesign from '../../../assets/images/nav/track-design.svg';
import IconNavDevelop from '../../../assets/images/nav/track-develop.svg';
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

import './style.scss';

/* NOTE: We use window object only in key / mouse handlers, which are only
 * executed at client side, thus it does not make the code non-isomorphic. */
/* global window */

const MENU = [{
  title: 'Compete',
  items: [{
    icon: <IconNavRocket />,
    link: '/challenges',
    title: 'All Challenges',
  }, {
    icon: <IconNavDesign />,
    link: '/challenges/#&tracks=design&mode=6&name=All%20Challenges',
    title: 'Design Challenges',
  }, {
    icon: <IconNavDevelop />,
    link: '/challenges/#&tracks=develop&mode=6&name=All%20Challenges',
    title: 'Development Challenges',
  }, {
    icon: <IconNavDat />,
    link: '/challenges/#&tracks=datasci&mode=6&name=All%20Challenges',
    title: 'Data Science Challenges',
  }, {
    icon: <IconNavCP />,
    link: config.ARENA_URL,
    title: 'Competitive Programming',
  }],
}, {
  title: 'Learn',
  items: [{
    icon: <IconNavRocket />,
    link: '/getting-started',
    title: 'Getting Started',
  }, {
    icon: <IconNavBookDesign />,
    link: '/community/design',
    title: 'Design',
  }, {
    icon: <IconNavBoolDevelop />,
    link: '/community/development',
    title: 'Development',
  }, {
    icon: <IconNavBookData />,
    link: '/community/data-science/',
    title: 'Data Science',
  }, {
    icon: <IconNavBookCP />,
    link: '/community/competitive-programming',
    title: 'Competitive Programming',
  }],
}, {
  title: 'Community',
  items: [{
    icon: <IconNavMembers />,
    link: '/community/members',
    title: 'Overview',
  }, {
    icon: <IconNavTcoGeneric />,
    link: config.TCO_HOME_URL,
    title: 'TCO',
  }, {
    icon: <IconNavPrograms />,
    link: '/community/member-programs',
    title: 'Programs',
  }, {
    icon: <IconNavForums />,
    link: config.FORUMS_APP_URL,
    title: 'Forums',
  }, {
    icon: <IconNavStatistics />,
    link: '/community/statistics',
    title: 'Statistics',
  }, {
    icon: <IconNavEvents />,
    link: '/community/events',
    title: 'Events',
  }, {
    icon: <IconNavBlog />,
    link: '/blog',
    title: 'Blog',
  }],
}];

export default function TopcoderHeader({
  activeTrigger,
  closeMenu,
  closeMobileMenu,
  closeSearch,
  mobileMenuOpened,
  openedMenu,
  openMenu,
  openMobileMenu,
  openSearch,
  profile,
  searchOpened,
}) {
  const mainMenu = MENU.map(item => (
    <li
      className={openedMenu && openedMenu.title === item.title ? 'opened' : ''}
      key={item.title}
      onMouseEnter={event => openMenu(item, event.target)}
      onMouseLeave={(event) => {
        /* False when mouse cursor leaves from the main menu element to the
         * sub-menu. In that case we keep the sub-menu opened, and responsible
         * for further tracking of the mouse cursor. */
        if (1 + event.clientY < activeTrigger.bottom) closeMenu();
      }}
      styleName="main-menu-item"
    >
      {item.title}
    </li>
  ));

  let subMenu;
  if (openedMenu) {
    subMenu = openedMenu.items.map(item => (
      <li key={item.title} styleName="sub-menu-item">
        <a href={item.link}>
          {item.icon}
          {item.title}
        </a>
      </li>
    ));
  }

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
        link: '/my-dashboard',
        title: 'Dashboard',
      }, {
        icon: <IconNavProfile />,
        link: `/members/${profile.handle}`,
        title: 'My Profile',
      }, {
        icon: <IconNavWallet />,
        link: `${config.COMMUNITY_URL}/PactsMemberServlet?module=PaymentHistory&full_list=false`,
        title: 'Payments',
      }, {
        icon: <IconNavSettings />,
        link: '/settings/profile',
        title: 'Settings',
      }, {
        icon: <IconNavExit />,
        link: '/logout',
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
          if (1 + event.clientY < activeTrigger.bottom) closeMenu();
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
          href={`${config.AUTH_URL}/registration`}
        >Join</a>
        <a
          className="tc-btn-sm tc-btn-default"
          href={config.AUTH_URL}
        >Log In</a>
      </div>
    );
  }

  return (
    <div styleName="header">
      <div styleName="main-desktop-header">
        <a href="/" styleName="logo">
          <LogoTopcoderWithName height={54} width={156} />
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
              if (1 + event.clientY < activeTrigger.bottom) closeSearch();
            }}
            styleName="search-icon"
          ><MagnifyingGlass /></div>
        </div>
      </div>
      <ul
        className={openedMenu ? 'opened' : ''}
        onMouseLeave={(event) => {
          /* False when cursor leaves from the sub-menu to the element that has
           * opened it. In that case we want to keep the menu opened, and the
           * element under the mouse will control the menu state further. */
          if ((event.pageX < activeTrigger.left)
            || (event.pageX > activeTrigger.right)
            || (event.pageY > activeTrigger.bottom)) {
            closeMenu();
          }
        }}
        styleName="sub-menu"
      >{subMenu}</ul>
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
              window.location = `/search/members?q=${
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
