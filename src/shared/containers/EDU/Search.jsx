/**
 * Container for EDU Portal search page.
 */
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { config, isomorphy } from 'topcoder-react-utils';
import Viewport from 'components/Contentful/Viewport';
import SearchBar from 'components/Contentful/SearchBar/SearchBar';
import { getService } from 'services/contentful';
import { tracksTreeBuilder } from 'utils/contentful';
import { updateQuery } from 'utils/url';
import qs from 'qs';
import LoadingIndicator from 'components/LoadingIndicator';
import SearchPageFilter from 'components/Contentful/SearchPageFilter/SearchPageFilter';
// Partials
import ResultTabs from './partials/ResultTabs';
// CSS
import searchTheme from './styles/search.scss';

export default class EDUSearch extends React.Component {
  constructor(props) {
    super(props);
    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
    // init state
    this.state = {
      query: {
        tags: [],
      },
      tree: [],
      isShowFilter: false,
    };
    // bindings
    this.onApplyFilter = this.onApplyFilter.bind(this);
  }

  componentDidMount() {
    // set current query
    let urlQuery = {};
    if (isomorphy.isClientSide()) {
      urlQuery = qs.parse(window.location.search.slice(1));
      // eslint-disable-next-line no-nested-ternary
      urlQuery.tags = _.isArray(urlQuery.tags)
        ? urlQuery.tags : (urlQuery.tags ? [urlQuery.tags] : []);
      this.setState({
        query: urlQuery,
      });
      // Update the url query
      updateQuery({ ...urlQuery });
    }
    // Fire API requests
    // Get the EDU taxonomy
    this.apiService.getEDUTaxonomy()
      .then((taxonomy) => {
        const { query } = this.state;
        const tree = tracksTreeBuilder(taxonomy, query);
        this.setState({
          tree,
          taxonomy,
        });
      });
  }

  onApplyFilter(filterState) {
    const queryUpdate = {
      author: filterState.selectedAuthor,
      tags: filterState.tags,
      startDate: filterState.startDate.format(),
      endDate: filterState.endDate.format(),
      track: filterState.selectedCategory ? filterState.selectedCategory.title : null,
      tax: filterState.selectedCategory ? _.map(
        _.filter(filterState.selectedCategory.items, item => item.selected),
        item => item.title,
      ) : null,
    };
    // Update the state
    this.setState({
      query: queryUpdate,
    });
    // Update the url query
    updateQuery({ ...queryUpdate });
  }

  render() {
    const {
      taxonomy, query, tree, isShowFilter,
    } = this.state;
    // This container needs at least those variables
    // to be able to render meaningful data
    if (!taxonomy) return <LoadingIndicator />;
    return (
      <div className={searchTheme.container}>
        {/* Banner */}
        <div className={searchTheme.bannerContainer}>
          <div className={searchTheme.searchBarWrapp}>
            <SearchBar inputlVal={query.phrase} />
          </div>
        </div>
        <div className={searchTheme.shapeBanner} />
        {/* Main track content */}
        <div className={searchTheme.main}>
          <div className={searchTheme.searchBarLeft}>
            <SearchPageFilter
              isShowInMobile={isShowFilter}
              onClose={() => { this.setState({ isShowFilter: false }); }}
              onApply={this.onApplyFilter}
              selectedAuthor={query.author}
              tags={query.tags}
              startDate={query.startDate ? moment(query.startDate) : undefined}
              endDate={query.endDate ? moment(query.endDate) : undefined}
              selectedCategory={query.track}
              categories={tree}
            />
          </div>
          <div className={searchTheme.tracksContent}>
            <div className={searchTheme.tracksContentTop}>
              <h3 className={searchTheme.trackTitle}>Search Results</h3>
              <button
                className={searchTheme.filterToggle}
                type="button"
                onClick={() => { this.setState({ isShowFilter: !isShowFilter }); }}
              >
                {isShowFilter ? 'Hide filter' : 'Show filter'}
              </button>
            </div>
            <ResultTabs query={query} taxonomy={taxonomy} />
          </div>
        </div>
        {/* Recommended for you section is Contentful editable via ID */}
        <Viewport
          id="5QtMUIJ8Ia9EJkz7XDh6li"
          spaceName="EDU"
          baseUrl={config.TC_EDU_BASE_PATH}
        />
      </div>
    );
  }
}
