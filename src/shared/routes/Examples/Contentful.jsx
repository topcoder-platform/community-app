/**
 * Routes for previews of different Contentful components.
 */

import PT from 'prop-types';
import React from 'react';

import Banner from 'components/Contentful/Banner';

import { Route, Switch } from 'react-router-dom';

export default function Contentful({ match }) {
  const base = match.url;
  return (
    <Switch>
      <Route
        path={`${base}/banner/:id`}
        component={p => <Banner id={p.match.params.id} preview />}
      />
    </Switch>
  );
}

Contentful.propTypes = {
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
