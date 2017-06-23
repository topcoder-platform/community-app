/**
 *  This component is responsible for displaying and handling the container
 *  interaction of challenges with respect to their filter categories.
 *
 *  It uses the InfiniteList component to display the challenges in a list. It
 *  passes into InfiniteList all the necessary properties such as the selected
 *  sorting and filtering settings for rendering the challenges in the right
 *  order and format. Refer to that component for the list behaviour.
 *
 *  It will also handle sorting in each category container and store the setting
 *  in sessionStorage. It will load the setting if it exists at the begining. It
 *  uses the SortingSelectBar component for letting the user select the sorting
 *  option for each challenge category.
 *
 *  It loads from files, challengeFilters.js and sortingFunctionStore.js. The first
 *  file lets the component know all the challenge categories with their respective
 *  filtering settings, sorting options, API endpoints and other information. The
 *  second file lets the component know how to sort challenges for different sorting
 *  settings. These files are kept in this folder for now but should be moved to
 *  another place if it is more appropriate.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
// import { normalizeChallenge, normalizeMarathonMatch } from 'reducers/challenge-listing';
// import SortingSelectBar from 'components/SortingSelectBar';
import { BUCKETS, getBuckets } from 'utils/challenge-listing/buckets';
import Bucket from './Bucket';
// import InfiniteList from '../InfiniteList';
import defaultFilters from './challengeFilters';
/*
import defaultSortingFunctionStore from './sortingFunctionStore';
import {
  getChallengeCardPlaceholder,
  getChallengeCard,
  getExpandBucketButton,
} from './childComponentConstructorHelpers';
import {
  getFilterChallengesStore,
  getFilterSortingStore,
  getFilterTotalCountStore,
} from './storeConstructorHelpers';
import {
  findFilterByName,
  filterFilterChallengesStore,
  isChallengeCategoryExpandable,
} from './generalHelpers';
*/
import './style.scss';

export default function ChallengeCardContainer({
  activeBucket,
  auth,
  challenges,
  loadMore,
  loadMorePast,
  selectBucket,
  setFilterState,
  setSort,
  sorts,
}) {
  const buckets = getBuckets(_.get(auth.user, 'handle'));

  if (activeBucket !== BUCKETS.ALL) {
    return (
      <div styleName="challengeCardContainer">
        <Bucket
          bucket={buckets[activeBucket]}
          challenges={challenges}
          expanded
          loadingMore={activeBucket === BUCKETS.PAST ? loadMore.past.loading : null}
          loadMore={activeBucket === BUCKETS.PAST ? loadMorePast : null}
          setFilterState={setFilterState}
          setSort={sort => setSort(activeBucket, sort)}
          sort={sorts[activeBucket]}
        />
      </div>
    );
  }

  const getBucket = bucket => (
    <Bucket
      bucket={buckets[bucket]}
      challenges={challenges}
      expand={() => selectBucket(bucket)}
      // loadMore={bucket === BUCKETS.PAST ? loadMorePast : null}
      setFilterState={setFilterState}
      setSort={sort => setSort(bucket, sort)}
      sort={sorts[bucket]}
    />
  );

  return (
    <div styleName="challengeCardContainer">
      {auth.user ? getBucket(BUCKETS.MY) : null}
      {getBucket(BUCKETS.OPEN_FOR_REGISTRATION)}
      {getBucket(BUCKETS.ONGOING)}
      {getBucket(BUCKETS.PAST)}
    </div>
  );
}

/*
const initialNumberToShow = 10;
const batchLoadNumber = 50;
const challengeUniqueIdentifier = 'id';
*/

