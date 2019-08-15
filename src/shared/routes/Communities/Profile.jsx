/**
 * The loader of Profile webpack chunks.
 */
import _ from 'lodash';
import path from 'path';
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ProfileLoader(props) {
  return (
    <AppChunk
      chunkName="profile/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "profile/chunk" */ 'containers/Profile')
        .then(({ default: ProfileContainer }) => {
          const { meta } = props;
          let communityGroupIds = _.get(meta, 'challengeFilter.groupIds', []);
          if (communityGroupIds.length === 0) {
            communityGroupIds = _.get(meta, 'fullCommunityInfo.challengeFilter.groupIds', []);
          }
          if (!communityGroupIds.length) {
            // show loading if community list haven't loaded yet
            return (<LoadingPagePlaceholder />);
          }
          return (
            <ProfileContainer
              {...props}
              communityGroupIds={communityGroupIds}
            />
          );
        })
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/Profile');
        const ProfileContainer = webpack.requireWeak(path.resolve(__dirname, p));
        return <ProfileContainer {...props} />;
      }}
    />
  );
}
