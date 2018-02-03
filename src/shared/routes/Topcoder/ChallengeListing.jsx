/* TODO: Despite this code, the challenge-listing code is not splitted into
 * a separate chunk, because it is also used inside communities code, where
 * he is embed in such way, that codesplitting is not easy (we need to refactor
 * communities code to code-split it). */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
// import path from 'path';
import qs from 'qs';
import React from 'react';
// import { StaticRouter } from 'react-router-dom';
import { /* requireWeak, resolveWeak, */ SplitRoute } from 'utils/router';

export default function ChallengeListingRoute() {
  return (
    <SplitRoute
      cacheCss
      chunkName="challenge-listing/chunk"
      renderClientAsync={renderProps =>
        import(
          /* webpackChunkName: "challenge-listing/chunk" */
          'containers/challenge-listing/Listing',
        ).then(({ default: ChallengeListing }) => {
          /* TODO: Choice of currency and prize mode should be moved to
           * Redux actions / reducers. */
          const query = renderProps.location.search ?
            qs.parse(renderProps.location.search.slice(1)) : null;
          const currencyFromUrl = _.get(query, 'currency');
          const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;
          return (
            <ChallengeListing
              {...renderProps}
              listingOnly
              newChallengeDetails
              prizeMode={prizeMode}
              queryBucket={_.get(query, 'bucket')}
            />
          );
        })
      }
      renderPlaceholder={() => <LoadingIndicator />}
      /*
        TODO: Making server-side rendering work demands some more efforts
        with reducers coding.
      renderServer={(renderProps) => {
        const p = resolveWeak('containers/challenge-listing/Listing');
        const ChallengeListing = requireWeak(path.resolve(__dirname, p));
        /* TODO: Choice of currency and prize mode should be moved to
           * Redux actions / reducers. *//*
        const query = renderProps.location.search ?
          qs.parse(renderProps.location.search.slice(1)) : null;
        const currencyFromUrl = _.get(query, 'currency');
        const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;
        return (
          <StaticRouter
            context={renderProps.staticContext}
            location={renderProps.location.pathname}
          >
            <ChallengeListing
              {...renderProps}
              listingOnly
              prizeMode={prizeMode}
            />
          </StaticRouter>
        );
      }}
      */
    />
  );
}
