/**
 * Container for EDU Portal search page.
 */
import _ from 'lodash';
import React from 'react';
import { config, isomorphy } from 'topcoder-react-utils';
import MetaTags from 'components/MetaTags';
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
      startDate: filterState.startDate.format('YYYY-MM-DD'),
      endDate: filterState.endDate.format('YYYY-MM-DD'),
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
    const title = 'Topcoder Thrive | Topcoder Community | Topcoder';
    const description = 'Thrive is our vault of content that we have been gathering over the years. It is full of tutorials and workshops that matter. Grow with us!';

    const metaTags = (
      <MetaTags
        description={description}
        title={title}
      />
    );
    // This container needs at least those variables
    // to be able to render meaningful data
    if (!taxonomy) {
      return (
        <React.Fragment>
          { metaTags }
          <LoadingIndicator />;
        </React.Fragment>
      );
    }
    return (
      <div className={searchTheme.container}>
        { metaTags }
        {/* Banner */}
        <div className={searchTheme.bannerContainer}>
          <div className={searchTheme.searchBarWrapp}>
            <SearchBar inputlVal={query.phrase || query.title} selectedFilter={query.phrase ? '1' : '0'} />
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
              startDate={query.startDate ? query.startDate : undefined}
              endDate={query.endDate ? query.endDate : undefined}
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
