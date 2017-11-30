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

import actions from 'actions/challenge-listing';
import challengeActions from 'actions/challenge';
import config from 'utils/config';
import filterPanelActions from 'actions/challenge-listing/filter-panel';
import headerActions from 'actions/topcoder_header';
import logger from 'utils/logger';
import React from 'react';
import PT from 'prop-types';
import shortid from 'shortid';
import { connect } from 'react-redux';
import ChallengeListing from 'components/challenge-listing';
import Banner from 'components/tc-communities/Banner';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import sidebarActions from 'actions/challenge-listing/sidebar';
import communityActions from 'actions/tc-communities';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { combine, mapToBackend } from 'utils/challenge-listing/filter';
import MetaTags from 'utils/MetaTags';
import ogImage from '../../../../assets/images/og_image.jpg';
import style from './styles.scss';

let mounted = false;

const SEO_PAGE_TITLE = 'Topcoder Challenges';

export class ListingContainer extends React.Component {
  componentDidMount() {
    this.props.markHeaderMenu();

    if (this.props.communityId) {
      this.props.selectCommunity(this.props.communityId);
    }

    if (mounted) {
      logger.error('Attempt to mount multiple instances of ChallengeListingPageContainer at the same time!');
    } else mounted = true;

    this.loadChallenges();
  }

