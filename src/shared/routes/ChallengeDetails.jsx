/**
 * The loader of Challenge Details Page code chunks.
 * It is re-used both inside the Main Topcoder Community website, and inside
 * other Topcoder Communities, as, at the moment, no difference in the loader
 * code is necessary between these two usecases.
 */

import _ from 'lodash';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import React from 'react';
import qs from 'qs';
import { AppChunk } from 'topcoder-react-utils';

export default function ChallengeDetailsRoute(props) {
  return (
    <AppChunk
      chunkName="challenge-details/chunk"
      renderClientAsync={renderProps => import(/* webpackChunkName: "challenge-details/chunk" */ 'containers/challenge-detail')
        .then(({ default: ChallengeDetails }) => {
          /* TODO: Choice of currency and prize mode should be moved to
           * Redux actions / reducers. */
          const query = renderProps.location.search
            ? qs.parse(renderProps.location.search.slice(1)) : null;
          const currencyFromUrl = _.get(query, 'currency');
          const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;
          const newProps = { ...props, ...{ prizeMode } };
          return (
            <ChallengeDetails {...newProps} />
          );
        })
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
