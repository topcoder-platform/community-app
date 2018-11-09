/**
 * Routes for previews of different Contentful components.
 */

import PT from 'prop-types';
import React from 'react';

import _ from 'lodash';
import Error404 from 'components/Error404';
import ContentfulLoader from 'containers/ContentfulLoader';
import ContentSlider from 'components/Contentful/ContentSlider';
import Accordion from 'components/Contentful/Accordion';
import Menu from 'components/Contentful/Menu';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import BlogPostLoader, { HeroImageLoader } from 'components/Contentful/BlogPost';
import ContentfulRoute from 'components/Contentful/Route';
import Quote from 'components/Contentful/Quote';
import Video from 'components/Contentful/Video';
import Viewport from 'components/Contentful/Viewport';
import Tabs from 'components/Contentful/Tabs';
import Blog from 'components/Contentful/Blog';

import { Route, Switch } from 'react-router-dom';

export default function Contentful({ match }) {
  const base = match.url;
  return (
    <Switch>
      <Route
        path={`${base}/slider/:id`}
        component={p => <ContentSlider id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/accordion/:id`}
        component={p => <Accordion id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/menu/:id`}
        component={p => <Menu id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/banner/:id`}
        component={p => <Banner id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/contentblock/:id`}
        component={p => <ContentBlock id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/blogpost/:id`}
        component={p => <BlogPostLoader id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/blog/:id/:page?`}
        component={(p) => {
          const { page } = p.match.params;
          if (!page || parseInt(page, 10)) {
            return (
              <Blog
                baseUrl={`${base}/blog/${p.match.params.id}`}
                id={p.match.params.id}
                page={p.match.params.page ? parseInt(p.match.params.page, 10) : 1}
                limit={3}
                preview
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
                    blogUrl={`${base}/blog/${p.match.params.id}`}
                    preview={false}
                  />
                );
              }}
            />
          );
        }}
      />
      <Route
        path={`${base}/quote/:id`}
        component={p => <Quote id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/video/:id`}
        component={p => <Video id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/route/:id`}
        component={p => <ContentfulRoute baseUrl={p.match.url} id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/viewport/:id`}
        component={p => <Viewport id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/tabs/:id`}
        component={p => <Tabs id={p.match.params.id} preview />}
      />
    </Switch>
  );
}

Contentful.propTypes = {
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
