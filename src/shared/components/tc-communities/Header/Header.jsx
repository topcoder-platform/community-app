/**
 * The Header component for communities
 *
 * Along with css modules it has global css classes
 * so the whole design can be overridden by an additional css file
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import './Header.scss';

export default function Header(props) {
  const { logoUrl, menuItems, communityId, cssUrl, isMobileOpen, onMobileToggleClick } = props;

  return (
    <div>
      {cssUrl && <link rel="stylesheet" type="text/css" href={cssUrl} />}
      <header styleName="container" className="tc-communities__header__container">
        <div styleName="header" className="tc-communities__header__header">
          {logoUrl && <Link
            to={`/community/${communityId}`}
            styleName="logo"
            className="tc-communities__header__logo"
          >
            <img src={logoUrl} alt="Community logo" />
          </Link>}
          <button
            styleName="mobile-toggle"
            className="tc-communities__header__mobile-toggle"
            onClick={onMobileToggleClick}
          >
            <span>Toggle navigation</span>
            <i /><i /><i />
          </button>
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
                <Link
                  styleName="menu-link"
                  className="tc-communities__header__menu-link"
                  to={`/community/${communityId}${item.url}`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

Header.defaultProps = {
  menuItems: [],
  logoUrl: null,
  isMobileOpen: false,
  cssUrl: null,
  communityId: null,
};

Header.propTypes = {
  menuItems: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    url: PT.string.isRequired,
  })),
  logoUrl: PT.string,
  isMobileOpen: PT.bool,
  cssUrl: PT.string,
  onMobileToggleClick: PT.func.isRequired,
  communityId: PT.string,
};
