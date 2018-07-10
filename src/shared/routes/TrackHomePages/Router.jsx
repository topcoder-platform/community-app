/**
 * Routes for Track Homepages.
 */

import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';
import HomePage from 'containers/TrackHomePages/HomePage';
import HowToCompetePage from 'containers/TrackHomePages/HowToCompetePage';
import Error404 from 'components/Error404';

import './styles.scss';

export default function Router({ base }) {
  return (
    <div styleName="container">
      <Header />
      <Switch>
        <Route component={HowToCompetePage} exact path={`${base}/:track/how-to-compete`} />
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
