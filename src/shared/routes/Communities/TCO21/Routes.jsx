/**
 * Routing of TCO21 Community.
 */

import Error404 from 'components/Error404';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ContentfulRoute from 'components/Contentful/Route';
import ContentfulMenu from 'components/Contentful/Menu';
import ProfileStats from 'routes/ProfileStats';

export default function TCO21({ base, meta }) {
  return (
    <div>
      {
        meta.menuItems ? (
          <ContentfulMenu
            id={meta.menuItems[0].navigationMenu}
            spaceName={meta.menuItems[0].spaceName}
            environment={meta.menuItems[0].environment}
            baseUrl={base}
          />
        ) : null
      }
      <Switch>
        <Route
          render={props => <ProfileStats {...props} meta={meta} />}
          exact
          path={`${base}/members/:handle([\\w\\-\\[\\].{}]{2,15})/details`}
        />
        <ContentfulRoute
          baseUrl={base}
          error404={<Error404 />}
          id="6wUJl6RRF6MxI3kR6DFq5t"
        />
      </Switch>
    </div>
  );
}

TCO21.defaultProps = {
  base: '',
};

TCO21.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
