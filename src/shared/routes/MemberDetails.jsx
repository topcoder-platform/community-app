/**
 * The loader of Member Details Page code chunks.
 * It is re-used both inside the Main Topcoder Community website, and inside
 * other Topcoder Communities, as, at the moment, no difference in the loader
 * code is necessary between these two usecases.
 */

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function MemberDetailsRoute(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="member-details/chunk"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "member-details/chunk" */
          'containers/member-detail',
        ).then(({ default: MemberDetails }) => (
          <MemberDetails {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = resolveWeak('containers/member-detail');
        const MemberDetails = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter context={{}}>
            <MemberDetails {...props} />
          </StaticRouter>
        );
      }}
    />
  );
}
