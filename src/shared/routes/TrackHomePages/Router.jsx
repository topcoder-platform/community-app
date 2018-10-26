/**
 * Routes for Track Homepages.
 */

import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';
import HowToCompetePage from 'containers/TrackHomePages/HowToCompetePage';
import Error404 from 'components/Error404';
import ContentfulRoute from 'components/Contentful/Route';

import './styles.scss';

export default function Router({ base }) {
  return (
    <div styleName="container">
      <Header />
      <Switch>
        <Route component={HowToCompetePage} exact path={`${base}/:track/how-to-compete`} />
        <ContentfulRoute
          path="/community/development"
          error404={<Error404 />}
          id="5PXvEtYyzYiymmIMmqscOW"
        />
        <ContentfulRoute
          path="/community/design"
          error404={<Error404 />}
          id="1eWAOHbJKAEeYYiaOgom0Y"
        />
        <ContentfulRoute
          path="/community/data-science"
          error404={<Error404 />}
          id="1ddrkXopd8426Cg0Uaewg"
        />
        <ContentfulRoute
          path="/community/competitive-programming"
          error404={<Error404 />}
          id="1yqABWBQ44aUoGKYISCaOU"
        />
        <Error404 />
      </Switch>
      <Footer />
    </div>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
