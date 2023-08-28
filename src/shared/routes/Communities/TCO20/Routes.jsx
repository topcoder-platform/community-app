/**
 * Routing of TCO20 Community.
 */

import Error404 from 'components/Error404';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ContentfulRoute from 'components/Contentful/Route';
import Viewport from 'components/Contentful/Viewport';
import ProfileStats from 'routes/ProfileStats';
import TCO20Header from 'containers/tc-communities/tco20/Header';

export default function TCO20({ base, meta }) {
  return (
    <div>
      <TCO20Header base={base} meta={meta} />
      <Switch>
        <Route
          render={props => <ProfileStats {...props} meta={meta} />}
          exact
          path={`${base}/members/:handle([\\w\\-\\[\\].{}]{2,15})/details`}
        />
        <ContentfulRoute
          baseUrl={base}
          error404={<Error404 />}
          id="2Ls9DElilYWV3X2p8qN2EN"
        />
      </Switch>
      <Viewport
        id="65z6CPtAE091BkbEUKHG0V"
        baseUrl={base}
      />
    </div>
  );
}

TCO20.defaultProps = {
  base: '',
};

TCO20.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
