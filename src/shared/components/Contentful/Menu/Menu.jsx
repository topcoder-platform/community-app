/**
 * Menu component
 *
 */
/* global window */
import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';
import { removeTrailingSlash } from 'utils/url';

import MenuItem from './MenuItem';

export default function Menu(props) {
  const {
    menuItems, theme, baseUrl,
  } = props;
  let pathname = '';
  if (isomorphy.isClientSide()) {
    pathname = removeTrailingSlash(window.location.pathname);
  }

  return (
    <nav className={theme.menuContainer}>
      <ul className={theme.container}>
        {
          menuItems.map(item => (
            <MenuItem
              item={item}
              theme={theme}
              isActive={
                (pathname === baseUrl && item.fields.url === '/')
                || pathname.indexOf(item.fields.slug) !== -1
              }
              key={item.sys.id}
              baseUrl={baseUrl}
            />
          ))
        }
      </ul>
    </nav>
  );
}

Menu.defaultProps = {
  theme: {},
  menuItems: [],
};

Menu.propTypes = {
  theme: PT.shape({
    container: PT.string,
    titleList: PT.string,
    titleListItem: PT.string,
    titleListItemSelected: PT.string,
    content: PT.string,
  }),
  menuItems: PT.arrayOf(PT.shape()),
  baseUrl: PT.string.isRequired,
};
