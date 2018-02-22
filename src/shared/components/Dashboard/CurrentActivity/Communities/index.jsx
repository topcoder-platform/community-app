import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import Card from './Card';

import './style.scss';

export default function Communities({
  communities,
  communitiesLoading,
  communityStats,
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
        communities.length ? (
          communities.map((c) => {
            const stats = communityStats[c.communityId] || {};
            return (
            /* !this.state.showMyCommunityOnly || this.isCommunityRegstered(c)) && */
              <div key={c.communityId}>
                <Card
                  community={c}
                  stats={stats.data}
                  statsLoading={Boolean(stats.loadingUuid)}
                  registered
                />
              </div>
            );
          })
        ) : (
          <div styleName="msg">
            You have not joined any Topcoder sub-community yet.
          </div>
        )
      }
    </div>
  );
}

Communities.propTypes = {
  communities: PT.arrayOf(PT.object).isRequired,
  communitiesLoading: PT.bool.isRequired,
  communityStats: PT.shape().isRequired,
};