// class ChallengeCardContainer extends Component {
  /*
  constructor(props) {
    super(props);
    const { challenges, filters, currentFilterName, expanded } = props;
    let userSessionFilterSortingStore;

    if (typeof sessionStorage !== 'undefined' && sessionStorage.challengeFilterSortingStore) {
      userSessionFilterSortingStore = JSON.parse(sessionStorage.challengeFilterSortingStore);
    }

    this.state = {
      filterChallengesStore: getFilterChallengesStore(filters, challenges),
      currentFilter: findFilterByName(currentFilterName, filters),
      filterSortingStore: getFilterSortingStore(filters, userSessionFilterSortingStore),
      sortingFunctionStore: defaultSortingFunctionStore,
      filterTotalCountStore: {},
      expanded,
      isLoaded: false,
      isLoading: false,
    };
  }

  /**
   * ChallengeCardContainer was brought from another project without server rendering support.
   * To make rendering on the server consistent with the client rendering, we have to make sure all
   * setState calls will preform after this component is mounted. So we moved all the code which
   * can call setState from the constructor to here. Also we added some logic to make sure we
   * load data only once.
   */
  /*
  componentDidMount() {
    if (!this.state.isLoading && !this.state.isLoaded) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ isLoading: true });
      getFilterTotalCountStore().then(
        filterTotalCountStore => this.setState({
          filterTotalCountStore,
          isLoading: false,
          isLoaded: true,
        }),
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { challenges, filters, currentFilterName, expanded } = nextProps;
    const { filterSortingStore } = this.state;

    this.setState({
      filterChallengesStore: getFilterChallengesStore(filters, challenges),
      currentFilter: findFilterByName(currentFilterName, filters),
      filterSortingStore: getFilterSortingStore(filters, filterSortingStore),
      expanded,
    });
  }

  onExpandFilterResult(filterName) {
    this.setState({
      currentFilter: findFilterByName(filterName, this.props.filters),
      expanded: true,
    }, this.props.onExpandFilterResult(filterName)); // pass filterName
  }

  onSortingSelect(filterName, sortingOptionName) {
    const filterSortingStore = _.assign(
      {},
      this.state.filterSortingStore,
      { [filterName]: sortingOptionName },
    );
    sessionStorage.challengeFilterSortingStore = JSON.stringify(filterSortingStore);

    this.setState({ filterSortingStore });
  }

  render() {
    const { auth, challenges } = this.props;

    const buckets = getBuckets(_.get(auth.user, 'handle'));

    const getBucket = bucket => (
      <Bucket
        bucket={buckets[bucket]}
        challenges={challenges}
      />
    );

    return (
      <div styleName="challengeCardContainer">
        {auth.user ? getBucket(BUCKETS.MY) : null}
        {getBucket(BUCKETS.OPEN_FOR_REGISTRATION)}
        {getBucket(BUCKETS.ONGOING)}
        {getBucket(BUCKETS.PAST)}
      </div>
    );

    /*
    const filterChallengesStore = filterFilterChallengesStore(
      this.state.filterChallengesStore,
      currentFilter,
    );

    return (
      <div styleName="challengeCardContainer">
        {
          Object.keys(filterChallengesStore).map((filterName) => {
            let expansionButtion;
            const unfilteredChallenges = filterChallengesStore[filterName];
            const filteredChallenges = _.sortBy(_.filter(unfilteredChallenges, additionalFilter),
             sortingFunctionStore[filterSortingStore[filterName]]);
            let initialChallenges = unfilteredChallenges;

            const challengeCountTotal = filterTotalCountStore[filterName];
            const trimmedFilterName = filterName.replace(/\s+/g, '-').toLowerCase();
            const filter = findFilterByName(filterName, filters);
            const { sortingOptions } = filter;
            const { length: filteredChallengeNumber } = filteredChallenges;
            const { length: unFilteredChallengeNumber } = unfilteredChallenges;
            const challengeCategoryExpandable = isChallengeCategoryExpandable({
              initialNumberToShow,
              filteredChallengeNumber,
              unFilteredChallengeNumber,
              challengeCountTotal,
            });

            if (!expanded) initialChallenges = filteredChallenges.slice(0, initialNumberToShow);
            if (!expanded && challengeCategoryExpandable) {
              expansionButtion = getExpandBucketButton(
                () => this.onExpandFilterResult(filterName),
                style['view-more'],
              );
            }

            return (
              <div styleName="category-challenges-container" key={`${trimmedFilterName}-container`}>
                <SortingSelectBar
                  sortingOptions={sortingOptions}
                  filterName={filterName}
                  onSortingSelect={optionName => this.onSortingSelect(filterName, optionName)}
                  value={filterSortingStore[filterName]}
                  key={`${trimmedFilterName}-sorting-bar`}
                />
                <InfiniteList
                  items={initialChallenges}
                  itemCountTotal={
                    expanded
                    ? challengeCountTotal || initialChallenges.length
                    : initialChallenges.length
                  }
                  renderItem={_.partialRight(
                    getChallengeCard,
                    this.props.config,
                    tag => this.props.onTechTagClicked(tag),
                  )}
                  renderItemTemplate={getChallengeCardPlaceholder}
                  fetchItems={(pageIndex, pageSize = 50) => {
                    const f = {};
                    if (filter.filteringParams.status) {
                      f.status = filter.filteringParams.status;
                    }
                    if (this.props.challengeGroupId) {
                      f.groupIds = this.props.challengeGroupId;
                    }
                    const fm = _.clone(f);
                    if (fm.status === 'completed') fm.status = 'past';
                    return Promise.all([
                      this.props.getChallenges(f, {
                        limit: pageSize,
                        offset: pageIndex * pageSize,
                      },
                      this.props.auth.tokenV3,
                      undefined,
                      filter.filteringParams.user ?
                      this.props.auth.user.handle && this.props.auth.user :
                      undefined).then(res =>
                        res.challenges.map(i => normalizeChallenge(i)),
                      ),
                      this.props.getMarathonMatches(f, {
                        limit: pageSize,
                        offset: pageIndex * pageSize,
                      },
                      this.props.auth.tokenV3,
                      undefined,
                      filter.filteringParams.user && this.props.auth.user ?
                      this.props.auth.user.handle : undefined).then(res =>
                        res.challenges.map(i => normalizeMarathonMatch(i)),
                      ),
                    ]).then(([a, b]) => a.concat(b));
                  }}
                  batchNumber={batchLoadNumber}
                  filter={additionalFilter}
                  tempDataFilter={filterName}
                  sort={sortingFunctionStore[filterSortingStore[filterName]]}
                  uniqueIdentifier={challengeUniqueIdentifier}
                />
                {expansionButtion}
              </div>
            );
          })
        }
      </div>
    );
    */
  // }
