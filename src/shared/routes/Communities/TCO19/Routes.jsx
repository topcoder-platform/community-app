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
import Blog from 'components/Contentful/Blog';
import { HeroImageLoader } from 'components/Contentful/BlogPost';


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
              path={`${base}/blog/:page?`}
              component={(p) => {
                const { page } = p.match.params;
                if (!page || parseInt(page, 10)) {
                  return (
                    <Blog
                      baseUrl={`${base}/blog`}
                      id="TCO Blog"
                      page={p.match.params.page ? parseInt(p.match.params.page, 10) : 1}
                      history={p.history}
                    />
                  );
                }
                const query = {
                  content_type: 'blogPost',
                  'fields.slug': page,
                };
                return (
                  <ContentfulLoader
                    entryQueries={query}
                    render={(data) => {
                      const blogPost = _.values(data.entries.items)[0];
                      if (!blogPost) return Error404();

                      return (
                        <HeroImageLoader
                          blogPost={blogPost.fields}
                          id={blogPost.sys.id}
                          sys={blogPost.sys}
                          blogUrl={`${base}/blog`}
                          preview={false}
                        />
                      );
                    }}
                  />
                );
              }}
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
