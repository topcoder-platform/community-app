/**
 * Routing of Mobile Community.
 */

import ChallengeListing from 'routes/Communities/ChallengeListing';
import ContentfulRoute from 'components/Contentful/Route';
import Footer from 'components/tc-communities/Footer2';
import Header from 'containers/tc-communities/Header';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'react-css-super-themr';
import { config, MetaTags } from 'topcoder-react-utils';

import primaryButtonStyle from 'components/buttons/outline/round/open-sans/green-uppercase.scss';
import secondaryButtonStyle from 'components/buttons/outline/round/open-sans/blue-uppercase.scss';

export default function Mobile({ base, meta }) {
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
                component={() => (
                  <div>
                    {
                      ChallengeListing({
                        challengesUrl: `${base}/challenges`,
                        meta,
                        listingOnly: true,
                        newChallengeDetails: true,
                      })
                  }
                  </div>
                )}
                exact
                path={`${base}/challenges`}
              />
              <ContentfulRoute
                baseUrl={base}
                id="5iTZIKlrYQUSQCs0cU6WuO"
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
  meta: {},
};

Mobile.propTypes = {
  base: PT.string,
  meta: PT.shape({}),
};