  componentDidUpdate(prevProps) {
    const profile = this.props.auth.profile;
    if (profile) {
      if (!prevProps.auth.profile) setImmediate(() => this.loadChallenges());
    } else if (prevProps.auth.profile) {
      setImmediate(() => {
        this.props.dropChallenges();
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
    let filter = this.props.filter;
    let communityFilter = this.props.communityFilters.find(item =>
      item.communityId === this.props.selectedCommunityId);
    if (communityFilter) communityFilter = communityFilter.challengeFilter;
    if (communityFilter) filter = combine(filter, communityFilter);
    return {
      back: mapToBackend(filter),
      front: filter,
    };
  }

  loadChallenges() {
    const f = this.getBackendFilter();
    this.props.getCommunityFilters(this.props.auth);
    this.props.getAllActiveChallenges(this.props.auth.tokenV3);

    /* No need to fetch draft challenges for now: we are not showing the
     * Upcoming Challenges bucket, for now. */
    // this.props.getDraftChallenges(0, backendFilter, this.props.auth.tokenV3);

    this.props.getPastChallenges(0, f.back, this.props.auth.tokenV3, f.front);

    if (config.CHALLENGE_LISTING_AUTO_REFRESH) {
      if (this.autoRefreshTimerId) clearTimeout(this.autoRefreshTimerId);
      this.autoRefreshTimerId = setTimeout(() =>
        this.loadChallenges(), 1000 * config.CHALLENGE_LISTING_AUTO_REFRESH);
    }
  }

  render() {
    const {
      auth: {
        tokenV3,
      },
      allDraftChallengesLoaded,
      allPastChallengesLoaded,
      allReviewOpportunitiesLoaded,
      activeBucket,
      challenges,
      challengesUrl,
      challengeSubtracks,
      challengeTags,
      defaultCommunityId,
      domain,
      groupIds,
      filter,
      getDraftChallenges,
      getPastChallenges,
      getReviewOpportunities,
      keepPastPlaceholders,
      lastRequestedPageOfDraftChallenges,
      lastRequestedPageOfPastChallenges,
      lastRequestedPageOfReviewOpportunities,
      lastUpdateOfActiveChallenges,
      listingOnly,
      newChallengeDetails,
      reviewOpportunities,
      selectBucket,
      selectChallengeDetailsTab,
      selectedCommunityId,
      hideTcLinksInSidebarFooter,
    } = this.props;

    let loadMoreDraft;
    if (!allDraftChallengesLoaded) {
      loadMoreDraft = () => {
        getDraftChallenges(
          1 + lastRequestedPageOfDraftChallenges,
          this.getBackendFilter().back,
          tokenV3,
        );
      };
    }

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
      loadMoreReviewOpportunities = () =>
        getReviewOpportunities(1 + lastRequestedPageOfReviewOpportunities, tokenV3);
    }

    let communityFilter = this.props.communityFilters.find(item =>
      item.communityId === this.props.selectedCommunityId);
    if (communityFilter) communityFilter = communityFilter.challengeFilter;

    const description = 'Join Topcoder and compete in these challenges, to learn and earn!';

    return (
      <div styleName="container">
        <MetaTags
          description={description}
          image={`${domain}${ogImage}`}
          siteName="Topcoder"
          title={this.props.communityId ? `${this.props.communityName} Challenges` : SEO_PAGE_TITLE}
        />
        { /* TODO: This banner should be moved out of here! */ }
        { !listingOnly ? (
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
        ) : null
        }
        <ChallengeListing
          activeBucket={activeBucket}
          challenges={challenges}
          challengeSubtracks={challengeSubtracks}
          challengeTags={challengeTags}
          challengesUrl={challengesUrl}
          communityFilter={communityFilter}
          communityName={this.props.communityName}
          defaultCommunityId={defaultCommunityId}
          expandedTags={this.props.expandedTags}
          expandTag={this.props.expandTag}
          filterState={filter}
          hideTcLinksInFooter={hideTcLinksInSidebarFooter}
          keepPastPlaceholders={keepPastPlaceholders}
          lastUpdateOfActiveChallenges={lastUpdateOfActiveChallenges}
          loadingChallenges={Boolean(this.props.loadingActiveChallengesUUID)}
          loadingDraftChallenges={Boolean(this.props.loadingDraftChallengesUUID)}
          loadingPastChallenges={Boolean(this.props.loadingPastChallengesUUID)}
          loadingReviewOpportunities={Boolean(this.props.loadingReviewOpportunitiesUUID)}
          newChallengeDetails={newChallengeDetails}
          openChallengesInNewTabs={this.props.openChallengesInNewTabs}
          prizeMode={this.props.prizeMode}
          selectBucket={selectBucket}
          selectChallengeDetailsTab={selectChallengeDetailsTab}
          selectedCommunityId={selectedCommunityId}
          loadMoreDraft={loadMoreDraft}
          loadMorePast={loadMorePast}
          loadMoreReviewOpportunities={loadMoreReviewOpportunities}
          reviewOpportunities={reviewOpportunities}
          setFilterState={(state) => {
            this.props.setFilter(state);
            this.props.setSearchText(state.text || '');
            if (activeBucket === BUCKETS.SAVED_FILTER) {
              this.props.selectBucket(BUCKETS.ALL);
            }
          }}
          setSort={this.props.setSort}
          sorts={this.props.sorts}
          groupIds={groupIds}
          auth={this.props.auth}
        />
        { !listingOnly ? (
          <NewsletterSignup
            title="Sign up for our newsletter"
            text="Don’t miss out on the latest Topcoder IOS challenges and information!"
            imageSrc="/community-app-assets/themes/wipro/subscribe-bg.jpg"
          />
        ) : null }
      </div>
    );
  }
}

ListingContainer.defaultProps = {
  defaultCommunityId: '',

  selectedCommunityId: '',
  groupIds: [''],
  hideTcLinksInSidebarFooter: false,
  challengesUrl: '/challenges',
  communityId: null,
  communityName: null,
  listingOnly: false,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  prizeMode: 'money-usd',
};

ListingContainer.propTypes = {
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
  allDraftChallengesLoaded: PT.bool.isRequired,
  allPastChallengesLoaded: PT.bool.isRequired,
  allReviewOpportunitiesLoaded: PT.bool.isRequired,
  challenges: PT.arrayOf(PT.shape({})).isRequired,
  challengesUrl: PT.string,
  challengeSubtracks: PT.arrayOf(PT.shape()).isRequired,
  challengeTags: PT.arrayOf(PT.string).isRequired,
  communityFilters: PT.arrayOf(PT.shape({
    challengeFilter: PT.shape(),
    communityId: PT.string.isRequired,
  })).isRequired,
  defaultCommunityId: PT.string,
  domain: PT.string.isRequired,
  dropChallenges: PT.func.isRequired,
  filter: PT.shape().isRequired,
  hideTcLinksInSidebarFooter: PT.bool,
  communityId: PT.string,
  communityName: PT.string,
  getAllActiveChallenges: PT.func.isRequired,
  getCommunityFilters: PT.func.isRequired,
  getDraftChallenges: PT.func.isRequired,
  getPastChallenges: PT.func.isRequired,
  getReviewOpportunities: PT.func.isRequired,
  keepPastPlaceholders: PT.bool.isRequired,
  lastRequestedPageOfDraftChallenges: PT.number.isRequired,
  lastRequestedPageOfPastChallenges: PT.number.isRequired,
  lastRequestedPageOfReviewOpportunities: PT.number.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingActiveChallengesUUID: PT.string.isRequired,
  loadingDraftChallengesUUID: PT.string.isRequired,
  loadingPastChallengesUUID: PT.string.isRequired,
  loadingReviewOpportunitiesUUID: PT.string.isRequired,
  markHeaderMenu: PT.func.isRequired,
  newChallengeDetails: PT.bool,
  openChallengesInNewTabs: PT.bool,
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
};

const mapStateToProps = (state, ownProps) => {
  const cl = state.challengeListing;
  const tc = state.tcCommunities;
  return {
    auth: state.auth,
    allDraftChallengesLoaded: cl.allDraftChallengesLoaded,
    allPastChallengesLoaded: cl.allPastChallengesLoaded,
    allReviewOpportunitiesLoaded: cl.allReviewOpportunitiesLoaded,
    filter: cl.filter,
    challenges: cl.challenges,
    challengeSubtracks: cl.challengeSubtracks,
    challengeTags: cl.challengeTags,
    communityFilters: tc.list,
    domain: state.domain,
    hideTcLinksInSidebarFooter: ownProps.hideTcLinksInSidebarFooter,
    keepPastPlaceholders: cl.keepPastPlaceholders,
    lastRequestedPageOfDraftChallenges: cl.lastRequestedPageOfDraftChallenges,
    lastRequestedPageOfPastChallenges: cl.lastRequestedPageOfPastChallenges,
    lastRequestedPageOfReviewOpportunities: cl.lastRequestedPageOfReviewOpportunities,
    lastUpdateOfActiveChallenges: cl.lastUpdateOfActiveChallenges,
    loadingActiveChallengesUUID: cl.loadingActiveChallengesUUID,
    loadingDraftChallengesUUID: cl.loadingDraftChallengesUUID,
    loadingPastChallengesUUID: cl.loadingPastChallengesUUID,
    loadingReviewOpportunitiesUUID: cl.loadingReviewOpportunitiesUUID,
    loadingChallengeSubtracks: cl.loadingChallengeSubtracks,
    loadingChallengeTags: cl.loadingChallengeTags,
    newChallengeDetails: ownProps.newChallengeDetails,
    openChallengesInNewTabs: ownProps.openChallengesInNewTabs,
    prizeMode: ownProps.prizeMode,
    reviewOpportunities: cl.reviewOpportunities,
    selectedCommunityId: cl.selectedCommunityId,
    sorts: cl.sorts,
    activeBucket: cl.sidebar.activeBucket,
    expandedTags: cl.expandedTags,
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
    getAllActiveChallenges: (token) => {
      const uuid = shortid();
      dispatch(a.getAllActiveChallengesInit(uuid));
      dispatch(a.getAllActiveChallengesDone(uuid, token));
    },
    getCommunityFilters: auth => dispatch(ca.getList(auth)),
    getDraftChallenges: (page, filter, token) => {
      const uuid = shortid();
      dispatch(a.getDraftChallengesInit(uuid, page));
      dispatch(a.getDraftChallengesDone(uuid, page, filter, token));
    },
    getPastChallenges: (page, filter, token, frontFilter) => {
      const uuid = shortid();
      dispatch(a.getPastChallengesInit(uuid, page, frontFilter));
      dispatch(a.getPastChallengesDone(uuid, page, filter, token, frontFilter));
    },
    getReviewOpportunities: (page, token) => {
      const uuid = shortid();
      dispatch(a.getReviewOpportunitiesInit(uuid, page));
      dispatch(a.getReviewOpportunitiesDone(uuid, page, token));
    },
    selectBucket: bucket => dispatch(sa.selectBucket(bucket)),
    selectChallengeDetailsTab: tab =>
      dispatch(challengeActions.challenge.selectTab(tab)),
    selectCommunity: id => dispatch(a.selectCommunity(id)),
    setFilter: state => dispatch(a.setFilter(state)),
    setSearchText: text => dispatch(fpa.setSearchText(text)),
    setSort: (bucket, sort) => dispatch(a.setSort(bucket, sort)),
    markHeaderMenu: () =>
      dispatch(ah.setCurrentNav('Compete', 'All Challenges')),
    expandTag: id => dispatch(a.expandTag(id)),
  };
}

const ChallengeListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListingContainer);

export default ChallengeListingContainer;
