/**
 * The Header component for communities
 *
 * Along with css modules it has global css classes
 * so the whole design can be overridden by an additional css file
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import Avatar from 'components/Avatar';
import { Link, NavLink } from 'react-router-dom';
import { getRatingColor } from 'utils/tc';
import Dropdown from 'components/tc-communities/Dropdown';
import IconSearch from '../../../../assets/images/tc-communities/search.svg';
import './style.scss';

export default function Header(props) {
  const {
    logos, menuItems, communityId, cssUrl, isMobileOpen, onMobileToggleClick, profile,
    registerUrl, loginUrl,
  } = props;

  // hardcode dropdown options for now
  const communitiesDropdownOptions = [
    {
      label: 'iOS Community',
      value: '1',
    }, {
      label: 'Predix Topcoder',
      value: '2',
    }, {
      label: 'Cognitive Topcoder',
      value: '3',
    }, {
      label: 'Android Community',
      value: '4',
    },
  ];

  const loginState = profile ? (
    <div
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
      <a href={registerUrl} styleName="btnRegister">Register</a>
      <a href={loginUrl} styleName="btnLogin">Login</a>
    </div>
  );

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
                    to={`/community/${communityId}/${menuItems[0].url}`}
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
                options={communitiesDropdownOptions}
                value={communitiesDropdownOptions[0]}
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
                  to={`/community/${communityId}/${item.url}`}
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
    </div>
  );
}

Header.defaultProps = {
  menuItems: [],
  logos: [],
  isMobileOpen: false,
  cssUrl: null,
  profile: null,
};

Header.propTypes = {
  registerUrl: PT.string.isRequired,
  loginUrl: PT.string.isRequired,
  menuItems: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    url: PT.string.isRequired,
  })),
  logos: PT.arrayOf(PT.string),
  isMobileOpen: PT.bool,
  cssUrl: PT.string,
  onMobileToggleClick: PT.func.isRequired,
  communityId: PT.string.isRequired,
  profile: PT.shape({}),
};
