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
import actions from 'actions/challenge-listing';
import headerActions from 'actions/topcoder_header';
import logger from 'utils/logger';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import ChallengeListing from 'components/challenge-listing';
import Banner from 'components/tc-communities/Banner';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import shortid from 'shortid';
import sidebarActions from 'actions/challenge-listing/sidebar';
import style from './styles.scss';

// helper function to de-serialize query string to filter object
/*
const deserialize = (queryString) => {
  const filter = new SideBarFilter({
    filter: queryString,
    isSavedFilter: true, // So that we can reuse constructor for deserializing
  });
  if (!_.values(SideBarFilterModes).includes(filter.name)) {
    filter.isCustomFilter = true;
  }
  return filter;
};
*/

let mounted = false;

// The container component
class ListingContainer extends React.Component {

  constructor(props) {
    super(props);
    this.masterFilterFunc = this.masterFilterFunc.bind(this);
  }

  componentDidMount() {
    this.props.markHeaderMenu();

    if (mounted) {
      logger.error('Attempt to mount multiple instances of ChallengeListingPageContainer at the same time!');
    } else mounted = true;
    this.loadChallenges();

    /* LOAD FILTER FROM URL, IF NECESSARY! */

    /* Get filter from the URL hash, if necessary. */
    /*
    const filter = this.props.location.hash.slice(1);
    if (filter && filter !== this.props.filter) {
      // this.props.setFilter(filter);
    } else if (this.props.challengeGroupId) {
      const f = deserialize(this.props.filter);
      f.groupId = this.props.challengeGroupId;
      // this.props.setFilter(f.getURLEncoded());
    }
    */
  }

  componentDidUpdate(prevProps) {
    const token = this.props.auth.tokenV3;
    if (token && token !== prevProps.auth.tokenV3) {
      setImmediate(() => this.loadChallenges());
    }
  }

  componentWillUnmount() {
    if (mounted) mounted = false;
    else {
      logger.error('A mounted instance of ChallengeListingPageContainer is not tracked as mounted!');
    }
  }

  loadChallenges() {
    const { tokenV3, user } = this.props.auth;

    /* Gets all active challenges. */
    this.props.getAllChallenges({ status: 'ACTIVE' }, tokenV3);
    this.props.getAllMarathonMatches({ status: 'ACTIVE' }, tokenV3);

    /* Gets all active challenges, where the vistor is participant. */
    if (user) {
      this.props.getAllChallenges({
        status: 'ACTIVE',
      }, tokenV3, null, user.handle);
      this.props.getAllMarathonMatches({
        status: 'ACTIVE',
      }, tokenV3, null, user.handle);
    }

    /* Gets some (50 + 50) past challenges and MMs. */
    this.props.getChallenges({ status: 'COMPLETED' }, { limit: 50 }, tokenV3);
    this.props.getMarathonMatches({ status: 'PAST' }, { limit: 50 }, tokenV3);

    /* Gets some (50 + 50) upcoming challenges and MMs. */
    this.props.getChallenges({ status: 'DRAFT' }, { limit: 50 }, tokenV3);
    this.props.getMarathonMatches({ status: 'DRAFT' }, { limit: 50 }, tokenV3);
  }

  loadMorePast() {
    const { tokenV3 } = this.props.auth;
    const { nextPage } = this.props.loadMore.past;
    this.props.setLoadMore('past', {
      loading: true,
    });
    console.log('LOAD MORE PAST CHALLENGES!');
    Promise.all([
      this.props.getChallenges({
        status: 'COMPLETED',
      }, { limit: 50, offset: 50 * nextPage }, tokenV3),
      this.props.getMarathonMatches({
        status: 'PAST',
      }, { limit: 50, offset: 50 * nextPage }, tokenV3),
    ]).then(() => console.log('READY!'));
  }

  /**
   * It takes one challenge object and check if it passes master filter
   * which defines which challenges should be displayed for the current community
   *
   * @param  {Object}  challenge object
   * @return {boolean} whether the item pass filter or not
   */
  masterFilterFunc(item) {
    let keyword;

    // if there is tag in props, use it as keyword
    if (this.props.tag) {
      keyword = this.props.tag;

    // if there is defined keyword param in the route, use it as keyword
    } else if (this.props.match && this.props.match.params && this.props.match.params.keyword) {
      keyword = this.props.match.params.keyword;

    // if keyword is not defined at all, don't filter
    } else {
      return true;
    }

    const techs = ` ${item.technologies.toLowerCase()} `;

    return !!(techs.indexOf(` ${keyword.toLowerCase()} `) >= 0);
  }

