/**
 * The Error404 component renders a message about 404 HTTP error.
 */

import _ from 'lodash';
import React from 'react';
import { Route } from 'react-router-dom';
import Viewport from 'components/Contentful/Viewport';
import './style.scss';

export default function Page404() {
  return (
    <div styleName="container">
      <Route
        render={({ staticContext }) => {
          if (staticContext) _.assign(staticContext, { status: 404 });
          return null;
        }}
      />
      <Viewport
        id="3fB4UivAs6Nn5WbhREuqrn"
      />
    </div>
  );
}
