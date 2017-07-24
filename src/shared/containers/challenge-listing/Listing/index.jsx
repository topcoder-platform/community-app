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

// import _ from 'lodash';
import actions from 'actions/challenge-listing';
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
import style from './styles.scss';

let mounted = false;

export class ListingContainer extends React.Component {

  /* TODO: We should add here an automatic periodical update of the loaded
   * challenges, say once each 5 minutes. Otherwise, it is possible that a
   * visitor has the same challenge listing page open for too long, navigating
   * withing it, without triggering refresh of the cached challenges - not
   * good! */

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
    return mapToBackend(filter);
  }

  loadChallenges() {
    const backendFilter = this.getBackendFilter();
    this.props.getCommunityFilters(this.props.auth);
    this.props.getAllActiveChallenges(this.props.auth.tokenV3);

    /* No need to fetch draft challenges for now: we are not showing the
     * Upcoming Challenges bucket, for now. */
    // this.props.getDraftChallenges(0, backendFilter, this.props.auth.tokenV3);

    this.props.getPastChallenges(0, backendFilter, this.props.auth.tokenV3);

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
      activeBucket,
      challenges,
      challengeSubtracks,
      challengeTags,
      groupId,
      filter,
      getDraftChallenges,
      getPastChallenges,
      lastRequestedPageOfDraftChallenges,
      lastRequestedPageOfPastChallenges,
      lastUpdateOfActiveChallenges,
      listingOnly,
      selectBucket,
      hideTcLinksInSidebarFooter,
    } = this.props;

    let loadMoreDraft;
    if (!allDraftChallengesLoaded) {
      loadMoreDraft = () => {
        getDraftChallenges(
          1 + lastRequestedPageOfDraftChallenges,
          this.getBackendFilter(),
          tokenV3,
        );
      };
    }

    let loadMorePast;
    if (!allPastChallengesLoaded) {
      loadMorePast = () => {
        getPastChallenges(
          1 + lastRequestedPageOfPastChallenges,
          this.getBackendFilter(),
          tokenV3,
        );
      };
    }

    let communityFilter = this.props.communityFilters.find(item =>
      item.communityId === this.props.selectedCommunityId);
    if (communityFilter) communityFilter = communityFilter.challengeFilter;

    return (
      <div>
        {/* For demo we hardcode banner properties so we can disable max-len linting */}
        {/* eslint-disable max-len */}
        { !listingOnly ? (
          <Banner
            title="Challenges"
            text="Browse our available challenges and compete."
            theme={{
              container: style.bannerContainer,
              content: style.bannerContent,
              contentInner: style.bannerContentInner,
            }}
            imageSrc="/themes/wipro/challenges/banner.jpg"
          />
        ) : null
        }
        {/* eslint-enable max-len */}
        <ChallengeListing
          activeBucket={activeBucket}
          challenges={challenges}
          challengeSubtracks={challengeSubtracks}
          challengeTags={challengeTags}
          communityFilter={communityFilter}
          communityName={this.props.communityName}
          filterState={filter}
          lastUpdateOfActiveChallenges={lastUpdateOfActiveChallenges}
          loadingChallenges={Boolean(this.props.loadingActiveChallengesUUID)}
          loadingDraftChallenges={Boolean(this.props.loadingDraftChallengesUUID)}
          loadingPastChallenges={Boolean(this.props.loadingPastChallengesUUID)}
          selectBucket={selectBucket}
          hideTcLinksInFooter={hideTcLinksInSidebarFooter}

          loadMoreDraft={loadMoreDraft}
          loadMorePast={loadMorePast}
          setFilterState={(state) => {
            this.props.setFilter(state);
            this.props.setSearchText(state.text || '');
            if (activeBucket === BUCKETS.SAVED_FILTER) {
              this.props.selectBucket(BUCKETS.ALL);
            }
          }}
          setSort={this.props.setSort}
          sorts={this.props.sorts}
          groupId={groupId}
          auth={this.props.auth}
        />
        { !listingOnly ? (
          <NewsletterSignup
            title="Sign up for our newsletter"
            text="Don’t miss out on the latest Topcoder IOS challenges and information!"
            imageSrc="/themes/wipro/subscribe-bg.jpg"
          />
        ) : null }
      </div>
    );
  }
}

