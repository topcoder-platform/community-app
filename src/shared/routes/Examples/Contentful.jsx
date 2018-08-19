/**
 * Routes for previews of different Contentful components.
 */

import PT from 'prop-types';
import React from 'react';

import Accordion from 'components/Contentful/Accordion';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import ContentfulRoute from 'components/Contentful/Route';
import Quote from 'components/Contentful/Quote';
import Video from 'components/Contentful/Video';
import Viewport from 'components/Contentful/Viewport';

import { Route, Switch } from 'react-router-dom';

export default function Contentful({ match }) {
  const base = match.url;
  return (
    <Switch>
      <Route
        path={`${base}/accordion/:id`}
        component={p => <Accordion id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/accordion2/:id`}
        component={p => (
          <Accordion
            id={p.match.params.id}
            spaceName="tcdeveloper"
            environment="development"
            preview
          />
        )}
      />
      <Route
        path={`${base}/banner/:id`}
        component={p => <Banner id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/banner2/:id`}
        component={p => (
          <Banner
            id={p.match.params.id}
            spaceName="tcdeveloper"
            environment="development"
            preview
          />
        )}
      />
      <Route
        path={`${base}/contentblock/:id`}
        component={p => <ContentBlock id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/contentblock2/:id`}
        component={p => (
          <ContentBlock
            id={p.match.params.id}
            spaceName="tcdeveloper"
            environment="development"
            preview
          />
        )}
      />
      <Route
        path={`${base}/quote/:id`}
        component={p => <Quote id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/quote2/:id`}
        component={p => (
          <Quote
            id={p.match.params.id}
            spaceName="tcdeveloper"
            environment="development"
            preview
          />
        )}
      />
      <Route
        path={`${base}/video/:id`}
        component={p => <Video id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/video2/:id`}
        component={p => (
          <Video
            id={p.match.params.id}
            spaceName="tcdeveloper"
            environment="development"
            preview
          />
        )}
      />
      <Route
        path={`${base}/route/:id`}
        component={p => <ContentfulRoute baseUrl={p.match.url} id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/route2/:id`}
        component={p => (
          <ContentfulRoute
            baseUrl={p.match.url}
            id={p.match.params.id}
            spaceName="tcdeveloper"
            environment="development"
            preview
          />
        )}
      />
      <Route
        path={`${base}/viewport/:id`}
        component={p => <Viewport id={p.match.params.id} preview />}
      />
      <Route
        path={`${base}/viewport2/:id`}
        component={p => (
          <Viewport
            id={p.match.params.id}
            spaceName="tcdeveloper"
            environment="development"
            preview
          />
        )}
      />
    </Switch>
  );
}

Contentful.propTypes = {
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
