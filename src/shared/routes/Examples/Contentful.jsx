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
import AppComponent from 'components/Contentful/AppComponent';
import Countdown from 'components/Contentful/Countdown';
import ContentBlock from 'components/Contentful/ContentBlock';
import BlogPostLoader, { HeroImageLoader } from 'components/Contentful/BlogPost';
import ContentfulRoute from 'components/Contentful/Route';
import Quote from 'components/Contentful/Quote';
import Video from 'components/Contentful/Video';
import Viewport from 'components/Contentful/Viewport';
import Tabs from 'components/Contentful/Tabs';
import Blog from 'components/Contentful/Blog';
import BlogFeed from 'containers/Contentful/BlogFeed';
import Modal from 'components/Contentful/Modal';
import MemberCard from 'components/Contentful/MemberCard';
import Image from 'components/Contentful/Image';
import Shape from 'components/Contentful/Shape';
import Article from 'components/Contentful/Article';
import qs from 'qs';
import { ContentfulLivePreview } from '@contentful/live-preview';
import { isomorphy } from 'topcoder-react-utils';

import { Route, Switch } from 'react-router-dom';

import '@contentful/live-preview/style.css';

ContentfulLivePreview.init({
  locale: 'en-US',
  debugMode: !!isomorphy.isDevBuild(),
});

export default function Contentful({ location, match }) {
  let spaceName;
  if (location.search) {
    spaceName = qs.parse(location.search.slice(1)).space;
  }
  const base = match.url;


  return (
    <Switch>
      <Route
        path={`${base}/slider/:id`}
        component={p => (
          <ContentSlider
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/accordion/:id`}
        component={p => (
          <Accordion
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/menu/:id`}
        component={p => (
          <Menu
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/banner/:id`}
        component={p => (
          <Banner
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/app-component/:id`}
        component={p => (
          <AppComponent
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/countdown/:id`}
        component={p => (
          <Countdown
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/contentblock/:id`}
        component={p => (
          <ContentBlock
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/blogpost/:id`}
        component={p => (
          <BlogPostLoader
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
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
        component={p => (
          <Quote
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/video/:id`}
        component={p => (
          <Video
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/route/:id`}
        component={p => (
          <ContentfulRoute
            baseUrl={p.match.url}
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/viewport/:id`}
        component={p => (
          <Viewport
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/tabs/:id`}
        component={p => (
          <Tabs
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/blog-feed/:id`}
        component={p => (
          <BlogFeed
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/shape/:id`}
        component={p => (
          <Shape
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/image/:id`}
        component={p => (
          <Image
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          />
        )}
      />
      <Route
        path={`${base}/modal/:id`}
        component={p => (
          <Modal
            id={p.match.params.id}
            preview
            spaceName={spaceName}
          >
            <button type="button">click me</button>
          </Modal>
        )}
      />
      <Route
        path={`${base}/member-card/:id`}
        component={p => (
          <div>
            <p>You can adjust wrapper size to scale the member card in devtools</p>
            <div style={{ width: '350px', height: '350px' }}>
              <MemberCard
                id={p.match.params.id}
                preview
                spaceName={spaceName}
              />
            </div>
          </div>
        )}
      />
      <Route
        path={`${base}/article/:id`}
        component={p => (
          <div>
            <Article
              id={p.match.params.id}
              preview
              spaceName={spaceName}
            />
          </div>
        )}
      />
    </Switch>
  );
}


Contentful.propTypes = {
  location: PT.shape({
    search: PT.string.isRequired,
  }).isRequired,
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