  render() {
    const {
      challenges,
      challengeSubtracks,
      challengeTags,
      challengeGroupId,
      listingOnly,
      selectBucket,
      sidebar,
    } = this.props;
    return (
      <div>
        {/* For demo we hardcode banner properties so we can disable max-len linting */}
        {/* eslint-disable max-len */}
        { !listingOnly ? (
          <Banner
            title="Challenges"
            text="Browse our available challenges and compete. Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut laoreet sodales nisi, quis iaculis nulla iaculis vitae. Donec sagittis faucibus lacus eget blandit. "
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
          activeBucket={sidebar.activeBucket}
          challenges={challenges}
          challengeSubtracks={challengeSubtracks}
          challengeTags={challengeTags}
          communityName={this.props.communityName}
          filterState={this.props.filter}
          getChallenges={this.props.getChallenges}
          getMarathonMatches={this.props.getMarathonMatches}
          loadingChallenges={Boolean(_.keys(this.props.pendingRequests).length)}
          selectBucket={selectBucket}
          loadMore={this.props.loadMore}
          loadMorePast={() => this.loadMorePast()}
          setFilterState={this.props.setFilter}
          setSort={this.props.setSort}
          sorts={this.props.sorts}

          /* OLD PROPS BELOW */
          challengeGroupId={challengeGroupId}
          filterFromUrl={this.props.location.hash}
          masterFilterFunc={this.masterFilterFunc}
          isAuth={!!this.props.auth.user}
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
  challengeGroupId: '',
  communityName: null,
  listingOnly: false,
  match: null,
  tag: null,
};

ListingContainer.propTypes = {
  challenges: PT.arrayOf(PT.shape({})).isRequired,
  challengeSubtracks: PT.arrayOf(PT.string).isRequired,
  challengeTags: PT.arrayOf(PT.string).isRequired,
  filter: PT.shape().isRequired,
  pendingRequests: PT.shape().isRequired,
  communityName: PT.string,
  getAllChallenges: PT.func.isRequired,
  getAllMarathonMatches: PT.func.isRequired,
  getChallenges: PT.func.isRequired,
  getMarathonMatches: PT.func.isRequired,
  markHeaderMenu: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  sidebar: PT.shape({
    activeBucket: PT.string.isRequired,
  }).isRequired,
  sorts: PT.shape().isRequired,
  setSort: PT.func.isRequired,
  setLoadMore: PT.func.isRequired,
  loadMore: PT.shape().isRequired,

  /* OLD PROPS BELOW */
  listingOnly: PT.bool,
  match: PT.shape({
    params: PT.shape({
      keyword: PT.string,
    }),
  }),
  challengeGroupId: PT.string,
  tag: PT.string,
  location: PT.shape({
    hash: PT.string,
  }).isRequired,
  auth: PT.shape({
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  ..._.omit(state.challengeListing, ['filterPanel']),
});

/**
 * Loads into redux all challenges matching the request.
 * @param {Function} dispatch
 */
function getAllChallenges(dispatch, ...rest) {
  const uuid = shortid();
  dispatch(actions.challengeListing.getInit(uuid));
  dispatch(actions.challengeListing.getAllChallenges(uuid, ...rest));
}

/**
 * Loads into redux all MMs matching the request.
 * @param {Function} dispatch
 */
function getAllMarathonMatches(dispatch, ...rest) {
  const uuid = shortid();
  dispatch(actions.challengeListing.getInit(uuid));
  dispatch(actions.challengeListing.getAllMarathonMatches(uuid, ...rest));
}

/**
 * Callback for loading challenges satisfying to the specified criteria.
 * All arguments starting from second should match corresponding arguments
 * of the getChallenges action.
 * @param {Function} dispatch
 */
function getChallenges(dispatch, ...rest) {
  const uuid = shortid();
  dispatch(actions.challengeListing.getInit(uuid));
  const action = actions.challengeListing.getChallenges(uuid, ...rest);
  dispatch(action);
  return action.payload;
}

/**
 * Callback for loading marathon matches satisfying to the specified criteria.
 * All arguments starting from second should match corresponding arguments
 * of the getChallenges action.
 * @param {Function} dispatch
 */
function getMarathonMatches(dispatch, filters, ...rest) {
  const uuid = shortid();
  dispatch(actions.challengeListing.getInit(uuid));
  const f = _.clone(filters);
  if (f.status === 'COMPLETED') f.status = 'PAST';
  const action = actions.challengeListing.getMarathonMatches(uuid, f, ...rest);
  dispatch(action);
  // TODO: This is hack to make the Redux loading of challenges to work
  // with older code inside the InfiniteList, until it is properly
  // refactored.
  return action.payload;
}

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing;
  const ah = headerActions.topcoderHeader;
  const sa = sidebarActions.challengeListing.sidebar;
  return {
    getAllChallenges: (...rest) => getAllChallenges(dispatch, ...rest),
    getAllMarathonMatches: (...rest) =>
      getAllMarathonMatches(dispatch, ...rest),
    getChallenges: (...rest) => getChallenges(dispatch, ...rest),
    getMarathonMatches: (...rest) => getMarathonMatches(dispatch, ...rest),
    reset: () => dispatch(a.reset()),
    selectBucket: bucket => dispatch(sa.selectBucket(bucket)),
    setFilter: state => dispatch(a.setFilter(state)),
    setLoadMore: (...rest) => dispatch(a.setLoadMore(...rest)),
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
