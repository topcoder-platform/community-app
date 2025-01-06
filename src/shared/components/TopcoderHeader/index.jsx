import _ from 'lodash';
import { Avatar } from 'topcoder-react-ui-kit';
import { getRatingColor } from 'utils/tc';
import PT from 'prop-types';
import React from 'react';

import { config, Link } from 'topcoder-react-utils';

import Auth from './Auth';
import IconNavBlog from '../../../assets/images/nav/blog.svg';
import IconNavBookCP from '../../../assets/images/nav/book-cp.svg';
import IconNavBookData from '../../../assets/images/nav/book-data.svg';
import IconNavBookDesign from '../../../assets/images/nav/book-design.svg';
import IconNavBoolDevelop from '../../../assets/images/nav/book-develop.svg';
import IconNavCP from '../../../assets/images/nav/track-cp.svg';
import IconNavEvents from '../../../assets/images/nav/events.svg';
import IconNavForums from '../../../assets/images/nav/forums.svg';
import IconNavPrograms from '../../../assets/images/nav/programs.svg';
import IconNavRocket from '../../../assets/images/nav/rocket.svg';
import IconNavStatistics from '../../../assets/images/nav/statistics.svg';
import IconNavTcoGeneric from '../../../assets/images/nav/tco-generic.svg';
import IconNavThrive from '../../../assets/images/nav/thrive.svg';

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
/* global window, document */

const BASE_URL = config.URL.BASE;
const VALID_BASE_URLS = ['https://www.topcoder-dev.com', 'https://www.topcoder.com'];

const MENU = [{
  title: 'Compete',
  items: [{
    icon: <IconNavRocket />,
    link: '/challenges',
    title: 'All Challenges',
  }, {
    icon: <IconNavCP />,
    link: config.URL.ARENA,
    title: 'Competitive Programming',
  }],
}, {
  title: 'Tracks',
  url: `${BASE_URL}/community/learn`,
  items: [
  /* {
    enforceA: true,
    icon: <IconNavRocket />,
    link: `${BASE_URL}/getting-started`,
    title: 'Getting Started',
  }, */
    {
      enforceA: true,
      icon: <IconNavBookCP />,
      link: `${BASE_URL}/community/competitive-programming`,
      title: 'Competitive Programming',
    }, {
      enforceA: true,
      icon: <IconNavBookData />,
      link: `${BASE_URL}/community/data-science/`,
      title: 'Data Science',
    }, {
      enforceA: true,
      icon: <IconNavBookDesign />,
      link: `${BASE_URL}/community/design`,
      title: 'Design',
    }, {
      enforceA: true,
      icon: <IconNavBoolDevelop />,
      link: `${BASE_URL}/community/development`,
      title: 'Development',
    }, {
      enforceA: true,
      icon: <IconNavBoolDevelop />,
      link: `${BASE_URL}/community/qa`,
      title: 'QA',
    }],
}, {
  title: 'Community',
  items: [{
    enforceA: true,
    icon: <IconNavTcoGeneric />,
    link: config.URL.TCO,
    title: 'TCO',
  }, {
    enforceA: true,
    icon: <IconNavPrograms />,
    link: `${BASE_URL}/community/member-programs`,
    title: 'Programs',
  }, {
    icon: <IconNavForums />,
    link: config.URL.FORUMS,
    title: 'Forums',
  }, {
    enforceA: true,
    icon: <IconNavStatistics />,
    link: `${BASE_URL}/community/statistics`,
    title: 'Statistics',
  }, {
    enforceA: true,
    icon: <IconNavEvents />,
    link: `${BASE_URL}/community/events`,
    title: 'Events',
  }, {
    enforceA: true,
    icon: <IconNavBlog />,
    link: `${BASE_URL}/blog`,
    title: 'Blog',
  }, {
    enforceA: true,
    icon: <IconNavThrive />,
    link: `${BASE_URL}/thrive`,
    title: 'Thrive',
  }],
}];

export default class TopcoderHeader extends React.Component {
  constructor(props) {
    super(props);

    this.globalTouchListener = this.globalTouchListener.bind(this);
    this.addGlobalTouchListener = this.addGlobalTouchListener.bind(this);
    this.removeGlobalTouchListener = this.removeGlobalTouchListener.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
    this.getMenuButton = this.getMenuButton.bind(this);

    this.listenerRegistered = false;
  }

