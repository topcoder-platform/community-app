/**
 * Routing of TCO22 Community.
 */

import Error404 from 'components/Error404';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ContentfulRoute from 'components/Contentful/Route';
import ContentfulMenu from 'components/Contentful/Menu';
import ProfileStats from 'routes/ProfileStats';

export default function TCO22({ base, meta }) {
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
          id="6Ewcb5fkc67JOMhud6RoBs"
        />
      </Switch>
    </div>
  );
}

TCO22.defaultProps = {
  base: '',
};

TCO22.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
