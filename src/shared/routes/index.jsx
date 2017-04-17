/**
 * The top-level routing of the App.
 */

import Content from 'components/examples/Content';
import Error404 from 'components/Error404';
import SubmissionManagement from 'containers/SubmissionManagement';
import 'isomorphic-fetch';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TopcoderFooter from 'components/TopcoderFooter';
import TopcoderHeader from 'containers/TopcoderHeader';

/* TODO: As we move towards production deploy, we should add a guard which
 * will prevent addition of /examples routes into production build. */
import Examples from './examples';

export default function Routes() {
  return (
    <div>
      <Route path="/challenge" component={TopcoderHeader} />
      <Switch>
        <Route exact path="/" component={Content} />
        <Route exact path="/examples" component={Content} />
        <Route path="/examples" component={Examples} />
        <Route path="/challenge/:challengeId/my-submissions" component={SubmissionManagement} />
        <Route component={Error404} />
      </Switch>
      <Route path="/challenge" component={TopcoderFooter} />
    </div>
  );
}
