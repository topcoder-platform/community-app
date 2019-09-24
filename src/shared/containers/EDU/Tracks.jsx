/**
 * Container for EDU Portal tracks page.
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
import TracksTree from 'components/Contentful/TracksTree/TracksTree';
import LoadingIndicator from 'components/LoadingIndicator';
import TracksFilter from 'components/Contentful/TracksFilter/TracksFilter';
// SVGs & Assets
import Dev from 'assets/images/img-development.png';
import Design from 'assets/images/img_design.png';
import DS from 'assets/images/img-data-science.png';
import Algo from 'assets/images/img-algorithm.png';
import QA from 'assets/images/img-QA.png';
// Partials
import ResultTabs from './partials/ResultTabs';
// CSS
import tracksTheme from './styles/tracks.scss';

const TRACK_COLORS = {
  Development: '#8AFB8A',
  Design: '#50ADE8',
  'Data Science': '#FFA45D',
  'Competitive Programming': '#FFA45D',
  QA: '#8AFB8A',
};
const TRACK_IMAGES = {
  Development: Dev,
  Design,
  'Data Science': DS,
  'Competitive Programming': Algo,
  QA,
};

export default class EDUTracks extends React.Component {
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
    this.onTreeClick = this.onTreeClick.bind(this);
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
    // Get counters
    this.apiService.getEDUContent({
      track: urlQuery.track,
    })
      .then((content) => {
        this.setState({
          articleCnt: content.Article.total,
          videoCnt: content.Video.total,
          forumCnt: content['Forum post'].total,
        });
      });
  }

  /**
   * Tracks tree click on items
   * @param {Object} selectedItem
   */
  onTreeClick(selectedItem) {
    // Update the counters if track changed
    const { query } = this.state;
    // if track is not empty, it means clicked from child, otherwise clicked from parent
    const track = selectedItem.track ? selectedItem.track : selectedItem.title;
    const tax = selectedItem.track ? selectedItem.title : null;
    if (query.track !== track) {
      this.apiService.getEDUContent({
        track,
      })
        .then((content) => {
          this.setState({
            articleCnt: content.Article.total,
            videoCnt: content.Video.total,
            forumCnt: content['Forum post'].total,
          });
        });
    }
    // Update the state
    this.setState({
      query: _.merge(query, {
        track,
        tax,
      }),
    });
    // Update the url query
    updateQuery({
      track,
      tax,
    });
  }

  onApplyFilter(filterState) {
    const queryUpdate = {
      author: filterState.selectedAuthor,
      tags: filterState.tags,
      startDate: filterState.startDate.format(),
      endDate: filterState.endDate.format(),
    };
    // Update the state
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        author: queryUpdate.author,
        tags: queryUpdate.tags,
        startDate: queryUpdate.startDate,
        endDate: queryUpdate.endDate,
      },
    }));
    // Update the url query
    updateQuery({ ...queryUpdate });
  }

  render() {
    const {
      taxonomy, query, tree, isShowFilter,
      articleCnt, videoCnt, forumCnt,
    } = this.state;
    // This container needs at least those variables
    // to be able to render meaningful data
    if (!taxonomy) return <LoadingIndicator />;
    return (
      <div className={tracksTheme.container}>
        {/* Banner */}
        <div
          className={tracksTheme.bannerContainer}
          style={{ backgroundColor: TRACK_COLORS[query.track || 'Design'] }}
        >
          {
            TRACK_IMAGES[query.track] ? (
              <img src={TRACK_IMAGES[query.track]} alt="Track banner" className={tracksTheme.bannerImage} />
            ) : null
          }
          <div className={tracksTheme.bannerWrapp}>
            <h1 className={tracksTheme.bannerText}>{query.track || 'THRIVE'}</h1>
            <div className={tracksTheme.bannerCounters}>
              <div className={tracksTheme.bannerCounterWrap}>
                <div className={tracksTheme.bannerCount}>{articleCnt}</div>
                <div className={tracksTheme.bannerCountLabel}>articles</div>
              </div>
              <div className={tracksTheme.bannerCounterWrap}>
                <div className={tracksTheme.bannerCount}>{videoCnt}</div>
                <div className={tracksTheme.bannerCountLabel}>videos</div>
              </div>
              <div className={tracksTheme.bannerCounterWrap}>
                <div className={tracksTheme.bannerCount}>{forumCnt}</div>
                <div className={tracksTheme.bannerCountLabel}>forum posts</div>
              </div>
            </div>
          </div>
          <div className={tracksTheme.searchBarWrapp}>
            <SearchBar />
          </div>
        </div>
        <div className={tracksTheme.shapeBanner} />
        {/* Main track content */}
        <div className={tracksTheme.main}>
          <div className={tracksTheme.tracksTree}>
            {
              tree.length ? (
                <TracksTree
                  list={tree}
                  onItemClick={this.onTreeClick}
                />
              ) : <LoadingIndicator />
            }
          </div>
          <div className={tracksTheme.tracksContent}>
            <div className={tracksTheme.tracksContentTop}>
              <h3 className={tracksTheme.trackTitle}>{query.tax || query.track}</h3>
              <button
                className={tracksTheme.filterToggle}
                type="button"
                onClick={() => { this.setState({ isShowFilter: !isShowFilter }); }}
              >
                {isShowFilter ? 'Hide filter' : 'Show filter'}
              </button>
            </div>
            <div className={isShowFilter ? tracksTheme.filterVisible : tracksTheme.filterHidden}>
              <TracksFilter
                onClose={() => this.setState({ isShowFilter: false })}
                onApply={this.onApplyFilter}
                selectedAuthor={query.author}
                tags={query.tags}
                startDate={query.startDate ? moment(query.startDate) : undefined}
                endDate={query.endDate ? moment(query.endDate) : undefined}
              />
            </div>
            <ResultTabs query={query} taxonomy={taxonomy} />
          </div>
        </div>
        {/* Top Design Videos & Recommended for you sections are Contentful editable via ID */}
        <Viewport
          id="CS6tscFxLUCZoPzWNB9Hv"
          spaceName="EDU"
          baseUrl={config.TC_EDU_BASE_PATH}
        />
      </div>
    );
  }
}