  componentWillUnmount() {
    const { closeMenu, closeSearch } = this.props;
    closeMenu();
    closeSearch();
    this.removeGlobalTouchListener();
  }

  getMenuButton(node) {
    if (!node || !node.dataset || node === this.headerRoot) {
      return null;
    }
    if (node.dataset.menu) {
      return node;
    }
    return this.getMenuButton(node.parentNode);
  }

  globalTouchListener({ target }) {
    const { closeMenu, searchOpened, openedMenu } = this.props;
    const { closeSearch } = this;
    const menuButton = this.getMenuButton(target);

    if (menuButton) {
      if (menuButton.dataset.menu === 'search' && openedMenu) {
        closeMenu();
      } else if (menuButton.dataset.menu !== 'search' && searchOpened) {
        closeSearch();
      }
    } else if (!this.headerRoot.contains(target) || this.mainMenu.contains(target)) {
      closeSearch();
      closeMenu();
      this.removeGlobalTouchListener();
    }
  }

  addGlobalTouchListener() {
    if (!this.listenerRegistered) {
      document.addEventListener('touchend', this.globalTouchListener);
      this.listenerRegistered = true;
    }
  }

  removeGlobalTouchListener() {
    document.removeEventListener('touchend', this.globalTouchListener);
    this.listenerRegistered = false;
  }

  closeSearch() {
    const { closeSearch } = this.props;
    this.searchInput.blur();
    closeSearch();
  }

