/**
 * Groups together all routes related to the main Topcoder website.
 * As we do not use any special prefix for such routes, this group of routes
 * always matches, renders the standard Topcoder header and footer, and the
 * content of the route, or the HTTP 404 page.
 */

import Error404 from 'components/Error404';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';

import React from 'react';
import { Switch } from 'react-router-dom';

import ChallengeDetails from './ChallengeDetails';
import ChallengeListing from './ChallengeListing';
import Dashboard from './Dashboard';
import SubmissionManagement from './SubmissionManagement';

export default function Topcoder() {
  return (
    <div>
      <Header />
      <Switch>
        {ChallengeDetails()}
        {ChallengeListing({ listingOnly: true })}
        {Dashboard()}
        {SubmissionManagement()}
        <Error404 />
      </Switch>
      <Footer />
    </div>
  );
}
