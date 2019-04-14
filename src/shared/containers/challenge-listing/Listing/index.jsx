/**
 * This is a container component for ChallengeFiltersExample.
 * It represents community-challenge-listing page.
 *
 * ChallengeFiltersExample component was brought from another project with different approach
 * and it takes care about everything it needs by itself.
 * So this container components almost doing nothing now.
 * Though this component defines a master filter function
 * which is used to define which challenges should be listed for the certain community.
 */

import _ from 'lodash';
import challengeDetailsActions from 'actions/page/challenge-details';
import filterPanelActions from 'actions/challenge-listing/filter-panel';
import headerActions from 'actions/topcoder_header';
import { logger, actions } from 'topcoder-react-lib';
import React from 'react';
import PT from 'prop-types';
import shortId from 'shortid';
import { connect } from 'react-redux';
import ChallengeListing from 'components/challenge-listing';
import Banner from 'components/tc-communities/Banner';
import sidebarActions from 'actions/challenge-listing/sidebar';
import communityActions from 'actions/tc-communities';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { MetaTags } from 'topcoder-react-utils';
import { USER_GROUP_MAXAGE } from 'config';

import ogImage from '../../../../assets/images/og_image.jpg';
import style from './styles.scss';

let mounted = false;

const SEO_PAGE_TITLE = 'Topcoder Challenges';

export class ListingContainer extends React.Component {
  componentDidMount() {
    const {
      activeBucket,
      auth,
      communitiesList,
      communityId,
      getCommunitiesList,
      markHeaderMenu,
      selectBucket,
      selectCommunity,
      queryBucket,
    } = this.props;

    markHeaderMenu();

    if (queryBucket !== activeBucket && _.includes(BUCKETS, queryBucket)) {
      selectBucket(queryBucket);
    }

    if (!communitiesList.loadingUuid
    && (Date.now() - communitiesList.timestamp > USER_GROUP_MAXAGE)) {
      getCommunitiesList(auth);
    }

    if (communityId) {
      selectCommunity(communityId);
    }

    if (mounted) {
      logger.error('Attempt to mount multiple instances of ChallengeListingPageContainer at the same time!');
    } else mounted = true;
    this.loadChallenges();
  }

  componentDidUpdate(prevProps) {
    const {
      auth,
      dropChallenges,
      getCommunitiesList,
      allActiveChallengesLoaded,
      getRestActiveChallenges,
      meta,
      loadingActiveChallengesUUID,
      loadingRestActiveChallengesUUID,
      getttingMoreChallenges,
    } = this.props;

    const oldFilter = _.get(prevProps, 'filter');
    const filter = _.get(this.props, 'filter');

    const oldCommunityId = _.get(prevProps, 'selectedCommunityId');
    const newCommunityId = _.get(this.props, 'selectedCommunityId');
    const filterChanged = !_.isEqual(oldFilter, filter) || newCommunityId !== oldCommunityId;

    if (filterChanged) {
      dropChallenges();
      this.loadChallenges();
    }

    const oldUserId = _.get(prevProps, 'auth.user.userId');
    const userId = _.get(this.props, 'auth.user.userId');
    if (userId !== oldUserId) {
      getCommunitiesList(auth);
    }

    const { profile } = auth;
    if (profile) {
      if (!prevProps.auth.profile) setImmediate(() => this.loadChallenges());
    } else if (prevProps.auth.profile) {
      setImmediate(() => {
        dropChallenges();
        this.loadChallenges();
      });
    }

    // To speed up the app, add getttingMoreChallenges condition
    // only set it true after user clicking 'View more challenges'
    // or switching bucket
    if (
      !loadingActiveChallengesUUID
        && !loadingRestActiveChallengesUUID
        && !_.isEmpty(meta)
        && !allActiveChallengesLoaded
        && getttingMoreChallenges
    ) {
      const f = this.getBackendFilter();
      getRestActiveChallenges(auth.tokenV3, f.back, f.front);
    }
  }

  componentWillUnmount() {
    if (mounted) mounted = false;
    else {
      logger.error('A mounted instance of ChallengeListingPageContainer is not tracked as mounted!');
    }
    if (this.autoRefreshTimerId) clearTimeout(this.autoRefreshTimerId);
  }


  /* Evaluates the backend challenge filter most suitable for the current state
   * of the active frontend filters. */
  getBackendFilter() {
    const { filter } = this.props;
    const b = this.mappedFilter();
    return {
      back: b,
      front: filter,
    };
  }

