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
import { logger, actions, challenge as challengeUtil } from 'topcoder-react-lib';
import React from 'react';
import PT from 'prop-types';
import shortId from 'shortid';
import { connect } from 'react-redux';
import ChallengeListing from 'components/challenge-listing';
import Banner from 'components/tc-communities/Banner';
import sidebarActions from 'actions/challenge-listing/sidebar';
import communityActions from 'actions/tc-communities';
import { MetaTags } from 'topcoder-react-utils';
import { USER_GROUP_MAXAGE } from 'config';

import ogImage from '../../../../assets/images/og_image.jpg';
import style from './styles.scss';

const { BUCKETS, BUCKET_DATA } = challengeUtil.buckets;

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
      activeBucket,
      auth,
      dropChallenges,
      getCommunitiesList,
      datepickerOpen,
    } = this.props;

    const oldFilter = _.get(prevProps, 'filter');
    const filter = _.get(this.props, 'filter');

    const oldSorts = _.get(prevProps, 'sorts');
    const sorts = _.get(this.props, 'sorts');

    const oldCommunityId = _.get(prevProps, 'selectedCommunityId');
    const newCommunityId = _.get(this.props, 'selectedCommunityId');

    const oldActiveBucket = _.get(prevProps, 'activeBucket');

    const newStartDate = _.get(filter, 'startDate');
    const newEndDate = _.get(filter, 'endDate');

    let filterChanged = !_.isEqual(oldFilter, filter)
      || newCommunityId !== oldCommunityId
      || activeBucket !== oldActiveBucket
      || !_.isEqual(oldSorts, sorts);

    if (
      (newStartDate && newStartDate === newEndDate)
      || (newStartDate && newEndDate === undefined)
      || datepickerOpen
    ) {
      filterChanged = false;
    }

    if (filterChanged) {
      switch (activeBucket) {
        case BUCKETS.PAST:
          dropChallenges(activeBucket);
          this.loadPastChallenges();
          break;
        case BUCKETS.ALL:
        case BUCKETS.MY:
        case BUCKETS.OPEN_FOR_REGISTRATION:
        case BUCKETS.ONGOING:
          dropChallenges(activeBucket);
          this.loadChallenges();
          break;
        case BUCKETS.REVIEW_OPPORTUNITIES:
          dropChallenges(activeBucket);
          this.loadReviewOpportunities();
          break;
        default:
          break;
      }
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
        dropChallenges(activeBucket);
        this.loadChallenges();
      });
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

  loadMoreChallenges(bucket) {
    const {
      getMoreChallenges,
      allMyChallengesLoaded,
      allOpenChallengesLoaded,
      allOnGoingChallengesLoaded,
    } = this.props;
    switch (bucket) {
      case BUCKETS.MY:
        if (!allMyChallengesLoaded) {
          getMoreChallenges(bucket);
        }
        break;
      case BUCKETS.ONGOING:
        if (!allOnGoingChallengesLoaded) {
          getMoreChallenges(bucket);
        }
        break;
      case BUCKETS.OPEN_FOR_REGISTRATION:
        if (!allOpenChallengesLoaded) {
          getMoreChallenges(bucket);
        }
        break;
      default:
        break;
    }
  }

  loadChallenges() {
    const {
      auth,
      getActiveChallenges,
      activeBucket,
      sorts,
    } = this.props;
    const f = this.getBackendFilter();
    let sort = null;
    if (activeBucket !== BUCKETS.ALL) {
      sort = _.has(sorts, activeBucket)
        ? sorts.activeBucket : null;
    }
    // only load the first page
    getActiveChallenges(
      0,
      f.back,
      auth.tokenV3,
      f.front,
      sort,
      activeBucket,
    );
  }

  loadPastChallenges() {
    const {
      sorts, getPastChallenges, auth,
    } = this.props;
    const { tokenV3 } = auth;
    const f = this.getBackendFilter();
    const sort = _.has(sorts, BUCKETS.PAST)
      ? sorts[BUCKETS.PAST] : BUCKET_DATA[BUCKETS.PAST].sorts[0];
    getPastChallenges(
      0,
      f.back,
      tokenV3,
      f.front,
      sort,
    );
  }

  loadReviewOpportunities() {
    const {
      sorts, getReviewOpportunities, auth,
    } = this.props;
    const { tokenV3 } = auth;
    const f = this.getBackendFilter();
    const sort = _.has(sorts, BUCKETS.REVIEW_OPPORTUNITIES)
      ? sorts[BUCKETS.REVIEW_OPPORTUNITIES]
      : BUCKET_DATA[BUCKETS.REVIEW_OPPORTUNITIES].sorts[0];
    getReviewOpportunities(
      0, tokenV3, sort, f.front,
    );
  }

  createLoadMoreFunction(bucket) {
    const {
      sorts, getReviewOpportunities, auth, lastRequestedPageOfReviewOpportunities,
      getPastChallenges, lastRequestedPageOfPastChallenges,
      getActiveChallenges, lastRequestedPageOfMyChallenges,
      lastRequestedPageOfOnGoingChallenges, lastRequestedPageOfOpenChallenges,
    } = this.props;
    const { tokenV3 } = auth;
    const f = this.getBackendFilter();
    const sort = _.has(sorts, bucket)
      ? sorts[bucket] : BUCKET_DATA[bucket].sorts[0];
    let loadMore;
    switch (bucket) {
      case BUCKETS.PAST:
        loadMore = () => {
          getPastChallenges(
            1 + lastRequestedPageOfPastChallenges,
            f.back,
            tokenV3,
            f.front,
            sort,
          );
        };
        break;
      case BUCKETS.REVIEW_OPPORTUNITIES:
        loadMore = () => {
          getReviewOpportunities(
            1 + lastRequestedPageOfReviewOpportunities, tokenV3, sort, f.front,
          );
        };
        break;
      case BUCKETS.MY:
        loadMore = () => {
          getActiveChallenges(
            1 + lastRequestedPageOfMyChallenges,
            f.back,
            tokenV3,
            f.front,
            sort,
            bucket,
          );
        };
        break;
      case BUCKETS.OPEN_FOR_REGISTRATION:
        loadMore = () => {
          getActiveChallenges(
            1 + lastRequestedPageOfOpenChallenges,
            f.back,
            tokenV3,
            f.front,
            sort,
            bucket,
          );
        };
        break;
      case BUCKETS.ONGOING:
        loadMore = () => {
          getActiveChallenges(
            1 + lastRequestedPageOfOnGoingChallenges,
            f.back,
            tokenV3,
            f.front,
            sort,
            bucket,
          );
        };
        break;
      default:
        break;
    }

    return loadMore;
  }

  render() {
    const {
      auth,
      allPastChallengesLoaded,
      allReviewOpportunitiesLoaded,
      allOnGoingChallengesLoaded,
      allMyChallengesLoaded,
      allOpenChallengesLoaded,
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
      hideSrm,
      keepPastPlaceholders,
      lastUpdateOfActiveChallenges,
      loadingActiveChallengesUUID,
      loadingMyChallengesUUID,
      loadingOpenChallengesUUID,
      loadingOnGoingChallengesUUID,
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
      gettingMoreMyChallenges,
      gettingMoreOnGoingChallenges,
      gettingMoreOpenChallenges,
    } = this.props;

    let loadMorePast;
    if (!allPastChallengesLoaded) {
      loadMorePast = this.createLoadMoreFunction(BUCKETS.PAST);
    }

    let loadMoreReviewOpportunities;
    if (!allReviewOpportunitiesLoaded) {
      loadMoreReviewOpportunities = this.createLoadMoreFunction(BUCKETS.REVIEW_OPPORTUNITIES);
    }

    let loadMoreMy;
    if (!allMyChallengesLoaded && gettingMoreMyChallenges) {
      loadMoreMy = this.createLoadMoreFunction(BUCKETS.MY);
    }

    let loadMoreOpen;
    if (!allOpenChallengesLoaded && gettingMoreOpenChallenges) {
      loadMoreOpen = this.createLoadMoreFunction(BUCKETS.OPEN_FOR_REGISTRATION);
    }

    let loadMoreOnGoing;
    if (!allOnGoingChallengesLoaded && gettingMoreOnGoingChallenges) {
      loadMoreOnGoing = this.createLoadMoreFunction(BUCKETS.ONGOING);
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
          loadingMyChallenges={Boolean(loadingMyChallengesUUID)}
          loadingOnGoingChallenges={Boolean(loadingOnGoingChallengesUUID)}
          loadingOpenChallenges={Boolean(loadingOpenChallengesUUID)}
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
          loadMoreChallenges={bucket => this.loadMoreChallenges(bucket)}
          loadMoreMy={loadMoreMy}
          loadMoreOpen={loadMoreOpen}
          loadMoreOnGoing={loadMoreOnGoing}
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
};

ListingContainer.propTypes = {
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
  allMyChallengesLoaded: PT.bool.isRequired,
  allOnGoingChallengesLoaded: PT.bool.isRequired,
  allOpenChallengesLoaded: PT.bool.isRequired,
  allPastChallengesLoaded: PT.bool.isRequired,
  allReviewOpportunitiesLoaded: PT.bool.isRequired,
  ChallengeListingBanner: PT.node,
  challenges: PT.shape().isRequired,
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
  getCommunitiesList: PT.func.isRequired,
  getPastChallenges: PT.func.isRequired,
  getReviewOpportunities: PT.func.isRequired,
  keepPastPlaceholders: PT.bool.isRequired,
  lastRequestedPageOfPastChallenges: PT.number.isRequired,
  lastRequestedPageOfMyChallenges: PT.number.isRequired,
  lastRequestedPageOfOpenChallenges: PT.number.isRequired,
  lastRequestedPageOfOnGoingChallenges: PT.number.isRequired,
  lastRequestedPageOfReviewOpportunities: PT.number.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingActiveChallengesUUID: PT.string.isRequired,
  loadingMyChallengesUUID: PT.string.isRequired,
  loadingOpenChallengesUUID: PT.string.isRequired,
  loadingOnGoingChallengesUUID: PT.string.isRequired,
  loadingPastChallengesUUID: PT.string.isRequired,
  loadingReviewOpportunitiesUUID: PT.string.isRequired,
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
  gettingMoreMyChallenges: PT.bool.isRequired,
  gettingMoreOnGoingChallenges: PT.bool.isRequired,
  gettingMoreOpenChallenges: PT.bool.isRequired,
  getMoreChallenges: PT.func.isRequired,
  datepickerOpen: PT.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const cl = state.challengeListing;
  const clFrontend = state.challengeListingFrontend;
  const tc = state.tcCommunities;
  return {
    auth: state.auth,
    allMyChallengesLoaded: cl.allMyChallengesLoaded,
    allOnGoingChallengesLoaded: cl.allOnGoingChallengesLoaded,
    allOpenChallengesLoaded: cl.allOpenChallengesLoaded,
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
    lastRequestedPageOfMyChallenges: cl.lastRequestedPageOfMyChallenges,
    lastRequestedPageOfOnGoingChallenges: cl.lastRequestedPageOfOnGoingChallenges,
    lastRequestedPageOfOpenChallenges: cl.lastRequestedPageOfOpenChallenges,
    lastRequestedPageOfPastChallenges: cl.lastRequestedPageOfPastChallenges,
    lastRequestedPageOfReviewOpportunities: cl.lastRequestedPageOfReviewOpportunities,
    lastUpdateOfActiveChallenges: cl.lastUpdateOfActiveChallenges,
    loadingActiveChallengesUUID: cl.loadingActiveChallengesUUID,
    loadingMyChallengesUUID: cl.loadingMyChallengesUUID,
    loadingOpenChallengesUUID: cl.loadingOpenChallengesUUID,
    loadingOnGoingChallengesUUID: cl.loadingOnGoingChallengesUUID,
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
    activeBucket: clFrontend.sidebar.activeBucket,
    expandedTags: cl.expandedTags,
    meta: cl.meta,
    gettingMoreChallenges: cl.gettingMoreChallenges,
    gettingMoreMyChallenges: cl.gettingMoreMyChallenges,
    gettingMoreOpenChallenges: cl.gettingMoreOpenChallenges,
    gettingMoreOnGoingChallenges: cl.gettingMoreOnGoingChallenges,
    datepickerOpen: cl.datepickerOpen,
  };
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing;
  const ah = headerActions.topcoderHeader;
  const fpa = filterPanelActions.challengeListingFrontend.filterPanel;
  const sa = sidebarActions.challengeListingFrontend.sidebar;
  const ca = communityActions.tcCommunity;
  return {
    dropChallenges: bucket => dispatch(a.dropChallenges(bucket)),
    getMoreChallenges: bucket => dispatch(a.getMoreChallenges(bucket)),
    getActiveChallenges: (page, filter, token, frontFilter, sort, bucket) => {
      if (filter.track !== '') {
        const uuid = shortId();
        dispatch(a.getActiveChallengesInit(uuid, page, frontFilter, sort, bucket));
        dispatch(a.getActiveChallengesDone(
          uuid, page, filter, token, frontFilter, sort, bucket,
        ));
      }
    },
    getRestActiveChallenges: (token, backendFilter, frontFilter, sort, bucket) => {
      if (backendFilter.track !== '') {
        const uuid = shortId();
        dispatch(a.getRestActiveChallengesInit(uuid));
        dispatch(a.getRestActiveChallengesDone(
          uuid, token, backendFilter, frontFilter, sort, bucket,
        ));
      }
    },
    getCommunitiesList: (auth) => {
      const uuid = shortId();
      dispatch(ca.getListInit(uuid));
      dispatch(ca.getListDone(uuid, auth));
    },
    getPastChallenges: (page, filter, token, frontFilter, sort) => {
      const uuid = shortId();
      dispatch(a.getPastChallengesInit(uuid, page, frontFilter, sort));
      dispatch(a.getPastChallengesDone(uuid, page, filter, token, frontFilter, sort));
    },
    getReviewOpportunities: (page, token, sort, frontFilter) => {
      const uuid = shortId();
      dispatch(a.getReviewOpportunitiesInit(uuid, page, sort));
      dispatch(a.getReviewOpportunitiesDone(uuid, page, token, sort, frontFilter));
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
