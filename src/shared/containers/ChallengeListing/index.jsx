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
import SideBarFilter, { MODE as SideBarFilterModes } from 'components/challenge-listing/SideBarFilters/SideBarFilter';
import style from './styles.scss';

// helper function to de-serialize query string to filter object
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

let mounted = false;

// The container component
class ChallengeListingPageContainer extends React.Component {

  constructor(props) {
    super(props);
    this.masterFilterFunc = this.masterFilterFunc.bind(this);
  }

  componentDidMount() {
    const { challengeListing: cl } = this.props;

    this.props.markHeaderMenu();

    if (mounted) {
      logger.error('Attempt to mount multiple instances of ChallengeListingPageContainer at the same time!');
    } else mounted = true;
    this.loadChallenges();

    if (!cl.loadingChallengeSubtracks) this.props.getChallengeSubtracks();
    if (!cl.loadingChallengeTags) this.props.getChallengeTags();

    /* Get filter from the URL hash, if necessary. */
    const filter = this.props.location.hash.slice(1);
    if (filter && filter !== this.props.challengeListing.filter) {
      this.props.setFilter(filter);
    } else if (this.props.challengeGroupId) {
      const f = deserialize(this.props.challengeListing.filter);
      f.groupId = this.props.challengeGroupId;
      this.props.setFilter(f.getURLEncoded());
    }
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
    this.props.getChallenges({ status: 'COMPLETED' }, {}, tokenV3);
    this.props.getMarathonMatches({ status: 'PAST' }, {}, tokenV3);
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
      challengeGroupId,
      challengeListing: cl,
      listingOnly,
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
          challenges={cl.challenges}
          challengeSubtracks={cl.challengeSubtracks}
          challengeTags={cl.challengeTags}
          communityName={this.props.communityName}
          filter={this.props.challengeListing.filter}
          filterState={this.props.challengeListing.filterState}
          getChallenges={this.props.getChallenges}
          getMarathonMatches={this.props.getMarathonMatches}
          loadingChallenges={Boolean(_.keys(this.props.challengeListing.pendingRequests).length)}
          setFilter={(filter) => {
            const f = encodeURI(filter);
            this.props.history.replace(`#${f}`);
            if (f !== this.props.challengeListing.filter) {
              this.props.setFilter(f);
            }
          }}
          setFilterState={this.props.setFilterState}
          searchText={this.props.challengeListing.searchText}
          setSearchText={this.props.setSearchText}

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

ChallengeListingPageContainer.defaultProps = {
  challengeGroupId: '',
  communityName: null,
  listingOnly: false,
  match: null,
  tag: null,
};

ChallengeListingPageContainer.propTypes = {
  challengeListing: PT.shape({
    challenges: PT.arrayOf(PT.shape({})).isRequired,
    filter: PT.string.isRequired,
    filterState: PT.shape.isRequired,
    pendingRequests: PT.shape({}).isRequired,
    searchText: PT.string.isRequired,
  }).isRequired,
  communityName: PT.string,
  getAllChallenges: PT.func.isRequired,
  getAllMarathonMatches: PT.func.isRequired,
  getChallenges: PT.func.isRequired,
  getChallengeSubtracks: PT.func.isRequired,
  getChallengeTags: PT.func.isRequired,
  getMarathonMatches: PT.func.isRequired,
  markHeaderMenu: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  setSearchText: PT.func.isRequired,

  /* OLD PROPS BELOW */
  listingOnly: PT.bool,
  match: PT.shape({
    params: PT.shape({
      keyword: PT.string,
    }),
  }),
  challengeGroupId: PT.string,
  tag: PT.string,
  history: PT.shape({
    replace: PT.func.isRequired,
  }).isRequired,
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
  challengeListing: {
    ...state.challengeListing,
    filter: decodeURIComponent(state.challengeListing.filter),
  },
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
  return {
    getAllChallenges: (...rest) => getAllChallenges(dispatch, ...rest),
    getAllMarathonMatches: (...rest) =>
      getAllMarathonMatches(dispatch, ...rest),
    getChallenges: (...rest) => getChallenges(dispatch, ...rest),
    getChallengeSubtracks: () => {
      dispatch(a.getChallengeSubtracksInit());
      dispatch(a.getChallengeSubtracksDone());
    },
    getChallengeTags: () => {
      dispatch(a.getChallengeTagsInit());
      dispatch(a.getChallengeTagsDone());
    },
    getMarathonMatches: (...rest) => getMarathonMatches(dispatch, ...rest),
    reset: () => dispatch(a.reset()),
    setFilter: f => dispatch(a.setFilter(f)),
    setFilterState: state => dispatch(a.setFilterState(state)),
    markHeaderMenu: () =>
      dispatch(ah.setCurrentNav('Compete', 'All Challenges')),
    setSearchText: text => dispatch(a.setSearchText(text)),
  };
}

const ChallengeListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeListingPageContainer);

export default ChallengeListingContainer;