  // transform frontend filter to backend filter
  mappedFilter() {
    const {
      filter,
      communityFilters,
      selectedCommunityId,
    } = this.props;

    const f = {};
    if (!filter) {
      return f;
    }
    if (filter.tags) {
      f.keywords = filter.tags.join(',');
    }
    if (filter.subtracks) {
      f.subTrack = filter.subtracks.join(',');
    }
    if (filter.tracks) {
      const tracks = Object.keys(filter.tracks).map(t => t.toUpperCase());
      f.track = tracks.join(',');
    }
    if (filter.text) {
      f.name = filter.text;
    }

    // when backend can support date range, comment in the next lines
    // if (filter.startDate) {
    //     f.startDate = filter.startDate.slice(0, 10);
    // }
    // if (filter.endDate) {
    //     f.endDate = filter.endDate.slice(0, 10);
    // }

    if (selectedCommunityId !== '') {
      const c = communityFilters.find(item => item.communityId === selectedCommunityId);
      if (c) {
        const cf = c.challengeFilter;
        if (cf.or) {
          // use tags
          let t = cf.or.join(',');
          if (f.keywords) {
            t = `${f.keywords},${t}`;
          }
          f.keywords = t;
        } else if (cf.groupIds && cf.groupIds.length !== 0) {
          // use group ids
          f.groupIds = cf.groupIds.join(',');
        }
      }
    }

    return f;
  }

  loadMoreChallenges() {
    const {
      getMoreChallenges,
      allActiveChallengesLoaded,
    } = this.props;
    if (!allActiveChallengesLoaded) {
      getMoreChallenges();
    }
  }

  loadChallenges() {
    const {
      auth,
      getActiveChallenges,
    } = this.props;
    const f = this.getBackendFilter();
    // only load the first page
    getActiveChallenges(
      0,
      f.back,
      auth.tokenV3,
      f.front,
    );
  }

  render() {
    const {
      auth,
      allPastChallengesLoaded,
      allReviewOpportunitiesLoaded,
      activeBucket,
      ChallengeListingBanner,
      challenges,
      challengesUrl,
      challengeSubtracks,
      challengeTags,
      communityFilters,
      communityId,
      communityName,
      defaultCommunityId,
      expandTag,
      expandedTags,
      extraBucket,
      filter,
      groupIds,
      getPastChallenges,
      getReviewOpportunities,
      hideSrm,
      keepPastPlaceholders,
      lastRequestedPageOfPastChallenges,
      lastRequestedPageOfReviewOpportunities,
      lastUpdateOfActiveChallenges,
      loadingActiveChallengesUUID,
      loadingPastChallengesUUID,
      loadingReviewOpportunitiesUUID,
      listingOnly,
      newChallengeDetails,
      openChallengesInNewTabs,
      preListingMsg,
      prizeMode,
      reviewOpportunities,
      selectBucket,
      selectChallengeDetailsTab,
      selectedCommunityId,
      setFilter,
      setSearchText,
      setSort,
      sorts,
      hideTcLinksInSidebarFooter,
    } = this.props;

    const { tokenV3 } = auth;

    let loadMorePast;
    if (!allPastChallengesLoaded) {
      loadMorePast = () => {
        const f = this.getBackendFilter();
        getPastChallenges(
          1 + lastRequestedPageOfPastChallenges,
          f.back,
          tokenV3,
          f.front,
        );
      };
    }

    let loadMoreReviewOpportunities;
    if (!allReviewOpportunitiesLoaded) {
      loadMoreReviewOpportunities = () => getReviewOpportunities(
        1 + lastRequestedPageOfReviewOpportunities, tokenV3,
      );
    }

    let communityFilter = communityFilters.find(item => item.communityId === selectedCommunityId);
    if (communityFilter) communityFilter = communityFilter.challengeFilter;

    const description = 'Join Topcoder and compete in these challenges, to learn and earn!';

    let banner;
    if (!listingOnly) {
      banner = ChallengeListingBanner ? (
        <ChallengeListingBanner />
      ) : (
        <Banner
          title="Challenges"
          text="Browse our available challenges and compete."
          theme={{
            container: style.bannerContainer,
            content: style.bannerContent,
            contentInner: style.bannerContentInner,
          }}
          imageSrc="/community-app-assets/themes/wipro/challenges/banner.jpg"
        />
      );
    }

    return (
      <div styleName="container">
        <MetaTags
          description={description}
          image={ogImage}
          siteName="Topcoder"
          title={communityId ? `${communityName} Challenges` : SEO_PAGE_TITLE}
        />
        {banner}
        <ChallengeListing
          activeBucket={activeBucket}
          challenges={challenges}
          challengeSubtracks={challengeSubtracks}
          challengeTags={challengeTags}
          challengesUrl={challengesUrl}
          communityFilter={communityFilter}
          communityName={communityName}
          defaultCommunityId={defaultCommunityId}
          expandedTags={expandedTags}
          expandTag={expandTag}
          extraBucket={extraBucket}
          filterState={filter}
          hideSrm={hideSrm}
          hideTcLinksInFooter={hideTcLinksInSidebarFooter}
          keepPastPlaceholders={keepPastPlaceholders}
          lastUpdateOfActiveChallenges={lastUpdateOfActiveChallenges}
          loadingChallenges={Boolean(loadingActiveChallengesUUID)}
          loadingPastChallenges={Boolean(loadingPastChallengesUUID)}
          loadingReviewOpportunities={Boolean(loadingReviewOpportunitiesUUID)}
          newChallengeDetails={newChallengeDetails}
          openChallengesInNewTabs={openChallengesInNewTabs}
          preListingMsg={preListingMsg}
          prizeMode={prizeMode}
          selectBucket={selectBucket}
          selectChallengeDetailsTab={selectChallengeDetailsTab}
          selectedCommunityId={selectedCommunityId}
          loadMorePast={loadMorePast}
          loadMoreReviewOpportunities={loadMoreReviewOpportunities}
          loadMoreChallenges={() => this.loadMoreChallenges()}
          reviewOpportunities={reviewOpportunities}
          setFilterState={(state) => {
            setFilter(state);
            setSearchText(state.text || '');
            if (activeBucket === BUCKETS.SAVED_FILTER) {
              selectBucket(BUCKETS.ALL);
            } else if (activeBucket === BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER) {
              selectBucket(BUCKETS.REVIEW_OPPORTUNITIES);
            }
          }}
          setSort={setSort}
          sorts={sorts}
          groupIds={groupIds}
          auth={auth}
        />
      </div>
    );
  }
}

