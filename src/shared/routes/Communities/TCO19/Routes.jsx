/**
 * Routing of TCO Community.
 */

import _ from 'lodash';
import Error404 from 'components/Error404';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/tco19/Home';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Viewport from 'components/Contentful/Viewport';
import ContentfulLoader from 'containers/ContentfulLoader';

import headerTheme from 'components/tc-communities/communities/tco19/themes/header.scss';

export default function TCO19({ base }) {
  return (
    <Route
      component={({ match }) => (
        <div>
          <Header
            baseUrl={base}
            hideJoinNow
            pageId={match.params.pageId || 'home'}
            theme={headerTheme}
          />
          <Switch>
            <Route
              component={() => <Home baseUrl={base} />}
              exact
              path={`${base}`}
            />
            <Route
              component={() => <Home baseUrl={base} />}
              exact
              path={`${base}/home`}
            />
            <Route
              component={(p) => {
                const mId = p.match.params.menuItems.split('/');
                const query = {
                  content_type: 'navigationMenuItem',
                  'fields.slug': mId[mId.length - 1],
                };
                return (
                  <ContentfulLoader
                    entryQueries={query}
                    render={(data) => {
                      const menuItem = _.values(data.entries.items)[0];
                      if (!menuItem) return Error404();

                      return (
                        <Viewport id={menuItem.fields.viewport.sys.id} />
                      );
                    }}
                  />
                );
              }}
              path={`${base}/:menuItems+`}
            />
          </Switch>
          <Viewport
            query={{ 'fields.name': 'TCO19 - Footer Area' }}
            baseUrl={base}
          />
        </div>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

TCO19.defaultProps = {
  base: '',
};

TCO19.propTypes = {
  base: PT.string,
};