// }

ChallengeCardContainer.defaultProps = {
  challengeGroupId: '',
  onTechTagClicked: _.noop,
  onExpandFilterResult: _.noop,
  filters: defaultFilters,
  currentFilterName: '',
  challenges: [],
  expanded: false,
};

ChallengeCardContainer.propTypes = {
  activeBucket: PT.string.isRequired,
  auth: PT.shape({
    tokenV3: PT.string,
    user: PT.shape({
      handle: PT.string,
    }),
  }).isRequired,
  // challengeGroupId: PT.string,
  // onTechTagClicked: PT.func,
  // onExpandFilterResult: PT.func,
  // additionalFilter: PT.func,
  challenges: PT.arrayOf(PT.shape()),
  loadMore: PT.shape({}).isRequired,
  loadMorePast: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,

  /*
  currentFilterName: PT.string,

  filters: PT.arrayOf(PT.shape({
    check: PT.func,
    name: PT.string,
    getApiUrl: PT.func,
    sortingOptions: PT.arrayOf(PT.string),
    allIncluded: PT.bool,
    info: PT.shape(),
  })),
  */
  // expanded: PT.oneOfType([PT.bool, PT.string]),
  // getChallenges: PT.func.isRequired,
  // getMarathonMatches: PT.func.isRequired,
};

// export default ChallengeCardContainer;