ListingContainer.defaultProps = {
  ChallengeListingBanner: null,
  defaultCommunityId: '',
  extraBucket: null,
  hideSrm: false,
  selectedCommunityId: '',
  groupIds: [''],
  hideTcLinksInSidebarFooter: false,
  challengesUrl: '/challenges',
  communityId: null,
  communityName: null,
  listingOnly: false,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  preListingMsg: null,
  prizeMode: 'money-usd',
  queryBucket: BUCKETS.ALL,
  meta: {},
};

ListingContainer.propTypes = {
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
  allActiveChallengesLoaded: PT.bool.isRequired,
  allPastChallengesLoaded: PT.bool.isRequired,
  allReviewOpportunitiesLoaded: PT.bool.isRequired,
  ChallengeListingBanner: PT.node,
  challenges: PT.arrayOf(PT.shape({})).isRequired,
  challengesUrl: PT.string,
  challengeSubtracks: PT.arrayOf(PT.shape()).isRequired,
  challengeTags: PT.arrayOf(PT.string).isRequired,
  communitiesList: PT.shape({
    data: PT.arrayOf(PT.shape({
      challengeFilter: PT.shape(),
      communityId: PT.string.isRequired,
    })).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
  defaultCommunityId: PT.string,
  dropChallenges: PT.func.isRequired,
  filter: PT.shape().isRequired,
  hideSrm: PT.bool,
  hideTcLinksInSidebarFooter: PT.bool,
  communityId: PT.string,
  communityName: PT.string,
  communityFilters: PT.arrayOf(PT.object).isRequired,
  extraBucket: PT.string,
  getActiveChallenges: PT.func.isRequired,
  getRestActiveChallenges: PT.func.isRequired,
  getCommunitiesList: PT.func.isRequired,
  getPastChallenges: PT.func.isRequired,
  getReviewOpportunities: PT.func.isRequired,
  keepPastPlaceholders: PT.bool.isRequired,
  lastRequestedPageOfPastChallenges: PT.number.isRequired,
  lastRequestedPageOfReviewOpportunities: PT.number.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingActiveChallengesUUID: PT.string.isRequired,
  loadingPastChallengesUUID: PT.string.isRequired,
  loadingReviewOpportunitiesUUID: PT.string.isRequired,
  loadingRestActiveChallengesUUID: PT.string.isRequired,
  markHeaderMenu: PT.func.isRequired,
  newChallengeDetails: PT.bool,
  openChallengesInNewTabs: PT.bool,
  preListingMsg: PT.node,
  prizeMode: PT.string,
  reviewOpportunities: PT.arrayOf(PT.shape()).isRequired,
  selectBucket: PT.func.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  selectCommunity: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  activeBucket: PT.string.isRequired,
  selectedCommunityId: PT.string,
  sorts: PT.shape().isRequired,
  setSearchText: PT.func.isRequired,
  setSort: PT.func.isRequired,
  listingOnly: PT.bool,
  groupIds: PT.arrayOf(PT.string),
  expandedTags: PT.arrayOf(PT.number).isRequired,
  expandTag: PT.func.isRequired,
  queryBucket: PT.string,
  meta: PT.shape(),
  getttingMoreChallenges: PT.bool.isRequired,
  getMoreChallenges: PT.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const cl = state.challengeListing;
  const tc = state.tcCommunities;
  return {
    auth: state.auth,
    allActiveChallengesLoaded: cl.allActiveChallengesLoaded,
    allPastChallengesLoaded: cl.allPastChallengesLoaded,
    allReviewOpportunitiesLoaded: cl.allReviewOpportunitiesLoaded,
    filter: cl.filter,
    challenges: cl.challenges,
    challengeSubtracks: cl.challengeSubtracks,
    challengeTags: cl.challengeTags,
    communitiesList: tc.list,
    communityFilters: tc.list.data,
    domain: state.domain,
    extraBucket: ownProps.extraBucket,
    hideTcLinksInSidebarFooter: ownProps.hideTcLinksInSidebarFooter,
    keepPastPlaceholders: cl.keepPastPlaceholders,
    lastRequestedPageOfActiveChallenges: cl.lastRequestedPageOfActiveChallenges,
    lastRequestedPageOfPastChallenges: cl.lastRequestedPageOfPastChallenges,
    lastRequestedPageOfReviewOpportunities: cl.lastRequestedPageOfReviewOpportunities,
    lastUpdateOfActiveChallenges: cl.lastUpdateOfActiveChallenges,
    loadingActiveChallengesUUID: cl.loadingActiveChallengesUUID,
    loadingRestActiveChallengesUUID: cl.loadingRestActiveChallengesUUID,
    loadingPastChallengesUUID: cl.loadingPastChallengesUUID,
    loadingReviewOpportunitiesUUID: cl.loadingReviewOpportunitiesUUID,
    loadingChallengeSubtracks: cl.loadingChallengeSubtracks,
    loadingChallengeTags: cl.loadingChallengeTags,
    newChallengeDetails: ownProps.newChallengeDetails,
    openChallengesInNewTabs: ownProps.openChallengesInNewTabs,
    preListingMsg: ownProps.preListingMsg,
    prizeMode: ownProps.prizeMode,
    reviewOpportunities: cl.reviewOpportunities,
    selectedCommunityId: cl.selectedCommunityId,
    sorts: cl.sorts,
    activeBucket: cl.sidebar.activeBucket,
    expandedTags: cl.expandedTags,
    meta: cl.meta,
    getttingMoreChallenges: cl.getttingMoreChallenges,
  };
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing;
  const ah = headerActions.topcoderHeader;
  const fpa = filterPanelActions.challengeListing.filterPanel;
  const sa = sidebarActions.challengeListing.sidebar;
  const ca = communityActions.tcCommunity;
  return {
    dropChallenges: () => dispatch(a.dropChallenges()),
    getMoreChallenges: () => dispatch(a.getMoreChallenges()),
    getActiveChallenges: (page, filter, token, frontFilter) => {
      if (filter.track !== '') {
        const uuid = shortId();
        dispatch(a.getActiveChallengesInit(uuid, page, frontFilter));
        dispatch(a.getActiveChallengesDone(uuid, page, filter, token, frontFilter));
      }
    },
    getRestActiveChallenges: (token, backendFilter, frontFilter) => {
      if (backendFilter.track !== '') {
        const uuid = shortId();
        dispatch(a.getRestActiveChallengesInit(uuid));
        dispatch(a.getRestActiveChallengesDone(uuid, token, backendFilter, frontFilter));
      }
    },
    getCommunitiesList: (auth) => {
      const uuid = shortId();
      dispatch(ca.getListInit(uuid));
      dispatch(ca.getListDone(uuid, auth));
    },
    getPastChallenges: (page, filter, token, frontFilter) => {
      const uuid = shortId();
      dispatch(a.getPastChallengesInit(uuid, page, frontFilter));
      dispatch(a.getPastChallengesDone(uuid, page, filter, token, frontFilter));
    },
    getReviewOpportunities: (page, token) => {
      const uuid = shortId();
      dispatch(a.getReviewOpportunitiesInit(uuid, page));
      dispatch(a.getReviewOpportunitiesDone(uuid, page, token));
    },
    selectBucket: bucket => dispatch(sa.selectBucket(bucket)),
    selectChallengeDetailsTab:
      tab => dispatch(challengeDetailsActions.page.challengeDetails.selectTab(tab)),
    selectCommunity: id => dispatch(a.selectCommunity(id)),
    setFilter: state => dispatch(a.setFilter(state)),
    setSearchText: text => dispatch(fpa.setSearchText(text)),
    setSort: (bucket, sort) => dispatch(a.setSort(bucket, sort)),
    markHeaderMenu: () => dispatch(ah.setCurrentNav('Compete', 'All Challenges')),
    expandTag: id => dispatch(a.expandTag(id)),
  };
}

const ChallengeListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListingContainer);

export default ChallengeListingContainer;