  render() {
    const {
      isMobile,
      activeTrigger,
      closeMenu,
      closeMobileMenu,
      currentNav,
      mobileMenuOpened,
      openedMenu,
      openMenu,
      openMobileMenu,
      openSearch,
      profile,
      searchOpened,
    } = this.props;

    const normalizedProfile = profile && _.clone(profile);
    if (profile && profile.photoURL) {
      normalizedProfile.photoURL = `${config.CDN.PUBLIC}/avatar/${
        encodeURIComponent(normalizedProfile.photoURL)}?size=32`;
    }

    const { closeSearch } = this;

    const mainMenu = MENU.map((item) => {
      let styleName = 'main-menu-item';
      if (openedMenu && openedMenu.title === item.title) styleName += ' opened';
      if (item.title === currentNav.menuTitle) styleName += ' current';
      return (
        <li
          key={item.title}
          data-menu={item.title}
          onMouseEnter={event => !isMobile && openMenu(item, event.target)}
          onMouseLeave={(event) => {
            /* False when mouse cursor leaves from the main menu element to the
             * sub-menu. In that case we keep the sub-menu opened, and responsible
             * for further tracking of the mouse cursor. */
            if (!isMobile && activeTrigger
              && 1 + event.pageY < activeTrigger.bottom) closeMenu();
          }}
          onTouchStart={(event) => {
            if (isMobile && openedMenu && openedMenu.title === item.title) {
              closeMenu();
              this.removeGlobalTouchListener();
            } else {
              openMenu(item, this.getMenuButton(event.target), true);
              this.addGlobalTouchListener();
            }
          }}
          styleName={styleName}
        >
          {item.url ? (
            <Link to={item.url}>
              {item.title}
            </Link>
          ) : <span role="link" tabIndex={0}>{item.title}</span>}
        </li>
      );
    });

    let authButtons;
    let userAvatar;
    let userMenuHandle;
    let userSubMenu;

    if (normalizedProfile) {
      userAvatar = (
        <div styleName="avatar">
          <Avatar url={normalizedProfile.photoURL} />
        </div>
      );

      userSubMenu = {
        title: 'User',
        items: [{
          enforceA: true,
          icon: <IconNavDashboard />,
          link: `${BASE_URL}/home`,
          title: 'Home',
        }, {
          enforceA: true,
          icon: <IconNavProfile />,
          link: `/members/${normalizedProfile.handle}`,
          title: 'My Profile',
        }, {
          icon: <IconNavWallet />,
          link: `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=false`,
          title: 'Payments',
        }, {
          enforceA: true,
          icon: <IconNavSettings />,
          link: '/settings/account',
          title: 'Settings',
        }, {
          enforceA: true,
          icon: <IconNavExit />,
          // TODO: In addition to hitting ${BASE_URL}/logout, which logs out
          // from the accounts-app, we should wipe out auth cookies!
          link: `${BASE_URL}/logout`,
          title: 'Log Out',
        }],
      };
      userMenuHandle = (
        <div
          data-menu="userMenu"
          onMouseEnter={event => !isMobile && openMenu(userSubMenu, event.target)}
          onMouseLeave={(event) => {
            /* False when mouse cursor leaves from the main menu element to the
             * sub-menu. In that case we keep the sub-menu opened, and responsible
             * for further tracking of the mouse cursor. */
            if (!isMobile && activeTrigger
              && 1 + event.pageY < activeTrigger.bottom) closeMenu();
          }}
          onTouchStart={(event) => {
            if (isMobile && openedMenu && openedMenu.title === userSubMenu.title) {
              closeMenu();
              this.removeGlobalTouchListener();
            } else {
              openMenu(userSubMenu, this.getMenuButton(event.target), true);
              this.addGlobalTouchListener();
            }
          }}
          onFocus={event => !isMobile && openMenu(userSubMenu, event.target)}
          onBlur={() => {
            if (!isMobile) closeMenu();
          }}
          role="link"
          tabIndex={0}
          styleName="user-menu"
        >
          <div
            style={{
              color: getRatingColor(_.get(normalizedProfile, 'maxRating.rating', 0)),
            }}
            styleName="user-menu-handle"
          >
            {normalizedProfile.handle}
          </div>
          <span>{userAvatar}</span>
        </div>
      );
    } else {
      authButtons = (
        <span styleName="auth-align">
          <Auth />
        </span>
      );
    }

    return (
      <div
        styleName="header"
        role="banner"
        ref={(div) => { this.headerRoot = div; }}
        onMouseLeave={() => {
          if (openedMenu) {
            closeMenu();
          }
          if (searchOpened) {
            closeSearch();
          }
        }}
      >
        <div styleName="main-desktop-header">
          <a href={BASE_URL} styleName="logo" aria-label="Topcoder Logo link to Topcoder Homepage">
            <LogoTopcoderWithName height={53} width={135} title="Topcoder Logo link to Topcoder Homepage" />
          </a>
          <ul styleName="main-menu" role="navigation" ref={(ul) => { this.mainMenu = ul; }}>
            {mainMenu}
          </ul>
          <div styleName="right-menu">
            {userMenuHandle}
            {authButtons}
            <div
              aria-label="Find members by username or skill"
              role="button"
              tabIndex={0}
              data-menu="search"
              className={searchOpened ? 'opened' : ''}
              onFocus={event => !isMobile && openSearch(event.target)}
              onBlur={(event) => {
                if (!isMobile && activeTrigger
                  && 1 + event.pageY < activeTrigger.bottom) closeSearch();
              }}
              onMouseEnter={event => !isMobile && openSearch(event.target)}
              onMouseLeave={(event) => {
                if (!isMobile && activeTrigger
                  && 1 + event.pageY < activeTrigger.bottom) closeSearch();
              }}
              onTouchStart={(event) => {
                if (isMobile && searchOpened) {
                  closeSearch();
                  this.removeGlobalTouchListener();
                } else {
                  openSearch(this.getMenuButton(event.target), true);
                  this.addGlobalTouchListener();
                }
              }}
              styleName="search-icon"
            >
              <MagnifyingGlass />
            </div>
          </div>
        </div>
        <DesktopSubMenu
          closeMenu={closeMenu}
          currentSubMenuTitle={currentNav.subMenuTitle}
          menu={openedMenu}
          trigger={activeTrigger}
        />
        <div
          role="search"
          className={searchOpened ? 'opened' : 'closed'}
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
            ref={(input) => { this.searchInput = input; }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                if (!VALID_BASE_URLS.includes(BASE_URL)) {
                  return;
                }
                const query = event.target.value.trim();
                const url = new URL(`${BASE_URL}/search/members`);
                url.searchParams.append('q', query);             
                window.location = url.href;
              }
            }}
            onBlur={closeSearch}
            aria-label="Find members by username or skill"
            placeholder="Find members by username or skill"
          />
        </div>
        <MobileHeader
          close={closeMobileMenu}
          mainMenu={MENU}
          open={openMobileMenu}
          opened={mobileMenuOpened}
          profile={normalizedProfile}
          userMenu={userSubMenu}
        />
      </div>
    );
  }
}

TopcoderHeader.defaultProps = {
  activeTrigger: null,
  mobileMenuOpened: false,
  openedMenu: null,
  profile: null,
  searchOpened: false,
  isMobile: false,
};

TopcoderHeader.propTypes = {
  isMobile: PT.bool,
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
