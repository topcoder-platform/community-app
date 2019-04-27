/**
 * Renders an Navigation/Menu with data from Contentful
 */
/* global window */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import PT from 'prop-types';
import React from 'react';
import { isomorphy } from 'topcoder-react-utils';
import { url } from 'topcoder-react-lib';

import NavMenu from './Menu';

/* eslint-disable global-require */
const THEMES = {
  Default: require('./themes/default.scss'),
  'TCO19 - Header Menu': require('./themes/tco19-header.scss'),
  'TCO19 - Footer Menu': require('./themes/tco19-footer.scss'),
};
/* eslint-enable global-require */

function MenuItemsLoader(props) {
  const {
    menuId,
    ids,
    preview,
    title,
    themeName,
    theme,
    parentItems,
    activeParentItem,
    level,
  } = props;
  const themeToUse = theme || THEMES[themeName];
  let { baseUrl } = props;
  let pathname = '';
  // remove trail slash from baseUrl
  baseUrl = url.removeTrailingSlash(baseUrl);
  // check current path
  if (isomorphy.isClientSide()) {
    pathname = url.removeTrailingSlash(window.location.pathname);
  }
  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      render={(data) => {
        const submenu = _.compact(_.values(data.entries.items).map((menuItem) => {
          if (menuItem.fields.submenu
            && (pathname.indexOf(menuItem.fields.slug) !== -1 || (pathname === baseUrl && menuItem.fields.url === '/'))) {
            return (
              <div className={themeToUse.submenu} key={menuItem.fields.submenu.sys.id}>
                <ContentfulMenu
                  id={menuItem.fields.submenu.sys.id}
                  baseUrl={`${baseUrl}/${menuItem.fields.slug}`}
                  theme={themeToUse}
                  key={menuItem.fields.submenu.sys.id}
                  parentItems={_.values(data.entries.items)}
                  activeParentItem={menuItem}
                  level={level + 1}
                />
              </div>
            );
          }
          return null;
        }));

        return (
          <div className={themeToUse.outerContainer}>
            {!!title && (<h1 className={themeToUse.title}>{title}</h1>)}
            {
              level === 0 || (level === 1 && !submenu.length) ? (
                <NavMenu
                  menuItems={_.values(data.entries.items)}
                  key={menuId}
                  theme={themeToUse}
                  baseUrl={baseUrl}
                  parentItems={[]}
                  activeParentItem={activeParentItem}
                />
              ) : null
            }
            {
              level === 2 ? (
                <NavMenu
                  menuItems={_.values(data.entries.items)}
                  key={menuId}
                  theme={themeToUse}
                  baseUrl={baseUrl}
                  parentItems={parentItems}
                  activeParentItem={activeParentItem}
                />
              ) : (
                null
              )
            }
            { submenu }
          </div>
        );
      }}
    />
  );
}

MenuItemsLoader.defaultProps = {
  title: '',
  theme: null,
};

MenuItemsLoader.propTypes = {
  menuId: PT.string.isRequired,
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  title: PT.string,
  themeName: PT.string.isRequired,
  baseUrl: PT.string.isRequired,
  theme: PT.shape(),
  parentItems: PT.arrayOf(PT.shape()).isRequired,
  activeParentItem: PT.shape().isRequired,
  level: PT.number.isRequired,
};

export default function ContentfulMenu(props) {
  const {
    id,
    preview,
    baseUrl,
    theme,
    parentItems,
    activeParentItem,
    level,
  } = props;

  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      render={(data) => {
        const { fields } = Object.values(data.entries.items)[0];
        if (!fields) return null;
        return (
          <MenuItemsLoader
            menuId={id}
            ids={_.map(fields.items, 'sys.id')}
            preview={preview}
            themeName={fields.theme}
            theme={theme}
            title={fields.title}
            baseUrl={fields.baseUrl || baseUrl}
            parentItems={parentItems}
            activeParentItem={activeParentItem}
            level={level}
          />
        );
      }}
    />
  );
}

ContentfulMenu.defaultProps = {
  preview: false,
  baseUrl: '',
  theme: null,
  parentItems: [],
  activeParentItem: {},
  level: 0,
};

ContentfulMenu.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  baseUrl: PT.string,
  theme: PT.shape(),
  parentItems: PT.arrayOf(PT.shape()),
  activeParentItem: PT.shape(),
  level: PT.number,
};
