/* eslint-disable no-plusplus */
/**
 * Container for EDU Portal tracks page.
 */
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { config, isomorphy } from 'topcoder-react-utils';
import MetaTags from 'components/MetaTags';
import Viewport from 'components/Contentful/Viewport';
import SearchBar from 'components/Contentful/SearchBar/SearchBar';
import { getService } from 'services/contentful';
import { tracksTreeBuilder } from 'utils/contentful';
import { updateQuery } from 'utils/url';
import qs from 'qs';
import TracksTree from 'components/Contentful/TracksTree/TracksTree';
import LoadingIndicator from 'components/LoadingIndicator';
import TracksFilter from 'components/Contentful/TracksFilter/TracksFilter';
import MediaQuery from 'react-responsive';
// SVGs & Assets
import Dev from 'assets/images/img-development.png';
import Design from 'assets/images/img_design.png';
import DS from 'assets/images/img-data-science.png';
import Algo from 'assets/images/img-algorithm.png';
import QA from 'assets/images/img-QA.png';
import Topcoder from 'assets/images/img-Topcoder.png';
import iconFilterArrow from 'assets/images/tc-edu/icon-filter-arrow.png';
// Partials
import ResultTabs from './partials/ResultTabs';
// CSS
import tracksTheme from './styles/tracks.scss';

const TRACK_BANNER_BACK_COLORS = {
  Development: '#8AFB8A',
  Design: '#50ADE8',
  'Data Science': '#FFA45D',
  'Competitive Programming': '#FFA45D',
  QA: '#8AFB8A',
  Topcoder: '#2A2A2A',
};
const TRACK_IMAGES = {
  Development: Dev,
  Design,
  'Data Science': DS,
  'Competitive Programming': Algo,
  QA,
  Topcoder,
};
const SORT_BY_OPTIONS = [
  { label: 'Content Publish Date', selected: true },
  { label: 'Likes', selected: false },
];

export default class EDUTracks extends React.Component {
  constructor(props) {
    super(props);
    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
    // init state
    this.state = {
      query: {
        tags: [],
        sortBy: 'Content Publish Date',
      },
      tree: [],
      isShowFilter: true,
    };
    // bindings
    this.onTreeClick = this.onTreeClick.bind(this);
    this.onApplyFilter = this.onApplyFilter.bind(this);
  }

  componentDidMount() {
    const { query } = this.state;
    // set current query
    let urlQuery = {};
    if (isomorphy.isClientSide()) {
      urlQuery = qs.parse(window.location.search.slice(1));
      // eslint-disable-next-line no-nested-ternary
      urlQuery.tags = _.isArray(urlQuery.tags)
        ? urlQuery.tags : (urlQuery.tags ? [urlQuery.tags] : []);
      if (urlQuery.startDate) urlQuery.startDate = moment(urlQuery.startDate).format();
      if (urlQuery.endDate) urlQuery.endDate = moment(urlQuery.endDate).format();
      // validate track string in URL query
      // set CP if missing or wrong
      const tracks = _.keys(TRACK_BANNER_BACK_COLORS);
      if (!urlQuery.track || _.indexOf(tracks, urlQuery.track) === -1) {
        urlQuery.track = 'Competitive Programming';
        updateQuery({
          ...query,
          ...urlQuery,
        });
      }
      this.setState({
        query: {
          ...query,
          ...urlQuery,
        },
        isShowFilter: window.screen.width >= 769,
      });
    }
    // Fire API requests
    // Get the EDU taxonomy
    this.apiService.getEDUTaxonomy()
      .then((taxonomy) => {
        if (urlQuery.tax) {
          // check if tax exists or is wrong
          const foundSome = _.some(
            _.flatten(
              _.values(taxonomy),
            ), cat => cat.name.toLowerCase() === urlQuery.tax.toLowerCase(),
          );
          if (!foundSome) {
            delete urlQuery.tax;
            updateQuery({
              ...query,
              ...urlQuery,
            });
            this.setState({
              query: {
                ...query,
                ...urlQuery,
              },
            });
          }
        }
        const tree = tracksTreeBuilder(taxonomy, urlQuery);
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
    const urlQuery = qs.parse(window.location.search.slice(1));
    updateQuery({
      ...urlQuery,
      track,
      tax,
    });
  }

  onApplyFilter(filterState) {
    const urlQuery = qs.parse(window.location.search.slice(1));
    const queryUpdate = {
      ...urlQuery,
      author: filterState.selectedAuthor,
      tags: filterState.tags,
      startDate: filterState.startDate ? moment(filterState.startDate).format('YYYY-MM-DD') : null,
      endDate: filterState.endDate ? moment(filterState.endDate).format('YYYY-MM-DD') : null,
      sortBy: _.find(filterState.sortBy, { selected: true }).label,
    };
    // Update the state
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        author: queryUpdate.author,
        tags: queryUpdate.tags,
        startDate: queryUpdate.startDate,
        endDate: queryUpdate.endDate,
        sortBy: queryUpdate.sortBy,
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
    const title = 'Tutorials And Workshops That Matter | Thrive | Topcoder';
    const description = 'Thrive is our vault of content that we have been gathering over the years. It is full of tutorials and workshops that matter. Grow with us!';
    const metaTags = (
      <MetaTags
        description={description}
        title={title}
        feed={config.URL.THRIVE_FEED}
        feedTitle="Topcoder Thrive - RSS feed"
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
    // find selected sortBy
    const sortByState = SORT_BY_OPTIONS.map((o) => {
      // eslint-disable-next-line no-param-reassign
      o.selected = o.label === query.sortBy;
      return o;
    });
    // filter cnt
    let filterCnt = 0;
    if (query.author && query.author !== 'All authors') filterCnt++;
    if (query.tags.length) filterCnt++;
    if (query.startDate) filterCnt++;
    if (query.endDate) filterCnt++;


    return (
      <div className={tracksTheme.container}>
        { metaTags }
        {/* Banner */}
        <div
          className={tracksTheme.bannerContainer}
          style={{ backgroundColor: TRACK_BANNER_BACK_COLORS[query.track || 'Design'] }}
        >
          {
            TRACK_IMAGES[query.track] ? (
              <img src={TRACK_IMAGES[query.track]} alt="Track banner" className={tracksTheme.bannerImage} />
            ) : null
          }
          <div className={tracksTheme.bannerWrapp} style={query.track === 'Topcoder' ? { color: '#fff' } : {}}>
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
              <MediaQuery
                maxDeviceWidth={768}
                onChange={(match) => {
                  if (!match) {
                    if (!isShowFilter) this.setState({ isShowFilter: true });
                  }
                }}
              >
                <button
                  className={tracksTheme.filterToggle}
                  type="button"
                  onClick={() => { this.setState({ isShowFilter: !isShowFilter }); }}
                >
                  FILTER{filterCnt ? ` (${filterCnt}) ` : null}<img className={tracksTheme.filterArrow} src={iconFilterArrow} alt="filter-arrow-mobile" />
                </button>
              </MediaQuery>
            </div>
            <div className={isShowFilter ? tracksTheme.filterVisible : tracksTheme.filterHidden}>
              <TracksFilter
                onClose={() => this.setState({ isShowFilter: false })}
                onApply={this.onApplyFilter}
                selectedAuthor={query.author}
                tags={query.tags}
                startDate={query.startDate}
                endDate={query.endDate}
                sortBy={sortByState}
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
