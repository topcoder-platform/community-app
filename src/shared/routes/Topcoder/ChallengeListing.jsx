/* TODO: Despite this code, the challenge-listing code is not splitted into
 * a separate chunk, because it is also used inside communities code, where
 * he is embed in such way, that codesplitting is not easy (we need to refactor
 * communities code to code-split it). */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import qs from 'qs';
import React from 'react';
import moment from 'moment';
import { SplitRoute } from 'utils/router';
import { updateQuery } from 'utils/url';

export default function ChallengeListingRoute() {
  return (
    <SplitRoute
      cacheCss
      chunkName="challenge-listing"
      renderClientAsync={renderProps =>
        import(
          /* webpackChunkName: "challenge-listing" */
          'containers/challenge-listing/Listing',
        ).then(({ default: ChallengeListing }) => {
          const query = renderProps.location.search ?
            qs.parse(renderProps.location.search.slice(1)) : null;

          /* TODO: This validation of start and end dates from query params
           * does the trick of removing invalid dates from URL at the client
           * side, but it actually should be done in the reducer as well. */
          if (query.filter && query.filter.startDate
          && !moment(query.filter.startDate).isValid()) {
            delete query.filter.startDate;
          }
          if (query.filter && query.filter.endDate
          && !moment(query.filter.endDate).isValid()) {
            delete query.filter.endDate;
          }
          updateQuery({ filter: query.filter });

          const currencyFromUrl = _.get(query, 'currency');
          const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;
          return (
            <ChallengeListing
              {...renderProps}
              listingOnly
              prizeMode={prizeMode}
            />
          );
        })
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
