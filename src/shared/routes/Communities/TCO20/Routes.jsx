/**
 * Routing of TCO20 Community.
 */

import Error404 from 'components/Error404';
import PT from 'prop-types';
import React from 'react';
import ContentfulRoute from 'components/Contentful/Route';
import ContentfulMenu from 'components/Contentful/Menu';
import Viewport from 'components/Contentful/Viewport';

export default function TCO20({ base, meta }) {
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
      <ContentfulRoute
        baseUrl={base}
        error404={<Error404 />}
        id="2Ls9DElilYWV3X2p8qN2EN"
      />
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
