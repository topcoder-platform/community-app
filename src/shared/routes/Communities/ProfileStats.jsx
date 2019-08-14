/**
 * The loader of Profile webpack chunks.
 */
import React from 'react';
import _ from 'lodash';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk } from 'topcoder-react-utils';

export default function ProfileStatsRoute(props) {
  return (
    <AppChunk
      chunkName="profileStats/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "profileStats/chunk" */ 'containers/ProfileStats')
        .then(({ default: ProfileStatsContainer }) => {
          const { meta } = props;
          let communityGroupIds = _.get(meta, 'challengeFilter.groupIds', []);
          if (communityGroupIds.length === 0) {
            communityGroupIds = _.get(meta, 'fullCommunityInfo.challengeFilter.groupIds', []);
          }
          return (
            <ProfileStatsContainer
              {...props}
              communityGroupIds={communityGroupIds}
            />
          );
        })
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
