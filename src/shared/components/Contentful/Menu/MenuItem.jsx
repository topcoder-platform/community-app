/**
 * MenuItem component
 */
import React from 'react';
import PT from 'prop-types';
import { NavLink } from 'topcoder-react-utils';
import { linkText, target } from 'utils/contentful';

export default function MenuItem(props) {
  const {
    item, theme, isActive, baseUrl,
  } = props;

  return item.fields.excludeFromNavigationMenus !== true ? (
    <li
      className={theme.menuItemLevel}
      key={item.url}
    >
      <NavLink
        activeClassName={theme.menuItemLinkActive}
        className={theme.menuItemLink}
        isActive={() => isActive}
        to={target(baseUrl, item)}
        openNewTab={item.fields.inNewTab}
      >
        {linkText(item)}
      </NavLink>
    </li>
  ) : null;
}


MenuItem.defaultProps = {
  item: {},
  theme: {},
  isActive: false,
};

MenuItem.propTypes = {
  item: PT.shape(),
  theme: PT.shape(),
  isActive: PT.bool,
  baseUrl: PT.string.isRequired,
};
