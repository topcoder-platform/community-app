/**
 * MenuItem component
 */
import React from 'react';
import PT from 'prop-types';
import { NavLink } from 'topcoder-react-utils';

export default function MenuItem(props) {
  const {
    item, theme, isActive, baseUrl,
  } = props;
  // use/prefer url if available
  let to = '';
  if (item.fields.url) {
    to = item.fields.url.startsWith('http') ? item.fields.url : `${baseUrl}${item.fields.url}`;
  } else if (item.fields.viewport) {
    // for viewports use
    // menu item slug to build the url
    to = `${baseUrl}/${item.fields.slug}`;
  } else {
    // case when nor url either viewport
    // of item are specified. Bad link!?
    to = '#';
  }

  return (
    <li
      className={theme.menuItemLevel}
      key={item.url}
    >
      <NavLink
        activeClassName={theme.menuItemLinkActive}
        className={theme.menuItemLink}
        isActive={() => isActive}
        to={to}
        openNewTab={item.fields.inNewTab}
      >
        {item.fields.linkText || item.fields.name}
      </NavLink>
    </li>
  );
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
