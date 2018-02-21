import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import Card from './Card';

import './style.scss';

export default function Communities({
  communities,
  communitiesLoading,
  communityStats,
  userGroups,
}) {
  if (communitiesLoading) {
    return (
      <div styleName="loading">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div styleName="container">
      {
        communities.map((c) => {
          const stats = communityStats[c.communityId] || {};
          console.log(userGroups, c.groupIds);
          return (
          /* !this.state.showMyCommunityOnly || this.isCommunityRegstered(c)) && */
            <div key={c.communityId}>
              <Card
                community={c}
                stats={stats.data}
                statsLoading={Boolean(stats.loadingUuid)}
                registered={_.intersection(userGroups, c.groupIds).length}
              />
            </div>
          );
        })
      }
    </div>
  );
}

Communities.propTypes = {
  communities: PT.arrayOf(PT.object).isRequired,
  communitiesLoading: PT.bool.isRequired,
  communityStats: PT.shape().isRequired,
  userGroups: PT.arrayOf(PT.object).isRequired,
};
