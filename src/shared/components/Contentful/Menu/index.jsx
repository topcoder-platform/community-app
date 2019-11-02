/**
 * Renders an Navigation/Menu with data from Contentful
 */
/* global window */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import ContentfulMenuLoader from 'containers/Contentful/MenuLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { removeTrailingSlash } from 'utils/url';
import { isActive, target } from 'utils/contentful';
import { isomorphy } from 'topcoder-react-utils';

import NavMenu from './Menu';

/* eslint-disable global-require */
const THEMES = {
  Default: require('./themes/default.scss'),
  'TCO19 - Header Menu': require('./themes/tco19-header.scss'),
  'TCO19 - Footer Menu': require('./themes/tco19-footer.scss'),
  'TCO20 - Footer Menu': require('./themes/tco20-footer.scss'),
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
    parentBaseUrl,
    parentItems,
    activeParentItem,
    level,
    spaceName,
    environment,
  } = props;
  const themeToUse = theme || THEMES[themeName];
  let { baseUrl } = props;
  // remove trail slash from baseUrl
  baseUrl = removeTrailingSlash(baseUrl);

  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const submenu = _.compact(_.values(data.entries.items).map((menuItem) => {
          if (menuItem.fields.submenu && isActive(baseUrl, menuItem, 'submenu')) {
            return (
              <div className={themeToUse.submenu} key={menuItem.fields.submenu.sys.id}>
                <ContentfulMenu
                  id={menuItem.fields.submenu.sys.id}
                  baseUrl={target(baseUrl, menuItem)}
                  theme={themeToUse}
                  key={menuItem.fields.submenu.sys.id}
                  parentBaseUrl={baseUrl}
                  parentItems={_.values(data.entries.items)}
                  activeParentItem={menuItem}
                  level={level + 1}
                />
              </div>
            );
          }
          if (menuItem.fields.childRoutes && menuItem.fields.excludeFromNavigationMenus !== true) {
            if (menuItem.fields.url && menuItem.fields.url !== '/' && isActive(baseUrl, menuItem, 'childRoutes')) {
              return (
                <div className={themeToUse.submenu} key={menuItem.sys.id}>
                  <MenuItemsLoader
                    menuId={menuItem.sys.id}
                    ids={_.map(menuItem.fields.childRoutes, 'sys.id')}
                    preview={preview}
                    themeName={themeName}
                    theme={themeToUse}
                    baseUrl={target(baseUrl, menuItem)}
                    parentBaseUrl={baseUrl}
                    parentItems={_.values(data.entries.items)}
                    activeParentItem={menuItem}
                    level={level + 1}
                  />
                </div>
              );
            }
            if (!menuItem.fields.url || menuItem.fields.url === '/') {
              // need to load the submenu to see if it matches for the location
              // this is special case when we have sub menus under root "/"" path
              // all other cases are covered by above rule.

              // get the current location 1st
              let location = '';
              if (isomorphy.isClientSide()) {
                location = window.location.pathname;
                location = location.toLowerCase();
                location = _.replace(location, '/__community__/tco19', '');
              } else {
                // TODO: should probably get the current URL from the web framework
              }
              // When we are at home/root just load the menu directly
              if (!location || location === '/') {
                return (
                  <div className={themeToUse.submenu} key={menuItem.sys.id}>
                    <MenuItemsLoader
                      menuId={menuItem.sys.id}
                      ids={_.map(menuItem.fields.childRoutes, 'sys.id')}
                      preview={preview}
                      themeName={themeName}
                      theme={themeToUse}
                      baseUrl={target(baseUrl, menuItem)}
                      parentBaseUrl={baseUrl}
                      parentItems={_.values(data.entries.items)}
                      activeParentItem={menuItem}
                      level={level + 1}
                    />
                  </div>
                );
              }
              // In all other cases we need to load the menu items
              // to check if some matches against location path
              return (
                <ContentfulLoader
                  entryIds={_.map(menuItem.fields.childRoutes, 'sys.id')}
                  preview={preview}
                  spaceName={spaceName}
                  environment={environment}
                  key={menuItem.sys.id}
                  render={(childRoutesData) => {
                    const links = _.values(childRoutesData.entries.items).map(childItem => `/${childItem.fields.url}`);
                    if (links.some(link => location.startsWith(link))) {
                      return (
                        <div className={themeToUse.submenu} key={menuItem.sys.id}>
                          <MenuItemsLoader
                            menuId={menuItem.sys.id}
                            ids={_.map(menuItem.fields.childRoutes, 'sys.id')}
                            preview={preview}
                            themeName={themeName}
                            theme={themeToUse}
                            baseUrl={target(baseUrl, menuItem)}
                            parentBaseUrl={baseUrl}
                            parentItems={_.values(data.entries.items)}
                            activeParentItem={menuItem}
                            level={level + 1}
                          />
                        </div>
                      );
                    }
                    return null;
                  }}
                  renderPlaceholder={LoadingIndicator}
                />
              );
            }
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
                  parentBaseUrl={parentBaseUrl}
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
                  parentBaseUrl={parentBaseUrl}
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
      renderPlaceholder={LoadingIndicator}
    />
  );
}

MenuItemsLoader.defaultProps = {
  title: '',
  theme: null,
  spaceName: null,
  environment: null,
};

MenuItemsLoader.propTypes = {
  menuId: PT.string.isRequired,
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
  title: PT.string,
  themeName: PT.string.isRequired,
  baseUrl: PT.string.isRequired,
  theme: PT.shape(),
  parentBaseUrl: PT.string.isRequired,
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
    parentBaseUrl,
    parentItems,
    activeParentItem,
    level,
    spaceName,
    environment,
  } = props;

  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(menuData) => {
        const { fields } = Object.values(menuData.entries.items)[0];
        if (!fields) return null;
        if (fields.theme === 'General') {
          // New navi style menu
          // we deligate to special custom component and lib
          return (
            <ContentfulMenuLoader
              id={id}
              fields={fields}
              preview={preview}
              spaceName={spaceName}
              environment={environment}
              baseUrl={baseUrl}
            />
          );
        }
        // legacy navi themes
        // those are still supported...
        return (
          <MenuItemsLoader
            menuId={id}
            ids={_.map(fields.items, 'sys.id')}
            preview={preview}
            spaceName={spaceName}
            environment={environment}
            themeName={fields.theme}
            theme={theme}
            title={fields.title}
            baseUrl={fields.baseUrl || baseUrl}
            parentBaseUrl={parentBaseUrl}
            parentItems={parentItems}
            activeParentItem={activeParentItem}
            level={level}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulMenu.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
  baseUrl: '',
  theme: null,
  parentBaseUrl: '',
  parentItems: [],
  activeParentItem: {},
  level: 0,
};

ContentfulMenu.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  baseUrl: PT.string,
  theme: PT.shape(),
  parentBaseUrl: PT.string,
  parentItems: PT.arrayOf(PT.shape()),
  activeParentItem: PT.shape(),
  level: PT.number,
  spaceName: PT.string,
  environment: PT.string,
};
