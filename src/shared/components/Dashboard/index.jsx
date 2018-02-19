import PT from 'prop-types';
import React from 'react';

import CommunityBlog from './CommunityBlog';
import MemberMetrics from './MemberMetrics';
import Header from './Header';

import './style.scss';

export default function Dashboard({
  achievements,
  achievementsLoading,
  finances,
  financesLoading,
  showEarnings,
  stats,
  statsLoading,
  switchShowEarnings,
  tcBlogLoading,
  tcBlogPosts,
}) {
  return (
    <div styleName="container">
      <div styleName="page">
        <Header
          achievements={achievements}
          achievementsLoading={achievementsLoading}
        />
        <MemberMetrics
          finances={finances}
          financesLoading={financesLoading}
          showEarnings={showEarnings}
          stats={stats}
          statsLoading={statsLoading}
          switchShowEarnings={switchShowEarnings}
        />
      {/*}
        achievements={achievements} myChallenges={myChallenges.length} />
        <div styleName="my-dashboard-container">
          {
            st.announcementId ? (
              <Announcement id={st.announcementId} />
            ) : null
          }
          <div styleName="subtrack-stats">
            {
              loadingSubtrackRanks &&
              <LoadingIndicator theme={{}} />
            }
            {
              !loadingSubtrackRanks &&
              <SubtrackStats subtracks={subtrackRanks} handle={user ? user.handle : ''} />
            }
          </div>
          <div styleName="challenges">
            {
              loadingActiveChallenges &&
              <LoadingIndicator theme={{}} />
            }
            {
              !loadingActiveChallenges &&
              <MyChallenges
                challenges={myChallenges}
                communityList={communityList}
                stats={stats}
                groups={profile ? profile.groups : []}
              />
            }
          </div>
          <div styleName="tco tco17">
            <div styleName="tc-banner-placeholder cognitive">
              <div styleName="container">
                <div styleName="img" />
                <div styleName="description">
                  Learn about Cognitive technologies and get hands on
                  experience as a member of the Topcoder Cognitive Community.
                </div>
                <a
                  href={config.URL.COMMUNITIES.COGNITIVE}
                  styleName="cta tc-btn-white tc-btn-radius"
                >Learn More</a>
              </div>
            </div>
          </div>
          <div styleName="tco tco17">
            <div styleName="tc-banner-placeholder black bg-image">
              <div styleName="container">
                <div styleName="title">2017 Topcoder Open</div>
                <div styleName="subtitle">October 21-24, 2017 <br /> Buffalo, NY, USA</div>
                <div styleName="description">
                  The Ultimate Programming and Design Tournament - The Final Stage</div>
                <a href={config.URL.TCO17} styleName="cta tc-btn-radius tc-btn-white">
                  Learn More
                </a>
              </div>
            </div>
          </div>
          <div styleName="srms">
            {
              loadingSRMs &&
              <LoadingIndicator theme={{}} />
            }
            {
              !loadingSRMs &&
              <SRM srms={srms} />
            }
          </div>
          <div styleName="programs">
            {
              loadingActiveChallenges &&
              <LoadingIndicator theme={{}} />
            }
            {
              !loadingActiveChallenges &&
              <Program
                challenges={iosChallenges.slice(0, 3)}
                iosRegistered={iosRegistered}
                registerIos={() => registerIos(tokenV3, user.userId)}
              />
            }
          </div>
          <div styleName="community-updates">
            <LoadingIndicator />
            {
              !loadingBlogs &&
              <CommunityUpdates blogs={blogs} />
            }
          </div>
        </div>
          */}
        <CommunityBlog isLoading={tcBlogLoading} posts={tcBlogPosts} />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  achievements: PT.arrayOf(PT.object).isRequired,
  achievementsLoading: PT.bool.isRequired,
  finances: PT.arrayOf(PT.object).isRequired,
  financesLoading: PT.bool.isRequired,
  showEarnings: PT.bool.isRequired,
  stats: PT.shape().isRequired,
  statsLoading: PT.bool.isRequired,
  switchShowEarnings: PT.func.isRequired,
  tcBlogLoading: PT.bool.isRequired,
  tcBlogPosts: PT.arrayOf(PT.object).isRequired,
};
