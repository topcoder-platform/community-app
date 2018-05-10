/**
 * The loader of Profile webpack chunks.
 */
import path from 'path';
import React from 'react';
import PT from 'prop-types';

import LoadingIndicator from 'components/LoadingIndicator';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function Statistics(props) {
  const base = props.match.url;
  
  return (
    <Switch>
      <AppChunk
        chunkName="profile/chunk"
        path={`${base}/`}
        renderClientAsync={() =>
          import(/* webpackChunkName: "profile/chunk" */ 'containers/Statistics')
            .then(({ default: StatisticsContainer }) => (
                <StatisticsContainer {...props} />
            ))
        }
        renderPlaceholder={() => <LoadingIndicator />}
      />
    </Switch>
  );
}

Statistics.propTypes = {
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
