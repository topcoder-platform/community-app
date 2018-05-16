/**
 * Routing of IoT Community.
 */

import Error404 from 'components/Error404';
import Footer from 'components/tc-communities/Footer2';
import FooterLogos from 'components/tc-communities/FooterLogos';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/iot/Home';
import GetStarted from 'containers/tc-communities/iot/GetStarted';
import About from 'containers/tc-communities/iot/About';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'react-css-super-themr';

import primaryButtonStyle from 'components/buttons/outline/round/open-sans/blue-uppercase.scss';
import secondaryButtonStyle from 'components/buttons/outline/round/open-sans/default.scss';
import sectionStyle from 'components/tc-communities/communities/iot/themes/section.scss';

import geLogoSrc from 'assets/themes/iot/ge-footer-logo.png';

const logos = [
  { img: geLogoSrc, url: 'http://www.ge.com/digital/' },
];

export default function IoT({ base }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={{
          PrimaryButton: primaryButtonStyle,
          SecondaryButton: secondaryButtonStyle,
          'tcCommunities-Section': sectionStyle,
        }}
        >
          <div>
            <Header
              baseUrl={base}
              hideJoinNow
              pageId={match.params.pageId || 'home'}
            />
            <Switch>
              <Route
                component={() => <Home baseUrl={base} />}
                exact
                path={`${base}/home`}
              />
              <Route
                component={() => <GetStarted baseUrl={base} />}
                exact
                path={`${base}/get-started`}
              />
              <Route
                component={() => <About baseUrl={base} />}
                exact
                path={`${base}/about`}
              />
              <Route
                component={Error404}
                path={`${base}/:any`}
              />
              <Route
                component={() => <Home baseUrl={base} />}
                exact
                path={`${base}`}
              />
            </Switch>
            <Footer />
            <FooterLogos logos={logos} />
          </div>
        </ThemeProvider>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

IoT.defaultProps = {
  base: '',
};

IoT.propTypes = {
  base: PT.string,
};
