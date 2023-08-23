/**
 * Routing of TCO19 Community.
 */

import _ from 'lodash';
import Error404 from 'components/Error404';
import Header from 'containers/tc-communities/Header';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Viewport from 'components/Contentful/Viewport';
import ContentfulLoader from 'containers/ContentfulLoader';
import Blog from 'components/Contentful/Blog';
import { HeroImageLoader } from 'components/Contentful/BlogPost';
import ContentfulRoute from 'components/Contentful/Route';
import ProfileStats from 'routes/ProfileStats';
import { config } from 'topcoder-react-utils';


import headerTheme from 'components/tc-communities/communities/tco19/themes/header.scss';

export default function TCO19({ base, meta }) {
  return (
    <Route
      component={({ match }) => (
        <div>
          <Header
            baseUrl={base}
            pageId={match.params.pageId || 'home'}
            theme={headerTheme}
            logoutRedirect={config.URL.TCO19}
          />
          <Switch>
            <Route
              render={props => <ProfileStats {...props} meta={meta} />}
              exact
              path={`${base}/members/:handle([\\w\\-\\[\\].{}]{2,15})/details`}
            />
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
            <ContentfulRoute
              baseUrl={base}
              error404={<Error404 />}
              id="6kF6iiWGmhM6EHH8j7Kee7"
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
  meta: PT.shape().isRequired,
};
