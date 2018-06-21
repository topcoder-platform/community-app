/**
 * Routes for Track Homepages.
 */

import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';
import HomePage from 'containers/TrackHomePages/HomePage';
import HowToCompletePage from 'containers/TrackHomePages/HowToCompletePage';
import Error404 from 'components/Error404';

import './styles.scss';

export default function Router({ base }) {
  return (
    <div styleName="container">
      <Header />
      <Switch>
        <Route component={HowToCompletePage} exact path={`${base}/:track/how-to-complete`} />
        <Route component={HomePage} exact path={`${base}/:track`} />
        <Error404 />
      </Switch>
      <Footer />
    </div>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
