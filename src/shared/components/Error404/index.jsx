/**
 * The Error404 component renders a message about 404 HTTP error.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Route } from 'react-router-dom';
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
      <h1 styleName="message">404 HTTP Error</h1>
      <p styleName="details">
        The resource you are looking for does not exist in Topcoder community App :(
      </p>
    </div>
  );
}

Page404.defaultProps = {
  children: null,
};

Page404.propTypes = {
  children: PT.node,
};
