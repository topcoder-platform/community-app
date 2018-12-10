/**
 * Routing of Wipro Community.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import Error404 from 'components/Error404';
import FAQ from 'components/tc-communities/communities/zurich/FAQ';
import Footer from 'components/tc-communities/communities/zurich/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/zurich/Home';
import Learn from 'components/tc-communities/communities/zurich/Learn';
import ContentfulRoute from 'components/Contentful/Route';
import PT from 'prop-types';
import React from 'react';
import theme from 'components/tc-communities/communities/zurich/theme';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';

function Zurich({ base, meta, userGroups }) {
  // Only members of `Requestor`|`Approver` gropus
  // should can see catalog with links to connect
  const isRequestorOrApprover = userGroups ? _.intersection(
    _.map(userGroups, 'id'),
    meta.authorizedGroupIdsCatalog,
  ) : [];
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={theme}>
          <div>
            <Header
              baseUrl={base}
              pageId={match.params.pageId || 'home'}
              hideJoinNow
            />
            <Switch>
              <Route
                component={FAQ}
                exact
                path={`${base}/faq`}
              />
              <Route
                component={Learn}
                exact
                path={`${base}/learn`}
              />
              <Route
                component={Home}
                exact
                path={`${base}/home`}
              />
              <Route
                component={Home}
                exact
                path={`${base || '/'}`}
              />
              {
                isRequestorOrApprover.length ? (
                  // Catalog with connect links
                  <ContentfulRoute
                    baseUrl={base}
                    error404={<Error404 />}
                    id="6UGl6F62ligIKMwGAySSEw"
                    spaceName="zurich"
                  />
                ) : (
                  // Catalog with competitor links
                  <ContentfulRoute
                    baseUrl={base}
                    error404={<Error404 />}
                    id="40GWKfk1jaGqGMe4qymU0i"
                    spaceName="zurich"
                  />
                )
              }
              <Route
                component={Error404}
                path={`${base}/:any`}
              />
            </Switch>
            <Footer />
          </div>
        </ThemeProvider>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

Zurich.defaultProps = {
  base: '',
};

Zurich.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
  userGroups: PT.arrayOf(PT.shape()).isRequired,
};

export default connect(state => ({
  userGroups: state.auth.profile ? state.auth.profile.groups : null,
}))(Zurich);
