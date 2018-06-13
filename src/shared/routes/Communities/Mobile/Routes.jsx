/**
 * Routing of Mobile Community.
 */

/* TODO: This assembly of custom challenge listing page should be split out into
 * a separate component. But, it is good enough for now. */
import Error404 from 'components/Error404';
import Footer from 'components/tc-communities/Footer2';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/mobile/Home';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'react-css-super-themr';
import { config, MetaTags } from 'topcoder-react-utils';

import primaryButtonStyle from 'components/buttons/outline/round/open-sans/green-uppercase.scss';
import secondaryButtonStyle from 'components/buttons/outline/round/open-sans/blue-uppercase.scss';

export default function Mobile({ base }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={{
          PrimaryButton: primaryButtonStyle,
          SecondaryButton: secondaryButtonStyle,
        }}
        >
          <div>
            <MetaTags
              description="Topcoder community of mobile experts"
              siteName="Topcoder Mobile Community"
              title="Topcoder Mobile Community"
              url={config.URL.COMMUNITIES.MOBILE}
            />
            <Header
              baseUrl={base}
              hideJoinNow
              pageId={match.params.pageId || 'home'}
            />
            <Switch>
              <Route
                component={Home}
                exact
                path={`${base}/home`}
              />
              <Route
                component={Home}
                exact
                path={`${base}`}
              />
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

Mobile.defaultProps = {
  base: '',
};

Mobile.propTypes = {
  base: PT.string,
};
