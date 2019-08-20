/**
 * Routing of EDU Community.
 */

import Error404 from 'components/Error404';
import PT from 'prop-types';
import React from 'react';
import ContentfulRoute from 'components/Contentful/Route';
import ContentfulMenu from 'components/Contentful/Menu';

export default function EDU({ base, meta }) {
  return (
    <div>
      {
        meta.menuItems.length ? (
          <ContentfulMenu
            id={meta.menuItems[0].navigationMenu}
            spaceName={meta.menuItems[0].spaceName}
            environment={meta.menuItems[0].environment}
            baseUrl={base}
          />
        ) : null
      }
      <ContentfulRoute
        baseUrl={base}
        error404={<Error404 />}
        id="dwRKUGPlAI6QrvBcHp2Ag"
        spaceName="EDU"
      />
    </div>
  );
}

EDU.defaultProps = {
  base: '',
};

EDU.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