ListingContainer.defaultProps = {
  selectedCommunityId: '',
  groupId: '',
  hideTcLinksInSidebarFooter: false,
  communityId: null,
  communityName: null,
  listingOnly: false,
};

ListingContainer.propTypes = {
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
  allDraftChallengesLoaded: PT.bool.isRequired,
  allPastChallengesLoaded: PT.bool.isRequired,
  challenges: PT.arrayOf(PT.shape({})).isRequired,
  challengeSubtracks: PT.arrayOf(PT.string).isRequired,
  challengeTags: PT.arrayOf(PT.string).isRequired,
  communityFilters: PT.arrayOf(PT.shape({
    challengeFilter: PT.shape(),
    communityId: PT.string.isRequired,
  })).isRequired,
  dropChallenges: PT.func.isRequired,
  filter: PT.shape().isRequired,
  hideTcLinksInSidebarFooter: PT.bool,
  communityId: PT.string,
  communityName: PT.string,
  getAllActiveChallenges: PT.func.isRequired,
  getCommunityFilters: PT.func.isRequired,
  getDraftChallenges: PT.func.isRequired,
  getPastChallenges: PT.func.isRequired,
  lastRequestedPageOfDraftChallenges: PT.number.isRequired,
  lastRequestedPageOfPastChallenges: PT.number.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingActiveChallengesUUID: PT.string.isRequired,
  loadingDraftChallengesUUID: PT.string.isRequired,
  loadingPastChallengesUUID: PT.string.isRequired,
  markHeaderMenu: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
  selectCommunity: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  activeBucket: PT.string.isRequired,
  selectedCommunityId: PT.string,
  sorts: PT.shape().isRequired,
  setSearchText: PT.func.isRequired,
  setSort: PT.func.isRequired,
  listingOnly: PT.bool,
  groupId: PT.string,
};

const mapStateToProps = (state, ownProps) => {
  const cl = state.challengeListing;
  const tc = state.tcCommunities;
  return {
    auth: state.auth,
    allDraftChallengesLoaded: cl.allDraftChallengesLoaded,
    allPastChallengesLoaded: cl.allPastChallengesLoaded,
    filter: cl.filter,
    challenges: cl.challenges,
    challengeSubtracks: cl.challengeSubtracks,
    challengeTags: cl.challengeTags,
    communityFilters: [{ communityId: '', communityName: 'All' }].concat(tc.list),
    hideTcLinksInSidebarFooter: ownProps.hideTcLinksInSidebarFooter,
    lastRequestedPageOfDraftChallenges: cl.lastRequestedPageOfDraftChallenges,
    lastRequestedPageOfPastChallenges: cl.lastRequestedPageOfPastChallenges,
    lastUpdateOfActiveChallenges: cl.lastUpdateOfActiveChallenges,
    loadingActiveChallengesUUID: cl.loadingActiveChallengesUUID,
    loadingDraftChallengesUUID: cl.loadingDraftChallengesUUID,
    loadingPastChallengesUUID: cl.loadingPastChallengesUUID,
    loadingChallengeSubtracks: cl.loadingChallengeSubtracks,
    loadingChallengeTags: cl.loadingChallengeTags,
    selectedCommunityId: cl.selectedCommunityId,
    sorts: cl.sorts,
    activeBucket: cl.sidebar.activeBucket,
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
    getPastChallenges: (page, filter, token) => {
      const uuid = shortid();
      dispatch(a.getPastChallengesInit(uuid, page));
      dispatch(a.getPastChallengesDone(uuid, page, filter, token));
    },
    selectBucket: bucket => dispatch(sa.selectBucket(bucket)),
    selectCommunity: id => dispatch(a.selectCommunity(id)),
    setFilter: state => dispatch(a.setFilter(state)),
    setSearchText: text => dispatch(fpa.setSearchText(text)),
    setSort: (bucket, sort) => dispatch(a.setSort(bucket, sort)),
    markHeaderMenu: () =>
      dispatch(ah.setCurrentNav('Compete', 'All Challenges')),
  };
}

const ChallengeListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListingContainer);

export default ChallengeListingContainer;
