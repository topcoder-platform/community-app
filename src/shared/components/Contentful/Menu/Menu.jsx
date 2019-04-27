/**
 * Menu component
 *
 */
/* global window */
import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';
import { url } from 'topcoder-react-lib';
import Dropdown from 'components/tc-communities/Dropdown';

import MenuItem from './MenuItem';

export default function Menu(props) {
  const {
    menuItems, theme, baseUrl, parentItems, activeParentItem,
  } = props;
  let pathname = '';
  if (isomorphy.isClientSide()) {
    pathname = url.removeTrailingSlash(window.location.pathname);
  }

  return (
    <nav className={theme.menuContainer}>
      {
        parentItems.length ? (
          <div className={theme.menuSwitchContainer}>
            <Dropdown
              options={parentItems.map(pI => ({
                label: pI.fields.linkText,
                value: pI.fields.slug,
                url: `${baseUrl}/../${pI.fields.slug}`,
              }))}
              value={activeParentItem.fields.slug}
              onChange={(option) => { window.location.href = option.url; }}
            />
          </div>
        ) : null
      }
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
  parentItems: PT.arrayOf(PT.shape()).isRequired,
  activeParentItem: PT.shape().isRequired,
};
